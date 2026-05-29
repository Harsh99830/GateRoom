import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Loader2, Sun, Moon } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useTheme } from '../context/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDark, toggleTheme } = useTheme();

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: tokenResponse.code }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken || '');
          localStorage.setItem('tokenExpiresAt', String(data.expiresAt || ''));
          localStorage.setItem('user', JSON.stringify(data.user));

          if (data.gateProfile) {
            localStorage.setItem('gateProfile', JSON.stringify(data.gateProfile));
          } else {
            localStorage.removeItem('gateProfile');
          }

          // If onboarding is done, go to feed; otherwise go to onboarding
          navigate(data.onboardingDone ? '/' : '/onboarding');
        } else {
          setError(data.message || 'Authentication failed');
          setLoading(false);
        }
      } catch {
        setError('Failed to connect to server.');
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Login failed. Please try again.');
    }
  });

  // Already logged in
  if (localStorage.getItem('token')) {
    const gateProfile = localStorage.getItem('gateProfile');
    return <Navigate to={gateProfile ? '/' : '/onboarding'} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex p-4 font-sans relative overflow-hidden transition-colors duration-500">

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 lg:right-12 z-50 p-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full shadow-sm hover:scale-105 transition-transform"
      >
        {isDark ? <Sun className="w-5 h-5 text-black dark:text-white" /> : <Moon className="w-5 h-5 text-black dark:text-white" />}
      </button>

      {/* Left — image panel */}
      <div className="hidden lg:flex lg:w-[50%] relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-black m-1 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
        <img
          src="/auth-bg.png"
          alt="Abstract Tech"
          className="absolute inset-0 w-full h-full object-cover brightness-105 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/10 to-transparent dark:from-black dark:via-black/20" />
        <div className="absolute bottom-8 left-16 right-16">
          <p
            className="text-black dark:text-white text-xl font-medium dark:font-light leading-relaxed mb-6 drop-shadow-md dark:drop-shadow-lg text-center lg:text-left"
            style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
          >
            You don't know if you're behind. That's the problem.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="w-full lg:w-[50%] flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-14 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3 mb-10 text-2xl font-medium tracking-tight">
              <img src="/favicon.svg" alt="GateRoom Logo" className="w-8 h-8 invert dark:invert-0" />
              <div className="flex items-center">
                <span className="font-extrabold tracking-tighter text-black dark:text-white">Gate</span>
                <span className="font-light tracking-widest text-gray-500 dark:text-gray-400 italic">Room</span>
              </div>
            </div>

            <h2 className="text-4xl font-medium tracking-tight mb-4 text-black dark:text-white">
              Welcome back
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base font-light">
              Log in to continue your preparation journey with peers across India.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center shadow-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="group w-full flex items-center justify-center space-x-4 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-black/10 dark:shadow-none"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white dark:text-black" />
            ) : (
              <>
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="mt-10 text-center lg:text-left">
            <p className="text-[13px] text-gray-500 font-light">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline decoration-black/20 dark:decoration-white/20 underline-offset-4">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline decoration-black/20 dark:decoration-white/20 underline-offset-4">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
