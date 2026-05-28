import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Cpu, Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to setup
  if (localStorage.getItem('token')) {
    return <Navigate to="/setup" />;
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Pre-fill gateProfile for /setup
          const existingProfile = localStorage.getItem('gateProfile');
          if (!existingProfile) {
            localStorage.setItem('gateProfile', JSON.stringify({ 
              name: data.user.name, 
              branch: data.user.branch || 'Any', 
              year: '2025' 
            }));
          }
          
          navigate('/setup');
        } else {
          setError(data.message || 'Authentication failed');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to connect to server.');
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Login failed. Please try again.');
    }
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white flex p-4 font-sans relative overflow-hidden transition-colors duration-500">
      
      {/* Left Half - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[50%] relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-black m-1 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
        <img 
          src="/auth-bg.png" 
          alt="Abstract Tech" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-black dark:via-black/20"></div>
        
        {/* Floating Text (No Card) */}
        <div className="absolute bottom-16 left-16 right-16">
          <p className="text-black dark:text-white text-xl font-medium dark:font-light leading-relaxed mb-6 drop-shadow-md dark:drop-shadow-lg text-center lg:text-left">
            Connecting with the right peers completely changed the trajectory of my GATE preparation. Isolation is the enemy of engineering.
          </p>
        </div>
      </div>

      {/* Right Half - Login */}
      <div className="w-full lg:w-[50%] flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-14 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3 mb-10 text-2xl font-medium tracking-tight">
              <Cpu className="w-7 h-7 text-black dark:text-white" />
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

          {error && <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center shadow-sm dark:shadow-none">{error}</div>}

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
              By continuing, you agree to our <Link to="/terms" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline decoration-black/20 dark:decoration-white/20 underline-offset-4">Terms of Service</Link> and <Link to="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white underline decoration-black/20 dark:decoration-white/20 underline-offset-4">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
