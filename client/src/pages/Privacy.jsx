import React from 'react';
import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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

          <h1 className="text-4xl font-medium tracking-tight mb-8 text-black dark:text-white">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-2xl pb-20">
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">1. Information We Collect</h2>
              <p>When you sign in with Google, we collect basic profile information including your name and email address. We also store your preferences related to your GATE preparation, specifically your target branch and attempt year.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">2. How We Use Your Information</h2>
              <p>We use your information exclusively to facilitate peer-to-peer matchmaking. Your target branch and attempt year are used to connect you with relevant study partners. We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">3. Communication Data (WebRTC)</h2>
              <p>Video and audio calls on GateRoom use WebRTC technology, which means communication is peer-to-peer. We do not route your video or audio through our servers, nor do we record or store any of your calls or text chats.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">4. Data Security</h2>
              <p>Your data is stored securely using Supabase. We implement standard security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black dark:text-white mb-3">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact the developer via GitHub or standard support channels.</p>
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
            Your data is yours. Your focus is absolute.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Privacy;
