import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

const Waiting = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('gateProfile');
    if (!saved) {
      navigate('/setup');
      return;
    }
    const p = JSON.parse(saved);
    setProfile(p);

    // Connect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // Join queue
    socket.emit('join-queue', p);

    // Listen for match
    const onMatch = (matchData) => {
      // matchData: { roomId, partnerName, partnerBranch, initiator }
      navigate(`/call/${matchData.roomId}`, { state: matchData });
    };

    socket.on('match-found', onMatch);

    return () => {
      socket.off('match-found', onMatch);
    };
  }, [navigate]);

  const handleCancel = () => {
    socket.emit('leave-queue');
    navigate('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 40%, transparent 100%)',
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner minimalist */}
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border border-white rounded-full border-t-transparent animate-spin"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
        </div>
        
        <h2 className="text-xl font-medium tracking-tight mb-2">
          Searching for a study partner...
        </h2>
        <p className="text-gray-500 text-sm mb-8 font-light">Please wait while we connect you to the network.</p>

        <button 
          onClick={handleCancel}
          className="px-6 py-2 border border-white/10 text-gray-400 text-sm rounded-md hover:bg-white/5 hover:text-white transition-colors"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};

export default Waiting;
