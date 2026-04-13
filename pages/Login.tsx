import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { FlaskConical, Mail, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

function friendlyError(err: any): string {
  const msg = err?.message || '';
  if (msg.includes('Invalid login')) return 'Invalid email or password.';
  if (msg.includes('already registered')) return 'An account with this email already exists.';
  if (msg.includes('Password should be')) return 'Password must be at least 6 characters.';
  if (msg.includes('valid email')) return 'Please enter a valid email address.';
  if (msg.includes('Email not confirmed')) return 'Please check your email to confirm your account.';
  if (msg.includes('rate limit')) return 'Too many attempts. Please wait a moment.';
  if (msg.includes('popup_closed')) return 'Sign-in popup was closed. Please try again.';
  if (msg.includes('access_denied')) return 'Google sign-in was declined.';
  if (msg.includes('not enabled')) return 'Google sign-in is not enabled. Please configure it in Supabase.';
  if (msg.includes('OAuth')) return 'OAuth configuration error. Please check Supabase Google provider settings.';
  return msg || 'Something went wrong. Please try again.';
}

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isRegister) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (signUpErr) throw signUpErr;

        // Insert into users table
        if (data.user) {
          await supabase.from('users').upsert({
            id: data.user.id,
            full_name: name,
            email,
            role: 'Student',
            created_at: new Date().toISOString(),
          });
        }

        // Check if email confirmation is required
        if (data.user && !data.session) {
          setSuccess('Account created! Please check your email to confirm your account.');
          return;
        }
        navigate('/home');
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInErr) throw signInErr;
        navigate('/home');
      }
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const [showGoogleHelp, setShowGoogleHelp] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const { data, error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthErr) {
        if (oauthErr.message?.includes('not enabled') || oauthErr.message?.includes('OAuth secret')) {
          setShowGoogleHelp(true);
          setLoading(false);
          return;
        }
        throw oauthErr;
      }
      // signInWithOAuth will redirect the browser automatically (default behavior)
      // If for some reason it doesn't, fallback to manual redirect
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(friendlyError(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <MotionDiv
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8"
      >
        <div className="text-center mb-8">
          <FlaskConical className="mx-auto w-12 h-12 text-emerald-400 mb-4" />
          <h1 className="text-2xl font-display font-bold text-white">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRegister ? 'Join E-Prayog today' : 'Log in to your E-Prayog account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          )}
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPw ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required minLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}
          {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 rounded-xl px-4 py-2">{success}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <LogIn size={16} />
            )}
            {isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="px-4 text-xs text-slate-500">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={handleGoogle} disabled={loading}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C34 32.7 29.5 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.2 16.2 18.8 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.5 0-10-3.3-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.2-2.7-.4-3.9z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-400 mt-6">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
            className="text-emerald-400 font-bold ml-2 hover:underline"
          >
            {isRegister ? 'Log In' : 'Sign Up'}
          </button>
        </p>

        {/* Google OAuth Setup Help Modal */}
        {showGoogleHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowGoogleHelp(false)}>
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-3">⚙️ Google Sign-In Setup Required</h3>
              <p className="text-sm text-slate-400 mb-4">
                Google OAuth needs to be configured in your Supabase project:
              </p>
              <ol className="text-sm text-slate-300 space-y-2 mb-4">
                <li><span className="font-bold text-emerald-400">1.</span> Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console → Credentials</a></li>
                <li><span className="font-bold text-emerald-400">2.</span> Create OAuth Client ID (Web app type)</li>
                <li><span className="font-bold text-emerald-400">3.</span> Add <strong>Authorized JavaScript Origins</strong>: <code className="text-xs bg-white/5 rounded px-1 py-0.5 break-all">{window.location.origin}</code></li>
                <li><span className="font-bold text-emerald-400">4.</span> Add <strong>Authorized redirect URI</strong>: <code className="text-xs bg-white/5 rounded px-1 py-0.5 break-all">https://piyvipaepmbanatqegav.supabase.co/auth/v1/callback</code></li>
                <li><span className="font-bold text-emerald-400">5.</span> Copy <strong>Client ID</strong> + <strong>Client Secret</strong></li>
                <li><span className="font-bold text-emerald-400">6.</span> Paste both into <a href="https://supabase.com/dashboard/project/piyvipaepmbanatqegav/auth/providers" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Supabase → Auth → Providers → Google</a></li>
                <li><span className="font-bold text-emerald-400">7.</span> In Supabase → Auth → URL Configuration, add your site URL: <code className="text-xs bg-white/5 rounded px-1 py-0.5 break-all">{window.location.origin}</code></li>
                <li><span className="font-bold text-emerald-400">8.</span> Add <code className="text-xs bg-white/5 rounded px-1 py-0.5 break-all">{window.location.origin}/auth/callback</code> to Redirect URLs</li>
              </ol>
              <div className="flex gap-2">
                <button onClick={() => setShowGoogleHelp(false)} className="flex-1 py-2 rounded-xl bg-white/5 text-slate-400 text-sm font-bold border border-white/10">
                  Use Email Instead
                </button>
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold text-center">
                  Open Google Console
                </a>
              </div>
            </div>
          </div>
        )}
      </MotionDiv>
    </div>
  );
};

export default Login;
