import React from 'react';
import { Home, Trophy, BarChart2, Users, Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', icon: BarChart2, path: '/analytics' },
    { name: 'Rankers', icon: Trophy, path: '/rankers' },
    { name: 'Discussions', icon: Home, path: '/' },
    { name: 'Gate Talks', icon: Users, path: '/discussions' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] sticky top-4 ml-4 border border-gray-200 dark:border-white/10 p-6 flex-shrink-0 rounded-3xl bg-white dark:bg-[#111] shadow-sm">
      <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => navigate('/')}>
        <img src="/favicon.svg" alt="GateRoom Logo" className="w-8 h-8 invert dark:invert-0" />
        <span className="font-bold text-xl tracking-tight">GATERoom</span>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left ${isActive ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              <item.icon className="w-5 h-5" /> {item.name}
            </button>
          )
        })}
      </nav>
      
      <div className="mt-auto flex flex-col gap-2">
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl font-medium text-sm transition-colors text-left"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        <div className="my-2 border-t border-gray-200 dark:border-white/10"></div>
        
        <button 
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left group"
        >
          <div className="w-9 h-9 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-sm flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-black dark:text-white truncate">{user?.name || "User Profile"}</span>
            <span className="text-xs text-gray-500 truncate">{user?.email || "Manage account"}</span>
          </div>
        </button>
        
        <button 
          onClick={() => {
            // User requested to NOT delete token, profile, or any data on sign out during dev
            navigate('/auth');
          }}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl font-medium text-sm transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
