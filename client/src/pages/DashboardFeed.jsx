import React, { useState } from 'react';
import { Flame, MessageSquare, PlusSquare, ArrowUpRight, TrendingUp, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const FeedPost = ({ name, time, content, likes, tags }) => (
  <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-white/5 mb-6">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold border border-gray-200 dark:border-white/10">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
    </div>
    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-4">
      {content}
    </p>
    {tags && (
      <div className="flex gap-2 mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-gray-600 dark:text-gray-400">
            {tag}
          </span>
        ))}
      </div>
    )}
    <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/5 pt-4">
      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">
        <Flame className="w-4 h-4" /> {likes} Respect
      </button>
      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">
        <MessageSquare className="w-4 h-4" /> Reply
      </button>
    </div>
  </div>
);

const DashboardFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [postText, setPostText] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const gateProfile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
  const predictedAir = gateProfile.air || null;
  const [posts, setPosts] = useState([
    {
      name: "Rahul Verma",
      time: "2 hours ago",
      content: "Just updated my stats. Pushed my daily average to 8 hours. The prediction model jumped my expected AIR from 4000 to 800! Consistency is the only hack.",
      likes: 124,
      tags: ["#CSE", "#Target2025"]
    },
    {
      name: "Sneha Patil",
      time: "5 hours ago",
      content: "Does anyone else feel burned out after doing Engineering Math all day? I'm 20 hours behind the topper average this week. Need to catch up this weekend.",
      likes: 89,
      tags: ["#ECE", "#RealityCheck"]
    },
    {
      name: "Karan Singh",
      time: "1 day ago",
      content: "Revision is going strong. Need to focus more on Aptitude though.",
      likes: 89,
      tags: ["#ME", "#Consistency"]
    }
  ]);

  const handlePost = () => {
    if (!postText.trim()) return;
    
    const newPost = {
      name: user?.name || "You (Ready to Crack GATE)",
      time: "Just now",
      content: postText,
      likes: 0,
      tags: ["#MyPrep"]
    };
    
    setPosts([newPost, ...posts]);
    setPostText("");

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
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex w-full">
      
      <Sidebar />

      {/* Main Feed */}
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Aspirant Network</h2>
          </div>

          {/* Update Status Input */}
          <div className="bg-white dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-white/5 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-black dark:text-white">
              <User className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Share an update on your prep..." 
              className="flex-1 bg-transparent outline-none text-sm"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePost()}
            />
            <button 
              onClick={handlePost}
              className="p-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 rounded-lg transition-opacity"
            >
              <PlusSquare className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {posts.map((post, idx) => (
              <FeedPost key={idx} {...post} />
            ))}
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
};

export default DashboardFeed;
