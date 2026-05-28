import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Filter, ArrowRight, Cpu, UserCircle, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('gateProfile');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white font-sans selection:bg-black/10 dark:selection:bg-white/30 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-100 dark:opacity-30" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)',
        }}
      ></div>
      {/* Dark mode specific overlay grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)',
        }}
      ></div>

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-2xl flex items-center gap-3">
          <Cpu className="w-6 h-6 text-black dark:text-white" />
          <div className="flex items-center">
            <span className="font-extrabold tracking-tighter text-black dark:text-white">Gate</span>
            <span className="font-light tracking-widest text-gray-500 dark:text-gray-400 italic">Room</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-6 relative">
              <button onClick={() => navigate('/setup')} className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Dashboard</button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center"
                >
                  <UserCircle className="w-6 h-6" />
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl py-1.5 z-50">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Sign In</button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm dark:shadow-none mb-8 text-[13px] font-medium text-gray-600 dark:text-gray-300">
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
          <span>GATE 2025 Matchmaking is Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight mb-8 leading-[1.05] text-black dark:text-white">
          The study network <br className="hidden md:block" />
          <span className="text-gray-400 dark:text-gray-500">for GATE aspirants.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl font-light leading-relaxed">
          Built to connect serious engineers. Match instantly by branch, collaborate via peer-to-peer video, and ace the exam together.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate(isLoggedIn ? '/setup' : '/auth')}
            className="group flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-md font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-xl shadow-black/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span>{isLoggedIn ? 'Enter Dashboard' : 'Start Connecting'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <FeatureCard 
            icon={<Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            title="Instant Match"
            desc="Skip the forums. Connect instantly with active GATE aspirants studying at this exact moment."
          />
          <FeatureCard 
            icon={<Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            title="Branch Specific"
            desc="Filter by all 30 GATE papers, from Aerospace to Life Sciences, to find peers solving the same technical problems."
          />
          <FeatureCard 
            icon={<Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            title="P2P Video & Chat"
            desc="Crystal clear, low-latency WebRTC video and real-time text chat designed for focus."
          />
        </div>
      </main>

      {/* Footer glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-black/5 dark:bg-white/5 blur-[120px] pointer-events-none"></div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/5 rounded-xl p-8 hover:border-gray-300 dark:hover:border-white/10 hover:shadow-md dark:hover:shadow-none transition-all group">
    <div className="mb-6 p-2.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 inline-block rounded-lg group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-black dark:text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
