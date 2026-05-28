import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import ChatPanel from '../components/ChatPanel';
import { socket } from '../socket';

const Call = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(location.state);
  const [myName, setMyName] = useState('You');

  useEffect(() => {
    // If navigated directly without state, redirect to home
    if (!matchData || !socket.connected) {
      navigate('/');
      return;
    }

    const saved = localStorage.getItem('gateProfile');
    if (saved) {
      setMyName(JSON.parse(saved).name);
    }
  }, [matchData, navigate]);

  const handleEndCall = (reason) => {
    socket.emit('leave-queue'); // Ensure cleanup
    navigate('/');
  };

  const handleNextCall = () => {
    // Disconnect the socket to forcefully alert the partner and clean up server room state
    socket.disconnect();
    navigate('/waiting');
  };

  if (!matchData) return null;

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden">
      {/* Video Call Area */}
      <div className="flex-1 relative">
        {/* Top bar with Partner details */}
        <div className="absolute top-0 left-0 w-full z-30 p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <h2 className="text-white text-xl font-bold flex items-center space-x-2">
            <span>{matchData.partnerName}</span>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {matchData.partnerBranch}
            </span>
          </h2>
        </div>
        
        <VideoCall 
          socket={socket} 
          roomId={roomId} 
          partnerName={matchData.partnerName} 
          isInitiator={matchData.initiator}
          onEndCall={handleEndCall}
          onNextCall={handleNextCall}
        />
      </div>
      
      {/* Chat Panel Area */}
      <div className="w-80 md:w-96 flex-shrink-0 z-30 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
        <ChatPanel 
          socket={socket} 
          roomId={roomId} 
          senderName={myName} 
        />
      </div>
    </div>
  );
};

export default Call;
