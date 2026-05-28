import React from 'react';
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white flex p-4 font-sans relative overflow-hidden transition-colors duration-500">
      
      {/* Left Half - Content */}
      <div className="w-full lg:w-[60%] flex flex-col h-full overflow-y-auto pr-4 lg:pr-12">
        <div className="py-8 px-6 lg:px-12">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-16">
            <Cpu className="w-7 h-7 text-black dark:text-white" />
            <div className="flex items-center">
              <span className="font-extrabold tracking-tighter text-black dark:text-white text-2xl">Gate</span>
              <span className="font-light tracking-widest text-gray-500 dark:text-gray-400 italic text-2xl">Room</span>
            </div>
          </Link>

          <h1 className="text-4xl font-medium tracking-tight mb-8 text-black dark:text-white">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl pb-20">
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using GateRoom, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">2. Description of Service</h2>
              <p>GateRoom is a peer-to-peer matchmaking platform designed specifically for GATE aspirants to connect, study, and collaborate via video and text chat based on their target branch and attempt year.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">3. User Conduct</h2>
              <p>You agree to use GateRoom for its intended educational purposes. Any form of harassment, hate speech, inappropriate content, or misuse of the platform's video and chat features will result in immediate termination of your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">4. Account Security</h2>
              <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. We utilize Google Authentication to ensure industry-standard security.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">5. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.</p>
            </section>
          </div>
        </div>
      </div>

      {/* Right Half - Image */}
      <div className="hidden lg:flex lg:w-[40%] relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-black m-1 border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none sticky top-1 h-[calc(100vh-2rem)]">
        <img 
          src="/auth-bg.png" 
          alt="Abstract Study" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-100 grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent dark:from-black dark:via-black/20"></div>
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-black dark:text-white text-2xl font-medium dark:font-light leading-tight mb-4 drop-shadow-md dark:drop-shadow-lg">
            Rules exist to maintain the sanctity of focus.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Terms;
