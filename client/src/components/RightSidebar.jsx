import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, Target, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RightSidebar = () => {
  const navigate = useNavigate();
  const gateProfile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
  const predictedAir = gateProfile.air || null;
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    const getStreak = () => {
      const streakData = JSON.parse(localStorage.getItem('userStreak') || '{"count": 0}');
      setStreakCount(streakData.count);
    };
    
    getStreak(); // initial load
    
    window.addEventListener('streakUpdated', getStreak);
    return () => window.removeEventListener('streakUpdated', getStreak);
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-2rem)] sticky top-4 mr-4 p-6 flex-shrink-0 border border-gray-200 dark:border-white/10 rounded-3xl bg-white dark:bg-[#111] shadow-sm overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-black dark:text-white" />
          Your Current Standing
        </h3>
        {predictedAir ? (
          <>
            <div className="text-4xl font-black tracking-tighter mb-1 text-black dark:text-white">AIR {predictedAir.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mb-6">Predicted based on your latest stats.</p>
          </>
        ) : (
          <>
            <div className="text-2xl font-black tracking-tighter mb-2 text-gray-400 dark:text-gray-600">Not Calculated</div>
            <p className="text-xs text-gray-500 mb-6">Complete setup to see your predicted rank.</p>
          </>
        )}
        <button 
          onClick={() => navigate('/onboarding')}
          className="w-full py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Update Stats <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 mb-4">
        <h4 className="text-sm font-bold flex items-center gap-2 mb-2"><Flame className="w-4 h-4 text-orange-500" /> Daily Streak</h4>
        <p className="text-2xl font-black text-black dark:text-white">{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</p>
        <p className="text-xs text-gray-500 mt-1">Keep it up! Consistency is key.</p>
      </div>
      
      <button 
        onClick={() => navigate('/onboarding')}
        className="w-full text-left bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl p-4 transition-colors block"
      >
        <h4 className="text-sm font-bold flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-blue-500" /> Profile Completed</h4>
        <p className="text-sm font-medium text-black dark:text-white">
          {predictedAir ? "All set for GATE 2026!" : "Finish setup to unlock rank"}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-3">
          <div className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-1000" style={{ width: predictedAir ? '100%' : '30%' }}></div>
        </div>
        <p className="text-xs text-right mt-1 text-gray-500">{predictedAir ? '100%' : '30%'}</p>
      </button>
    </aside>
  );
};

export default RightSidebar;
