const extractTextService = require('../services/extractTextService');
const taskParserService = require('../services/taskParserService');
const taskRepository = require('../repository/taskRepository');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

class UploadController {
  async processUpload(req, res) {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    // 1. Extract raw text via localized OCR / PDF / Audio Processors
    const rawText = await extractTextService.processFile(req.file);

    // 2. Pass string text to remote LLM API to parse structural strict JSON formats
    const parsedTaskBody = await taskParserService.parseTaskFromText(rawText);

    // 3. Automate save interactions into SQL Postgres Layer (Supabase implementation)
    let savedTask = null;
    try {
      savedTask = await taskRepository.createTask(parsedTaskBody);
    } catch (dbError) {
      console.warn('[UploadController] Database persistence bypassed. Returning raw parsed object proxy instead.', dbError.message);
    }

    return successResponse(res, savedTask || parsedTaskBody, 'File processed and task dynamically generated intelligently', 201);
  }

  async processText(req, res) {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return errorResponse(res, 'Text prompt cannot be absolutely empty', 400);
    }

    // Pass string text to remote LLM API directly bypassing Extraction layers
    const parsedTaskBody = await taskParserService.parseTaskFromText(text);

    let savedTask = null;
    try {
      savedTask = await taskRepository.createTask(parsedTaskBody);
    } catch (dbError) {
      console.warn('[UploadController] Database persistence bypassed. Returning raw parsed object proxy instead.', dbError.message);
    }

    return successResponse(res, savedTask || parsedTaskBody, 'Text securely processed and task dynamically generated', 201);
  }
}

module.exports = new UploadController();
