import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Filter, ArrowRight, Cpu } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
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
          <Cpu className="w-6 h-6 text-white" />
          <div className="flex items-center">
            <span className="font-extrabold tracking-tighter text-white">Gate</span>
            <span className="font-light tracking-widest text-gray-400 italic">Room</span>
          </div>
        </div>
        <div>
          <button onClick={() => navigate('/auth')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-[13px] font-medium text-gray-300">
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
          <span>GATE 2025 Matchmaking is Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight mb-8 leading-[1.05]">
          The study network <br className="hidden md:block" />
          <span className="text-gray-500">for GATE aspirants.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl font-light leading-relaxed">
          Built to connect serious engineers. Match instantly by branch, collaborate via peer-to-peer video, and ace the exam together.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="group flex items-center justify-center space-x-2 bg-white text-black px-8 py-3.5 rounded-md font-medium text-sm hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span>Start Connecting</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <FeatureCard 
            icon={<Users className="w-5 h-5 text-gray-300" />}
            title="Instant Match"
            desc="Skip the forums. Connect instantly with active GATE aspirants studying at this exact moment."
          />
          <FeatureCard 
            icon={<Filter className="w-5 h-5 text-gray-300" />}
            title="Branch Specific"
            desc="Filter by all 30 GATE papers, from Aerospace to Life Sciences, to find peers solving the same technical problems."
          />
          <FeatureCard 
            icon={<Video className="w-5 h-5 text-gray-300" />}
            title="P2P Video & Chat"
            desc="Crystal clear, low-latency WebRTC video and real-time text chat designed for focus."
          />
        </div>
      </main>

      {/* Footer glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-white/5 blur-[120px] pointer-events-none"></div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#050505] border border-white/5 rounded-xl p-8 hover:border-white/10 transition-colors group">
    <div className="mb-6 p-2.5 bg-white/5 border border-white/5 inline-block rounded-lg group-hover:bg-white/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
