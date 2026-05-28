import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Calendar, Search, Cpu } from 'lucide-react';
import { GATE_BRANCHES } from '../constants';

const Setup = () => {
  const savedProfile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
  const [name, setName] = useState(savedProfile.name || '');
  const [branch, setBranch] = useState(savedProfile.branch || 'Any');
  const [year, setYear] = useState(savedProfile.year || '2025');
  const navigate = useNavigate();

  const handleSetup = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Save to localStorage
    localStorage.setItem('gateProfile', JSON.stringify({ name, branch, year }));
    navigate('/waiting');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
        }}
      ></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <Cpu className="w-8 h-8 text-white mb-6" />
          <h2 className="text-2xl font-medium tracking-tight mb-2">Configure Profile</h2>
          <p className="text-gray-500 text-sm">Verify your details before entering the queue.</p>
        </div>

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3" /> Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30 transition-colors text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-widest flex items-center gap-2"><BookOpen className="w-3 h-3" /> Target Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30 transition-colors text-sm appearance-none"
            >
              <option value="Any">Any Branch</option>
              {GATE_BRANCHES.map(b => (
                <option key={b.code} value={b.code}>{b.code} - {b.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3" /> GATE Attempt Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30 transition-colors text-sm appearance-none"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-white text-black py-2.5 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors mt-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <Search className="w-4 h-4" />
            <span>Find Partner</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
