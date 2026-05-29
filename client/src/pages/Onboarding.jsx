import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, AlertTriangle, ArrowRight, ChevronRight, Share2, ChevronDown, Sun, Moon, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GATE_BRANCHES } from '../constants'; // assuming we still have this

const CustomSelect = ({ value, options, placeholder, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label;

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 outline-none transition-all cursor-pointer flex justify-between items-center hover:border-gray-300 dark:hover:border-white/20 ${isOpen ? 'ring-2 ring-black dark:ring-white border-transparent' : ''}`}
      >
        <span className={value ? "text-black dark:text-white" : "text-gray-400"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 w-full bottom-full mb-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1 backdrop-blur-xl origin-bottom animate-in fade-in zoom-in-95 duration-100">
            {options.map((opt) => (
              <div 
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2.5 mx-1 my-0.5 rounded-lg cursor-pointer transition-colors text-sm font-medium ${
                  value === opt.value 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    hoursPerDay: '',
    daysPerWeek: '',
    monthsStudying: '',
    branch: '',
    targetYear: '',
    completedSubjects: '',
    weakSubjects: '',
    lastMockScore: '',
    noMockYet: false
  });
  const [proofFile, setProofFile] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handlePredict = () => {
    setLoading(true);
    // Fake prediction logic
    setTimeout(() => {
      const h = Number(formData.hoursPerDay) || 0;
      const d = Number(formData.daysPerWeek) || 0;
      const m = Number(formData.monthsStudying) || 0;
      const totalHours = h * d * 4 * m;
      const mock = Number(formData.mockScore) || 0;
      
      let predictedAir = 15000;
      let message = "";
      
      if (formData.noMockYet) {
        // Rely purely on hours since no mock score is provided
        if (totalHours > 1500) {
          predictedAir = Math.floor(Math.random() * 500) + 500;
          message = "Great consistency! Take a mock test to break into Top 100.";
        } else if (totalHours > 800) {
          predictedAir = Math.floor(Math.random() * 2000) + 1500;
          message = "Good effort, but you need to start taking mock tests to see your real standing.";
        } else if (totalHours > 300) {
          predictedAir = Math.floor(Math.random() * 10000) + 5000;
          message = "Average preparation. You are far behind the competition.";
        } else if (totalHours > 50) {
          predictedAir = Math.floor(Math.random() * 50000) + 40000;
          message = "Reality Check: Toppers study 10x more than this. Time to wake up.";
        } else {
          // Worst case scenario: out of 10 Lakh candidates
          predictedAir = Math.floor(Math.random() * 200000) + 750000; // AIR 7.5L to 9.5L
          message = "Brutal Truth: With this prep, you are at the absolute bottom of 10 Lakh candidates. Start studying seriously.";
        }
      } else {
        // Mock score is the biggest predictor
        if (mock >= 85) {
          predictedAir = Math.floor(Math.random() * 50) + 1;
          message = "Phenomenal! You are in the AIR 1-50 zone. Maintain this momentum.";
        } else if (mock >= 75) {
          predictedAir = Math.floor(Math.random() * 200) + 50;
          message = "Excellent! You're on track for a Top IIT. Push for those last 10 marks.";
        } else if (mock >= 60) {
          predictedAir = Math.floor(Math.random() * 700) + 300;
          message = "Very good score. Focus on your weak areas to break into the top 100.";
        } else if (mock >= 45) {
          predictedAir = Math.floor(Math.random() * 2000) + 1500;
          message = "Decent base, but high competition ahead. You need serious revision.";
        } else if (mock >= 25) {
          predictedAir = Math.floor(Math.random() * 30000) + 10000;
          message = "Your mock scores indicate a lack of conceptual clarity. Revisit the basics.";
        } else {
          // Worst case scenario: out of 10 Lakh candidates
          predictedAir = Math.floor(Math.random() * 250000) + 650000; // AIR 6.5L to 9L
          message = "Extremely low score. You are behind 9 Lakh students. Stop taking mocks and read standard books.";
        }
        
        // Hour modifier: adjust rank slightly based on consistency
        if (h >= 8) predictedAir = Math.floor(predictedAir * 0.85); // 15% boost
        else if (h < 4) predictedAir = Math.floor(predictedAir * 1.3); // 30% penalty
      }
      
      // Ensure rank doesn't go below 1
      predictedAir = Math.max(1, predictedAir);

      setResult({
        air: predictedAir,
        message,
        deficit: totalHours < 1200 ? 1200 - totalHours : 0,
        noMockYet: formData.noMockYet
      });

      // Update streak for updating stats
      const today = new Date().toDateString();
      const streakData = JSON.parse(localStorage.getItem('userStreak') || '{"count": 0, "lastPostDate": null}');
      
      if (streakData.lastPostDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (streakData.lastPostDate === yesterday.toDateString()) {
          streakData.count += 1;
        } else {
          streakData.count = 1;
        }
        streakData.lastPostDate = today;
        localStorage.setItem('userStreak', JSON.stringify(streakData));
        window.dispatchEvent(new Event('streakUpdated'));
      }

      setLoading(false);
      setStep(2);
    }, 1500);
  };

  if (step === 2 && result) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex items-center justify-center p-4 relative transition-colors duration-500">
        
        <div className="max-w-md w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-black dark:bg-white" />
          
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-white/10 text-black dark:text-white mb-4 border border-gray-200 dark:border-white/10">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">Predicted Rank</h2>
            <div className="text-6xl font-extrabold tracking-tighter mb-4">AIR {result.air}</div>
            <p className="text-lg font-medium text-black dark:text-white mb-2">
              {result.message}
            </p>
            {result.noMockYet && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Add your mock score later for a more accurate estimate.
              </p>
            )}
          </div>

          {result.deficit > 0 && (
            <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-8 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-black dark:text-white flex-shrink-0" />
              <p className="text-sm text-gray-800 dark:text-gray-200">
                You are <strong>{result.deficit} hours</strong> behind the average AIR 100 candidate. Increase your daily hours by 3 to catch up.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Share2 className="w-5 h-5" /> Share Reality Check
            </button>
            <button 
              onClick={() => {
                const profile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
                localStorage.setItem('gateProfile', JSON.stringify({ ...profile, ...formData, air: result.air }));
                navigate('/');
              }}
              className="w-full py-4 rounded-xl bg-gray-100 dark:bg-white/5 text-black dark:text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              Continue to Feed <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPredictDisabled = 
    !formData.hoursPerDay || 
    !formData.daysPerWeek || 
    loading || 
    (formData.lastMockScore && !formData.noMockYet && !proofFile);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex items-center justify-center p-4 relative transition-colors duration-500">
      
      <div className="max-w-3xl w-full">
        <div className="flex justify-between items-center mb-8">
          <img src="/favicon.svg" alt="GateRoom Logo" className="w-8 h-8 invert dark:invert-0" />
          <button 
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-black dark:hover:text-white font-medium text-sm transition-colors"
          >
            Skip for now
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Let's find your baseline.</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Be brutally honest. We'll compare your stats against past toppers to predict your standing.</p>

        <div className="space-y-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-5 md:p-6 rounded-3xl shadow-xl shadow-black/5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Hours per day</label>
              <input 
                type="number" 
                name="hoursPerDay"
                value={formData.hoursPerDay}
                onChange={handleChange}
                placeholder="Enter daily hours"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Days per week</label>
              <input 
                type="number" 
                name="daysPerWeek"
                max="7"
                value={formData.daysPerWeek}
                onChange={handleChange}
                placeholder="Enter days (1-7)"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Months prep so far</label>
            <input 
              type="number" 
              name="monthsStudying"
              value={formData.monthsStudying}
              onChange={handleChange}
              placeholder="Total months of prep"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Completed Subjects</label>
              <input 
                type="text" 
                name="completedSubjects"
                value={formData.completedSubjects}
                onChange={handleChange}
                placeholder="e.g. Math, Aptitude"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Weak Subjects</label>
              <input 
                type="text" 
                name="weakSubjects"
                value={formData.weakSubjects}
                onChange={handleChange}
                placeholder="e.g. Networks, Algo"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Last Mock Test Score & Proof</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="number" 
                name="lastMockScore"
                value={formData.noMockYet ? '' : formData.lastMockScore}
                onChange={handleChange}
                disabled={formData.noMockYet}
                placeholder="Score (e.g. 45)"
                className={`w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all ${formData.noMockYet ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              
              {!formData.noMockYet && formData.lastMockScore && (
                <div className="relative w-full sm:w-1/2 animate-in fade-in zoom-in-95 duration-300">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                  />
                  <div className="w-full h-full px-4 py-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center gap-2 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/40">
                    <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate">
                      {proofFile ? proofFile.name : "Upload Screenshot"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 mt-3 cursor-pointer w-fit">
              <input 
                type="checkbox" 
                name="noMockYet"
                checked={formData.noMockYet}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Haven't given any mock yet
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Target Year</label>
              <CustomSelect 
                value={formData.targetYear}
                onChange={(val) => setFormData({...formData, targetYear: val})}
                placeholder="Select Year"
                options={[
                  { label: 'GATE 2026', value: '2026' },
                  { label: 'GATE 2027', value: '2027' },
                  { label: 'GATE 2028', value: '2028' },
                  { label: 'GATE 2029', value: '2029' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Branch</label>
              <CustomSelect 
                value={formData.branch}
                onChange={(val) => setFormData({...formData, branch: val})}
                placeholder="Select Branch"
                options={[
                  { label: 'Aerospace Engineering (AE)', value: 'AE' },
                  { label: 'Agricultural Engineering (AG)', value: 'AG' },
                  { label: 'Architecture and Planning (AR)', value: 'AR' },
                  { label: 'Biomedical Engineering (BM)', value: 'BM' },
                  { label: 'Biotechnology (BT)', value: 'BT' },
                  { label: 'Civil Engineering (CE)', value: 'CE' },
                  { label: 'Chemical Engineering (CH)', value: 'CH' },
                  { label: 'Computer Science and Information Technology (CS)', value: 'CS' },
                  { label: 'Chemistry (CY)', value: 'CY' },
                  { label: 'Data Science & Artificial Intelligence (DA)', value: 'DA' },
                  { label: 'Electronics and Communication (EC)', value: 'EC' },
                  { label: 'Electrical Engineering (EE)', value: 'EE' },
                  { label: 'Environmental Science & Engg (ES)', value: 'ES' },
                  { label: 'Ecology and Evolution (EY)', value: 'EY' },
                  { label: 'Geomatics Engineering (GE)', value: 'GE' },
                  { label: 'Geology and Geophysics (GG)', value: 'GG' },
                  { label: 'Instrumentation Engineering (IN)', value: 'IN' },
                  { label: 'Mathematics (MA)', value: 'MA' },
                  { label: 'Mechanical Engineering (ME)', value: 'ME' },
                  { label: 'Mining Engineering (MN)', value: 'MN' },
                  { label: 'Metallurgical Engineering (MT)', value: 'MT' },
                  { label: 'Naval Architecture & Marine Engg (NM)', value: 'NM' },
                  { label: 'Petroleum Engineering (PE)', value: 'PE' },
                  { label: 'Physics (PH)', value: 'PH' },
                  { label: 'Production and Industrial Engg (PI)', value: 'PI' },
                  { label: 'Statistics (ST)', value: 'ST' },
                  { label: 'Textile Engineering and Fibre Science (TF)', value: 'TF' },
                  { label: 'Engineering Sciences (XE)', value: 'XE' },
                  { label: 'Humanities and Social Sciences (XH)', value: 'XH' },
                  { label: 'Life Sciences (XL)', value: 'XL' },
                ]}
              />
            </div>
          </div>

          <button 
            onClick={handlePredict}
            disabled={isPredictDisabled}
            className="w-full py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Analyzing against Toppers..." : "Predict My Rank"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
