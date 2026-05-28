import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

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
        <button 
          onClick={() => navigate('/')} 
          className="text-2xl flex items-center gap-3 group hover:opacity-80 transition-opacity"
        >
          <Cpu className="w-6 h-6 text-black dark:text-white" />
          <div className="flex items-center">
            <span className="font-extrabold tracking-tighter text-black dark:text-white">Gate</span>
            <span className="font-light tracking-widest text-gray-500 dark:text-gray-400 italic">Room</span>
          </div>
        </button>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => navigate('/')} className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
             Home
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-32">
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white mb-12">
          About GateRoom
        </h1>
        
        <div className="space-y-12 text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
          <p>
            The journey of preparing for the GATE examination is notoriously isolating. Millions of engineers study the exact same curriculum, face the same doubts, and experience the same intense pressure, yet they do it entirely alone.
          </p>

          <p>
            <strong className="font-medium text-black dark:text-white">GateRoom was built to change this.</strong> We believe that peer-to-peer collaboration is the most effective way to master complex engineering concepts. Our platform is a dedicated, real-time matchmaking network designed specifically for GATE aspirants across all 30 disciplines.
          </p>

          <div className="py-8 my-12 border-y border-black/5 dark:border-white/5">
            <h2 className="text-2xl font-medium text-black dark:text-white mb-6 tracking-tight">Our Core Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">Zero Friction</h3>
                <p className="text-[15px] leading-relaxed">No complicated setups. You pick your branch, and you're instantly connected with a peer studying the exact same subject.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">Built for Focus</h3>
                <p className="text-[15px] leading-relaxed">The interface is intentionally minimal. No ads, no feeds, no distractions. Just you, your peer, and the problem at hand.</p>
              </div>
            </div>
          </div>

          <p>
            Whether you need a silent companion for a 3-hour Pomodoro focus session or someone to debate the intricacies of Network Theory with, GateRoom provides the infrastructure to make it happen instantly.
          </p>
          
          <div className="pt-12 mt-12 flex flex-col items-start gap-4">
            <p className="text-base text-black dark:text-white font-medium">Ready to stop studying alone?</p>
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:opacity-80 transition-opacity"
            >
              Start Connecting <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
      
      {/* Minimal Footer */}
      <footer className="relative z-10 w-full pb-12 text-center text-sm font-medium text-gray-400 dark:text-gray-600 tracking-wide uppercase">
         Built for engineers, by engineers.
      </footer>
    </div>
  );
};

export default About;
