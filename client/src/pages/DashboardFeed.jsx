import React, { useState } from 'react';
import { Flame, MessageSquare, PlusSquare, ArrowUpRight, TrendingUp, User, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { initialPosts } from '../data/mockFeedData';

const FeedPost = ({ id, name, time, content, likes, hasLiked, replies = [], tags, image, branch, avatar, isOwnPost, onDelete, onLike, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  
  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(id, replyText);
    setReplyText("");
    setShowReplies(true);
  };

  return (
  <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-100 dark:border-white/5 mb-6 group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#222] flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 flex-shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-sm flex items-center gap-2">
            {name}
            {branch && <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded uppercase font-bold">{branch}</span>}
          </h4>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
      {isOwnPost && (
        <button 
          onClick={() => onDelete(id)} 
          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
          title="Delete post"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-4">
      {content}
    </p>
    {image && (
      <div className="mb-4 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5">
        <img src={image} alt="Post attachment" className="w-full h-auto object-cover max-h-[400px]" />
      </div>
    )}
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
      <button 
        onClick={() => onLike(id)}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${hasLiked ? 'text-orange-500' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
      >
        <Flame className={`w-4 h-4 ${hasLiked ? 'fill-orange-500' : ''}`} /> {likes} Respect
      </button>
      <button 
        onClick={() => setShowReplies(!showReplies)}
        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
      >
        <MessageSquare className="w-4 h-4" /> {replies.length} Replies
      </button>
    </div>

    {showReplies && (
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex gap-3 mb-4">
          <input 
            type="text" 
            placeholder="Write a reply..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
            className="flex-1 bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm outline-none text-black dark:text-white placeholder-gray-400"
          />
          <button onClick={handleReplySubmit} className="text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity">Post</button>
        </div>
        <div className="space-y-3">
          {replies.map((reply, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center text-[10px] flex-shrink-0 text-gray-500 dark:text-gray-400">
                <User className="w-3 h-3" />
              </div>
              <div className="bg-gray-50 dark:bg-[#222] p-2.5 rounded-xl rounded-tl-none text-xs text-gray-800 dark:text-gray-200">
                <span className="font-semibold block mb-0.5">{reply.author}</span>
                {reply.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  );
};

const DashboardFeed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [postText, setPostText] = useState("");
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const gateProfile = JSON.parse(localStorage.getItem('gateProfile') || '{}');
  const predictedAir = gateProfile.air || null;
  const getInitialPosts = () => {
    let customPosts = JSON.parse(localStorage.getItem('customPosts') || '[]');
    let needsSave = false;
    
    // Retroactively fix any old custom posts that didn't have an ID or isOwnPost flag
    customPosts = customPosts.map(post => {
      if (!post.id || post.isOwnPost === undefined) {
        needsSave = true;
        return {
          ...post,
          id: post.id || Date.now().toString() + Math.random().toString(),
          isOwnPost: true
        };
      }
      return post;
    });

    if (needsSave) {
      localStorage.setItem('customPosts', JSON.stringify(customPosts));
    }

    const replyAuthors = ["Aman Gupta", "Riya Sharma", "Vikash Singh", "Neha Katiyar", "Prakash Jha", "Anjali Mehta", "Suresh Kumar", "Aditya Rao", "Kavya Iyer", "Deepak N"];
    const replyTexts = [
      "Relatable bro! Keep grinding.",
      "Same here. Any tips to overcome this?",
      "I faced the same issue last week. Just keep giving tests.",
      "Bro, revision is key. Don't worry about the marks right now.",
      "Which test series is this? Looks tough.",
      "This is actually a very decent score for this time of the year.",
      "Syllabus completion should be your priority first.",
      "I completely agree with you on this.",
      "Absolutely! Consistency beats everything.",
      "Thanks for sharing this, I needed to hear it.",
      "Maths aur Aptitude pe dhyan do bhai, rank wahi banate hain.",
      "Spot on. PYQs refer karo iske liye.",
      "Can you share your short notes?"
    ];

    const formattedInitial = initialPosts.map(post => {
      // Auto-generate 1-3 dummy replies for mock posts based on likes
      const dummyReplies = [];
      const numReplies = Math.max(1, Math.min(3, Math.floor((post.likes || 10) / 30) + 1)); 
      
      for (let i = 0; i < numReplies; i++) {
        const idNum = typeof post.id === 'number' ? post.id : parseInt(post.id) || 1;
        const authorIdx = (idNum * 7 + i * 3) % replyAuthors.length;
        const textIdx = (idNum * 11 + i * 5) % replyTexts.length;
        dummyReplies.push({ 
          author: replyAuthors[authorIdx], 
          text: replyTexts[textIdx] 
        });
      }
      return {
        id: post.id || Math.random().toString(),
        name: post.author,
        time: post.time,
        content: post.content,
        likes: post.likes,
        image: post.image,
        branch: post.branch,
        avatar: post.avatar,
        tags: [],
        isOwnPost: false,
        replies: dummyReplies,
        hasLiked: false
      };
    });
    return [...customPosts, ...formattedInitial];
  };

  const [posts, setPosts] = useState(getInitialPosts());

  const handlePost = () => {
    if (!postText.trim()) return;
    
    const newPost = {
      id: Date.now().toString(),
      name: user?.name || "You (Aspirant)",
      time: "Just now",
      content: postText,
      likes: 0,
      tags: ["#MyPrep"],
      isOwnPost: true,
      replies: [],
      hasLiked: false
    };
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    
    // Persist custom posts so they survive reloads/signouts
    const customPosts = JSON.parse(localStorage.getItem('customPosts') || '[]');
    localStorage.setItem('customPosts', JSON.stringify([newPost, ...customPosts]));
    
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

  const handleDeletePost = (postId) => {
    // Remove from UI state
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    
    // Remove from localStorage
    const customPosts = JSON.parse(localStorage.getItem('customPosts') || '[]');
    const updatedCustom = customPosts.filter(p => p.id !== postId);
    localStorage.setItem('customPosts', JSON.stringify(updatedCustom));
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.hasLiked;
        return { 
          ...post, 
          likes: isLiked ? post.likes + 1 : post.likes - 1,
          hasLiked: isLiked
        };
      }
      return post;
    }));
  };

  const handleReply = (postId, replyText) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [{ author: user?.name || "You", text: replyText }, ...(post.replies || [])]
        };
      }
      return post;
    }));
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
              className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400 text-black dark:text-white"
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
              <FeedPost 
                key={post.id || idx} 
                {...post} 
                onDelete={handleDeletePost} 
                onLike={handleLike} 
                onReply={handleReply} 
              />
            ))}
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
};

export default DashboardFeed;
