import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Clock, Target, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { useNavigate } from 'react-router-dom';
import { RANKERS_DATA } from '../data/rankers2025.js';

const Rankers = () => {
  const navigate = useNavigate();
  const gateProfile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
  const predictedAir = gateProfile.air || null;
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we are at the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.offsetHeight
      ) {
        if (!isLoading && visibleCount < RANKERS_DATA.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount(prev => prev + 10);
            setIsLoading(false);
          }, 1500); // simulate network delay as requested
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, visibleCount]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex w-full">
      <Sidebar />
      
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 min-h-screen">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Hall of Fame (All-Time Toppers)</h2>
              <p className="text-sm text-gray-500">
                Official AIR 1 candidates across various engineering branches from 2024 to 2026.
              </p>
            </div>
            <a 
              href="https://www.shiksha.com/engineering/gate-exam-results" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-medium bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors inline-flex items-center gap-1.5 w-fit"
            >
              Verified Source ↗
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {RANKERS_DATA.slice(0, visibleCount).map((ranker) => (
              <div key={ranker.id} className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                {/* Gold Gradient Accent for AIR 1 */}
                {ranker.air === 1 && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${ranker.air === 1 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-gray-100 dark:bg-white/10 text-black dark:text-white'}`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{ranker.name}</h3>
                      <p className="text-sm text-gray-500">{ranker.branch} • {ranker.targetYear}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-black dark:text-white">AIR {ranker.air}</div>
                    <div className="text-sm font-medium text-gray-500">Score: {ranker.score}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Study Time</div>
                    <div className="font-semibold text-sm">{ranker.hoursPerDay} hrs/day • {ranker.daysPerWeek} days/wk</div>
                    <div className="text-xs text-gray-400 mt-0.5">{ranker.monthsStudying} months prep</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Last Mock</div>
                    <div className="font-semibold text-sm">{ranker.lastMockScore} Marks</div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">Verified</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Strong Subjects</div>
                    <p className="text-sm font-medium">{ranker.completedSubjects}</p>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Weaknesses Overcome</div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{ranker.weakSubjects}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-white/10 dark:border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          {!isLoading && visibleCount >= RANKERS_DATA.length && (
            <div className="text-center py-8 text-sm text-gray-500">
              You have reached the end of the list.
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
};

export default Rankers;
