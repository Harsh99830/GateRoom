import React, { useState, useEffect } from 'react';
import { Trophy, Share2, Download, X } from 'lucide-react';

const Leaderboard = ({ currentUser }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingBadge, setGeneratingBadge] = useState(false);
  const [badgeImg, setBadgeImg] = useState(null);
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/study/leaderboard?period=week`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeaders(data.slice(0, 3));
        } else {
          console.warn('Leaderboard API did not return an array:', data);
          setLeaders([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleShareRank = async () => {
    if (!currentUser || !currentUser.id) {
       alert('Please login to generate your rank badge');
       return;
    }
    setGeneratingBadge(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/badge/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const data = await res.json();
      if (data.image) {
        setBadgeImg(data.image);
      } else {
        alert(data.error || 'Failed to generate badge');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate badge');
    }
    setGeneratingBadge(false);
  };
  
  const downloadBadge = () => {
    const a = document.createElement('a');
    a.href = badgeImg;
    a.download = 'GATERoom_Rank.png';
    a.click();
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        const res = await fetch(badgeImg);
        const blob = await res.blob();
        const file = new File([blob], 'GATERoom_Rank.png', { type: 'image/png' });
        await navigator.share({
          title: 'My GATERoom Rank',
          text: 'Check out my study streak on GATERoom!',
          files: [file]
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      downloadBadge();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-white/10 mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Weekly Leaderboard
        </h3>
        {currentUser && (
           <button 
             onClick={handleShareRank}
             disabled={generatingBadge}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
           >
             {generatingBadge ? <span className="animate-pulse">Generating...</span> : <><Share2 className="w-4 h-4" /> Share My Rank</>}
           </button>
        )}
      </div>
      
      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          leaders.map((user, idx) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-lg ${idx < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20' : 'bg-gray-50 dark:bg-white/5 border border-transparent'}`}>
              <div className="flex items-center gap-4">
                <span className={`font-bold w-6 text-center ${idx === 0 ? 'text-yellow-500 text-lg' : idx === 1 ? 'text-gray-400 text-lg' : idx === 2 ? 'text-orange-400 text-lg' : 'text-gray-500'}`}>
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="font-medium dark:text-white flex items-center gap-2">
                    {user.name} {user.isBot && <span className="text-[10px] bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full font-bold">BOT</span>}
                  </h4>
                  <p className="text-xs text-gray-500">{user.branch} • {user.currentStreak} day streak 🔥</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold dark:text-white">{Math.floor(user.weeklyMinutes / 60)}h {user.weeklyMinutes % 60}m</div>
                <div className="text-[10px] text-gray-500">this week</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Badge Modal */}
      {badgeImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm w-full relative">
            <button onClick={() => setBadgeImg(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-white font-medium text-lg mb-4">Your Rank Badge</h3>
            <img src={badgeImg} alt="Rank Badge" className="w-full rounded-xl shadow-2xl mb-6 border border-white/5" />
            <div className="flex gap-3">
              <button onClick={shareNative} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button onClick={downloadBadge} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium">
                <Download className="w-5 h-5" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
