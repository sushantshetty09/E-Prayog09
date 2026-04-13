import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { FlaskConical, AlertCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the auth code/tokens from the URL - Supabase handles PKCE exchange automatically
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Auth callback error:', sessionError);
          setError(sessionError.message);
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        if (data.session) {
          // Successfully authenticated — upsert user record
          const user = data.session.user;
          try {
            await supabase.from('users').upsert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
              email: user.email || '',
              role: 'Student',
              created_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          } catch {
            // Non-critical: user record upsert failed, continue anyway
            console.warn('User upsert failed, continuing...');
          }
          navigate('/home', { replace: true });
          return;
        }

        // No session yet — listen for auth state change (PKCE flow may still be processing)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              const user = session.user;
              try {
                await supabase.from('users').upsert({
                  id: user.id,
                  full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
                  email: user.email || '',
                  role: 'Student',
                  created_at: new Date().toISOString(),
                }, { onConflict: 'id' });
              } catch {
                console.warn('User upsert failed, continuing...');
              }
              subscription.unsubscribe();
              navigate('/home', { replace: true });
            }
          }
        );

        // Timeout fallback — if auth doesn't complete within 15s, redirect to login
        const timeout = setTimeout(() => {
          subscription.unsubscribe();
          setError('Authentication timed out. Please try again.');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
        }, 15000);

        return () => {
          clearTimeout(timeout);
          subscription.unsubscribe();
        };
      } catch (err: any) {
        console.error('Auth callback exception:', err);
        setError('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="text-center">
        {error ? (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-sm text-slate-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30 animate-pulse" />
              <FlaskConical className="w-12 h-12 text-emerald-400 relative z-10 animate-bounce" />
            </div>
            <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Completing sign in...</p>
            <p className="text-xs text-slate-600">Please wait while we verify your account</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
