import React from 'react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { Users, Clock } from 'lucide-react';

const GateTalks = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black text-black dark:text-white flex w-full">
      <Sidebar />
      <main className="flex-1 min-w-0 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-gray-100 dark:bg-white/10 rounded-3xl mx-auto flex items-center justify-center shadow-sm border border-gray-200 dark:border-white/5">
            <Users className="w-10 h-10 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">Gate Talks</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              We're building an exclusive community space where GATE aspirants can discuss strategies, solve doubts, and connect with verified toppers.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  );
};

export default GateTalks;
