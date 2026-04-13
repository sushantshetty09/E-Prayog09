import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { FlaskConical, AlertCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // PKCE flow: exchange the code from URL for a session
        const code = searchParams.get('code');
        
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setError(exchangeError.message);
            setTimeout(() => navigate('/login', { replace: true }), 3000);
            return;
          }

          if (data.session) {
            await upsertUser(data.session.user);
            await redirectBasedOnRole(data.session.user.id, navigate);
            return;
          }
        }

        // Check for error in URL params (OAuth errors)
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        if (errorParam) {
          setError(errorDescription || errorParam);
          setTimeout(() => navigate('/login', { replace: true }), 3000);
          return;
        }

        // Fallback: check if session was already established (implicit flow / auto-detect)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          await upsertUser(sessionData.session.user);
          await redirectBasedOnRole(sessionData.session.user.id, navigate);
          return;
        }

        // Last resort: wait for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
              await upsertUser(session.user);
              subscription.unsubscribe();
              await redirectBasedOnRole(session.user.id, navigate);
            }
          }
        );

        // Timeout fallback
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
  }, [navigate, searchParams]);

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

async function redirectBasedOnRole(userId: string, navigate: any) {
  try {
    const roleQuery = supabase.from('users').select('role').eq('id', userId).single();
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Role lookup timeout')), 6000);
    });
    const { data: userData } = await Promise.race([roleQuery, timeout]) as any;
    const role = userData?.role || 'Student';
    const routes: Record<string, string> = {
      'Admin': '/dashboard',
      'Teacher': '/dashboard',
      'Student': '/home',
    };
    navigate(routes[role] || '/home', { replace: true });
  } catch (e) {
    navigate('/home', { replace: true });
  }
}

async function upsertUser(user: any) {
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
}

export default AuthCallback;
