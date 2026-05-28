import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Filter, ArrowRight, Cpu, UserCircle, LogOut, Moon, Sun, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const { isDark, toggleTheme } = useTheme();
  const carouselRef = React.useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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

      {/* Main Content */}
      <main className="relative z-10 flex flex-col pt-16 md:pt-24 pb-20 px-6 max-w-7xl mx-auto">

        {/* Top Header Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16 mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-white flex-1">
            GateRoom Futures
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 flex-1 font-serif leading-relaxed text-left">
            GateRoom connects GATE students across India to study together. You can instantly find a study partner, join silent focus sessions, and solve doubts face-to-face on live video calls.
          </p>
        </div>

        <hr className="w-full border-t border-gray-200 dark:border-white/10 mb-16" />

        {/* Map Section */}
        <section className="relative z-10 w-full mb-12 text-left">
          <div className="bg-[#f4f6f3] dark:bg-[#0a0f0d] rounded-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 border border-black/5 dark:border-white/5">
            <div className="flex-1">
              <span className="text-sm font-semibold tracking-wide text-green-700 dark:text-green-400 mb-4 block">Network Index</span>
              <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-black dark:text-white mb-8 leading-[1.1]">
                Analyzing where <br className="hidden md:block"/> GATE aspirants <br className="hidden md:block"/> are studying.
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md font-light leading-relaxed">
                See where students are studying from right now. This map shows the live activity of GATE aspirants connecting with each other across different states in India.
              </p>
              <button 
                onClick={() => navigate(isLoggedIn ? '/setup' : '/auth')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium text-sm shadow-sm dark:shadow-none bg-white dark:bg-transparent"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start connecting'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 w-full flex justify-center lg:justify-end">
              <IndiaMap />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <div className="mt-24 mb-32 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left w-full max-w-7xl mx-auto">
          <FeatureCard 
            icon={<Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            title="Instant Match"
            desc="Connect instantly with other GATE students who are online and studying right now."
          />
          <FeatureCard 
            icon={<Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            title="Any Branch"
            desc="Match with students from any engineering branch to discuss topics and solve problems together."
          />
          <FeatureCard 
            icon={<Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            title="Video & Chat"
            desc="High-quality video and fast text chat designed to help you stay focused on your studies."
          />
        </div>
      </main>

      {/* Study Modes Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="flex flex-col gap-5 group">
            <div className="relative aspect-video bg-gray-200 dark:bg-[#111] rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl dark:group-hover:shadow-black/40">
              <img src="/focus-session.png" alt="Study Session" className="absolute inset-0 w-full h-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <h3 className="text-white text-2xl md:text-3xl font-medium tracking-tight drop-shadow-md">
                  Focus Session <span className="inline-block w-1 h-6 bg-blue-500 animate-pulse align-middle ml-1"></span>
                </h3>
              </div>
            </div>
            <div className="px-2">
              <h4 className="text-black dark:text-white font-medium text-lg mb-2 tracking-tight">Silent Study Sessions</h4>
              <p className="text-gray-500 dark:text-gray-400 text-[15px] font-light leading-relaxed">
                Study together in silence. Mute your mic, turn on your camera, and stay focused for long hours without any distractions.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-5 group">
            <div className="relative aspect-video bg-gray-200 dark:bg-[#111] rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl dark:group-hover:shadow-black/40">
              <img src="/doubt-session.png" alt="Doubt Session" className="absolute inset-0 w-full h-full object-cover grayscale-[20%] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
              <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <h3 className="text-white text-2xl md:text-3xl font-medium tracking-tight drop-shadow-md">
                  Doubt Resolution <span className="inline-block w-1 h-6 bg-green-500 animate-pulse align-middle ml-1"></span>
                </h3>
              </div>
            </div>
            <div className="px-2">
              <h4 className="text-black dark:text-white font-medium text-lg mb-2 tracking-tight">Solve Doubts Together</h4>
              <p className="text-gray-500 dark:text-gray-400 text-[15px] font-light leading-relaxed">
                Stuck on a hard question? Connect with another student instantly and solve it face-to-face on a video call.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full pt-32 pb-8 mt-20 border-t border-black/5 dark:border-white/5 bg-[#fafafa] dark:bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-32">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-medium tracking-tight text-black dark:text-white mb-2">Ready to start?</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">Elevate your GATE preparation to the next level.</p>
            </div>
            <div className="md:col-span-2 flex flex-col md:items-end justify-center">
              <p className="text-lg font-medium text-black dark:text-white leading-relaxed text-left md:text-right">
                Your focus today defines your rank tomorrow.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light mt-2 text-left md:text-right">
                Stay consistent. Stay disciplined.
              </p>
            </div>
          </div>

          {/* Middle Section (Giant Text) */}
          <div className="flex justify-center items-center w-full mb-16 px-4">
            <h1 
              className="text-[15vw] sm:text-[14vw] font-black tracking-[-0.05em] leading-[0.8] select-none text-black dark:text-white text-center"
              style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
            >
              GateRoom
            </h1>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-[13px] font-medium text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4 md:mb-0 text-black dark:text-white">
              <span className="font-semibold text-lg tracking-tight">GateRoom</span>
            </div>
            <div className="flex space-x-6">
              <a href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</a>
              <a href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="relative overflow-hidden bg-white dark:bg-[#0a0a0a] border border-gray-200/80 dark:border-white/10 rounded-3xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/40 group z-10">
    {/* Subtle top gradient glow on hover */}
    <div className="absolute top-0 left-0 right-0 h-3/4 bg-gradient-to-b from-gray-50 dark:from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-t-3xl"></div>
    
    <div className="relative z-10 mb-8 p-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 inline-flex rounded-2xl group-hover:bg-white dark:group-hover:bg-white/10 group-hover:scale-110 group-hover:shadow-sm transition-all duration-500">
      {icon}
    </div>
    
    <h3 className="relative z-10 text-xl font-semibold text-black dark:text-white mb-3 tracking-tight">
      {title}
    </h3>
    
    <p className="relative z-10 text-gray-500 dark:text-gray-400 text-[15px] leading-relaxed font-light">
      {desc}
    </p>
  </div>
);

const IndiaMap = () => {
  const mapData = [
    { id: 'JK', row: 1, col: 4, intensity: 'bg-green-700 dark:bg-green-600' },
    { id: 'LA', row: 1, col: 5, intensity: 'bg-green-300 dark:bg-green-900' },
    { id: 'PB', row: 2, col: 3, intensity: 'bg-green-600 dark:bg-green-700' },
    { id: 'HP', row: 2, col: 4, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'UK', row: 2, col: 5, intensity: 'bg-green-300 dark:bg-green-900' },
    { id: 'RJ', row: 3, col: 2, intensity: 'bg-green-500 dark:bg-green-700' },
    { id: 'HR', row: 3, col: 3, intensity: 'bg-green-700 dark:bg-green-600' },
    { id: 'DL', row: 3, col: 4, intensity: 'bg-green-800 dark:bg-green-500' },
    { id: 'UP', row: 3, col: 5, intensity: 'bg-green-600 dark:bg-green-700' },
    { id: 'BR', row: 3, col: 6, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'GJ', row: 4, col: 1, intensity: 'bg-green-600 dark:bg-green-700' },
    { id: 'MP', row: 4, col: 3, intensity: 'bg-green-500 dark:bg-green-700' },
    { id: 'CG', row: 4, col: 5, intensity: 'bg-green-300 dark:bg-green-900' },
    { id: 'JH', row: 4, col: 6, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'WB', row: 4, col: 7, intensity: 'bg-green-700 dark:bg-green-600' },
    { id: 'SK', row: 4, col: 8, intensity: 'bg-green-300 dark:bg-green-900' },
    { id: 'AR', row: 4, col: 10, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'MH', row: 5, col: 2, intensity: 'bg-green-800 dark:bg-green-500' },
    { id: 'TG', row: 5, col: 4, intensity: 'bg-green-700 dark:bg-green-600' },
    { id: 'OD', row: 5, col: 6, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'AS', row: 5, col: 9, intensity: 'bg-green-500 dark:bg-green-700' },
    { id: 'NL', row: 5, col: 10, intensity: 'bg-green-300 dark:bg-green-900' },
    { id: 'GO', row: 6, col: 2, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'KA', row: 6, col: 3, intensity: 'bg-green-800 dark:bg-green-500' },
    { id: 'AP', row: 6, col: 4, intensity: 'bg-green-600 dark:bg-green-700' },
    { id: 'ML', row: 6, col: 9, intensity: 'bg-green-300 dark:bg-green-900' },
    { id: 'MN', row: 6, col: 10, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'KL', row: 7, col: 3, intensity: 'bg-green-600 dark:bg-green-700' },
    { id: 'TN', row: 7, col: 4, intensity: 'bg-green-800 dark:bg-green-500' },
    { id: 'TR', row: 7, col: 9, intensity: 'bg-green-400 dark:bg-green-800' },
    { id: 'MZ', row: 7, col: 10, intensity: 'bg-green-300 dark:bg-green-900' },
  ];

  return (
    <div className="flex flex-col items-center lg:items-end w-full">
      <div className="relative w-full max-w-[500px] aspect-[10/8] grid grid-cols-11 grid-rows-7 gap-1 md:gap-1.5 mb-8">
        {Array.from({ length: 77 }).map((_, i) => {
          const row = Math.floor(i / 11) + 1;
          const col = (i % 11) + 1;
          const state = mapData.find(s => s.row === row && s.col === col);
          
          if (state) {
            return (
              <div 
                key={i} 
                className={`flex items-center justify-center rounded-[4px] text-[9px] md:text-[11px] font-bold text-black/70 dark:text-white/80 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:z-10 cursor-default ${state.intensity}`}
                title={state.id}
              >
                {state.id}
              </div>
            );
          }
          return <div key={i} className="rounded-sm bg-transparent"></div>;
        })}
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-end gap-3 text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest w-full max-w-[500px]">
        <span>Low</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded-[2px] bg-green-200 dark:bg-green-900"></div>
          <div className="w-4 h-4 rounded-[2px] bg-green-300 dark:bg-green-800"></div>
          <div className="w-4 h-4 rounded-[2px] bg-green-500 dark:bg-green-700"></div>
          <div className="w-4 h-4 rounded-[2px] bg-green-800 dark:bg-green-500"></div>
        </div>
        <span>High Activity</span>
      </div>
    </div>
  );
};

export default Landing;
