import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Calendar, Search, Cpu, ChevronDown } from 'lucide-react';
import { GATE_BRANCHES } from '../constants';

const CustomSelect = ({ value, onChange, options, label, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-widest flex items-center gap-2">
        <Icon className="w-3 h-3" /> {label}
      </label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-md text-black dark:text-white flex items-center justify-between cursor-pointer focus:outline-none hover:border-gray-400 dark:hover:border-white/30 transition-colors text-sm shadow-sm dark:shadow-none"
      >
        <span className="truncate pr-4">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-md shadow-lg dark:shadow-2xl max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="py-1">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  value === opt.value 
                    ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Setup = () => {
  const savedProfile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
  const [name, setName] = useState(savedProfile.name || '');
  const [branch, setBranch] = useState(savedProfile.branch || 'Any');
  const [year, setYear] = useState(savedProfile.year || '2025');
  const navigate = useNavigate();

  const handleSetup = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    localStorage.setItem('gateProfile', JSON.stringify({ name, branch, year }));
    navigate('/waiting');
  };

  const branchOptions = [
    { value: 'Any', label: 'Any Branch' },
    ...GATE_BRANCHES.map(b => ({ value: b.code, label: `${b.code} - ${b.name}` }))
  ];

  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2029', label: '2029' },
    { value: '2030', label: '2030' },
    { value: '2031', label: '2031' },
    { value: '2032', label: '2032' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-100 dark:opacity-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
        }}
      ></div>
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
        }}
      ></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <Cpu className="w-8 h-8 text-black dark:text-white mb-6" />
          <h2 className="text-2xl font-medium tracking-tight mb-2">Complete Profile</h2>
          <p className="text-gray-500 text-sm">Verify your details before entering the queue.</p>
        </div>

        <form onSubmit={handleSetup} className="space-y-5">
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3" /> Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-md text-black dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-white/30 transition-colors text-sm shadow-sm dark:shadow-none"
              placeholder="John Doe"
            />
          </div>

          <CustomSelect 
            label="Target Branch" 
            icon={BookOpen} 
            value={branch} 
            onChange={setBranch} 
            options={branchOptions} 
          />

          <CustomSelect 
            label="GATE Attempt Year" 
            icon={Calendar} 
            value={year} 
            onChange={setYear} 
            options={yearOptions} 
          />

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-black dark:bg-white text-white dark:text-black py-3 rounded-md font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors mt-8 shadow-xl shadow-black/10 dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <Search className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
