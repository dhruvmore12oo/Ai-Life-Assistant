import { useState, useRef } from 'react';
import { Upload as UploadIcon, File as FileIcon, X, Loader2, Sparkles, CheckCircle, ArrowRight, Mic, Type, FileText, Image as ImageIcon, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaskAPI } from '../api/tasks';
import { useTasks } from '../context/TaskContext';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import type { Task } from '../types';

type TabType = 'image' | 'pdf' | 'audio' | 'text';

export function UploadPage() {
  const navigate = useNavigate();
  const { addTaskState } = useTasks();
  
  const [activeTab, setActiveTab] = useState<TabType>('image');
  
  // File & Text State
  const [file, setFile] = useState<File | null>(null);
  const [textPrompt, setTextPrompt] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [extractedTask, setExtractedTask] = useState<Task | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'voice-command.webm', { type: 'audio/webm' });
        setFile(audioFile);
        stream.getTracks().forEach(track => track.stop()); // Clean up mic
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access denied:', err);
      alert('Microphone access is required to use Voice Commands.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (activeTab === 'audio') return; // Disable drag/drop for audio strictly
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessFile = async () => {
    if (activeTab === 'text' && !textPrompt.trim()) return;
    if (activeTab !== 'text' && !file) return;

    try {
      setIsUploading(true);
      let response;

      if (activeTab === 'text') {
        response = await TaskAPI.uploadText(textPrompt);
      } else {
        response = await TaskAPI.uploadDocument(file!);
      }
      
      setExtractedTask(response.data);
    } catch (err: any) {
      console.error(err);
      alert(`Pipeline extraction rejected: ${err.message || 'Ensure your file or text is valid.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmTask = () => {
    if (extractedTask) {
      addTaskState(extractedTask);
      navigate('/');
    }
  };

  const getAcceptType = () => {
    if (activeTab === 'image') return 'image/png, image/jpeg';
    if (activeTab === 'pdf') return 'application/pdf';
    return '*/*';
  };

  const tabs = [
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'pdf', label: 'PDF Document', icon: FileText },
    { id: 'audio', label: 'Voice Command', icon: Mic },
    { id: 'text', label: 'Direct Text', icon: Type }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Data Extraction</h1>
        <p className="text-gray-500 mt-1">Upload files, drop PDFs, dictate audio, or just type a raw thought to automatically generate structured Tasks.</p>
      </div>

      {!extractedTask ? (
        <div className="space-y-6">
          {/* Segmented Control Tabs */}
          <div className="flex p-1 space-x-1 bg-gray-100/80 rounded-xl overflow-x-auto shadow-sm border border-gray-200/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { 
                    if (isRecording) stopRecording();
                    setActiveTab(tab.id as TabType); 
                    setFile(null); 
                    setTextPrompt(''); 
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-accent" : "")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <Card className="overflow-hidden border-border bg-white shadow-sm transition-all duration-300">
            <CardContent className="p-8 sm:p-12">
              {activeTab === 'text' ? (
                <div className="flex flex-col h-full space-y-5">
                  <label className="text-sm font-semibold text-gray-700">Type your raw thoughts...</label>
                  <textarea 
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    placeholder="Example: I need to remember to pay the electricity bill on April 15th before they charge late fees..."
                    className="w-full h-48 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors resize-none shadow-inner"
                  />
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={handleProcessFile}
                      disabled={isUploading || !textPrompt.trim()}
                      className="inline-flex justify-center items-center bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-xl text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-accent/70 disabled:cursor-wait"
                    >
                      {isUploading ? (
                        <><Loader2 className="w-5 h-5 mr-3 animate-spin" />Analyzing Language Matrix...</>
                      ) : (
                        <><Sparkles className="w-5 h-5 mr-3" />Generate Task from Text</>
                      )}
                    </button>
                  </div>
                </div>
              ) : activeTab === 'audio' && !file ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                      "relative flex items-center justify-center w-32 h-32 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4",
                      isRecording 
                        ? "bg-red-500 hover:bg-red-600 focus:ring-red-500/30 animate-pulse" 
                        : "bg-accent hover:bg-accent/90 focus:ring-accent/30"
                    )}
                  >
                    {isRecording ? (
                      <Square className="w-12 h-12 text-white" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                    {isRecording && (
                      <span className="absolute -top-2 -right-2 flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-white"></span>
                      </span>
                    )}
                  </button>
                  <h3 className="text-xl font-bold text-gray-900 mt-8">
                    {isRecording ? 'Listening actively...' : 'Tap to speak'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 text-center max-w-sm">
                    {isRecording 
                      ? "Speak your thoughts clearly. Tap the square when you are finished." 
                      : "We will automatically convert your voice into structured JSON."}
                  </p>
                </div>
              ) : (
                !file ? (
                  <div 
                    className={cn(
                      "relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300",
                      dragActive ? 'border-accent bg-blue-50/50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/30'
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100 mb-6 transition-transform">
                      {activeTab === 'image' && <ImageIcon className={cn("h-8 w-8", dragActive ? 'text-accent' : 'text-gray-400')} />}
                      {activeTab === 'pdf' && <FileText className={cn("h-8 w-8", dragActive ? 'text-accent' : 'text-gray-400')} />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Drag your file here
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 mb-8 max-w-sm leading-relaxed">
                      {activeTab === 'image' && 'Drop a PNG or JPEG screenshot to trigger the OCR extractors.'}
                      {activeTab === 'pdf' && 'Drop any PDF document to natively parse the embedded text.'}
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept={getAcceptType()}
                      onChange={handleChange}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 px-8 py-2.5 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-gray-200 focus:outline-none shadow-sm"
                    >
                      Browse {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Files
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-100 bg-gray-50/50 rounded-2xl p-10 flex flex-col items-center text-center">
                    <div className="bg-white p-4 rounded-full border border-gray-200 shadow-sm mb-5 relative">
                      {activeTab === 'audio' ? <Mic className="h-8 w-8 text-accent" /> : <FileIcon className="h-8 w-8 text-accent" />}
                      <button 
                        onClick={() => !isUploading && setFile(null)}
                        disabled={isUploading}
                        className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-full p-1.5 shadow-sm transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 truncate max-w-xs">{file.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-8">{(file.size / (1024 * 1024)).toFixed(2)} MB Payload mapped</p>
                    
                    <button 
                      onClick={handleProcessFile}
                      disabled={isUploading}
                      className="w-full sm:w-auto inline-flex justify-center items-center bg-accent hover:bg-accent/90 text-white px-10 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:bg-accent/70 disabled:cursor-wait"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Processing {activeTab.toUpperCase()} Data...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          Run AI Parsing Extraction
                        </>
                      )}
                    </button>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
           <Card className="overflow-hidden border-border bg-white shadow-lg border-t-4 border-t-accent">
            <CardContent className="p-0">
               <div className="bg-gray-50/80 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center text-accent font-semibold mb-1">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Task Successfully Parsed
                    </div>
                    <p className="text-sm text-gray-500">Verify extracted intelligence metadata mapped correctly.</p>
                  </div>
                  <div className="hidden sm:flex bg-blue-50 border border-blue-100 text-accent text-xs font-bold px-3 py-1.5 rounded-full items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    AI Confidence: {extractedTask.ai_confidence}%
                  </div>
               </div>

               <div className="p-8 space-y-6">
                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identified Task Name</label>
                    <p className="font-semibold text-lg text-gray-900 mt-1">{extractedTask.title}</p>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category Routing</label>
                      <div className="mt-2"><Badge variant="default">{extractedTask.type}</Badge></div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Severity Tag</label>
                      <div className="mt-2"><Badge variant={extractedTask.priority === 'High' ? 'danger' : 'warning'}>{extractedTask.priority}</Badge></div>
                    </div>
                     <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detected Target Date</label>
                      <p className="font-medium text-gray-800 mt-2">{extractedTask.deadline ? new Date(extractedTask.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No explicitly defined timeline'}</p>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Extracted Details Payload</label>
                    <p className="font-medium text-gray-700 mt-2 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed">
                      {extractedTask.notes || 'No contextual details appended by LLM schema.'}
                    </p>
                 </div>
               </div>

               <div className="px-8 py-5 bg-gray-50 flex items-center justify-end space-x-3 border-t border-gray-100">
                  <button 
                    onClick={() => { setExtractedTask(null); setFile(null); setTextPrompt(''); }}
                    className="text-gray-500 hover:text-gray-900 text-sm font-semibold px-4 py-2 transition-colors"
                  >
                    Discard Scan
                  </button>
                  <button 
                    onClick={handleConfirmTask}
                    className="inline-flex items-center text-white bg-accent hover:bg-accent/90 text-sm font-semibold px-6 py-2.5 rounded-lg transition-transform focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-95 shadow-sm"
                  >
                    Confirm & Send to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
               </div>
            </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
