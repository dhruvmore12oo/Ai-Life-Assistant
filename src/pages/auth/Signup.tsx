import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match constraints.');
    }
    
    try {
      setLoading(true);
      setError(null);
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Upon success, redirect gracefully into the login boundary layer
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to construct the account infrastructure natively.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in duration-700 zoom-in-95">
        <div className="flex justify-center flex-row items-center space-x-2">
          <div className="bg-gray-900 p-2 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-bold tracking-tight text-gray-900 border-l border-gray-200 pl-3">AI Life Admin</span>
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have absolute access?{' '}
          <Link to="/login" className="font-medium text-accent hover:text-blue-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-in slide-in-from-bottom-6 duration-700">
        <Card className="shadow-lg border border-border sm:rounded-xl">
          <CardContent className="px-6 py-8 sm:px-10">
            <form className="space-y-6" onSubmit={handleSignup}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-2 focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 bg-gray-50 border text-gray-900 transition-colors placeholder:text-gray-400"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-2 focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 bg-gray-50 border text-gray-900 transition-colors placeholder:text-gray-400"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="focus:ring-2 focus:ring-accent focus:border-accent block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3 bg-gray-50 border text-gray-900 transition-colors placeholder:text-gray-400"
                    placeholder="Repeat the password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-500 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : 'Construct Architecture natively'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
