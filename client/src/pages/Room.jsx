import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { LogOut, Mic, MicOff, Video, VideoOff, Users } from 'lucide-react';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const socketRef = useRef();
  const localVideoRef = useRef();
  const peersRef = useRef([]);
  const streamRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socketRef.current.emit('join-room', roomId, socketRef.current.id);

      socketRef.current.on('user-connected', userId => {
        const peer = createPeer(userId, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: userId,
          peer,
        });
        setPeers([...peersRef.current]);
      });

      socketRef.current.on('offer', async payload => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });
        setPeers([...peersRef.current]);
      });

      socketRef.current.on('answer', payload => {
        const item = peersRef.current.find(p => p.peerID === payload.id);
        item.peer.setRemoteDescription(new RTCSessionDescription(payload.signal));
      });

      socketRef.current.on('ice-candidate', payload => {
        const item = peersRef.current.find(p => p.peerID === payload.id);
        if (item) {
          item.peer.addIceCandidate(new RTCIceCandidate(payload.candidate));
        }
      });

      socketRef.current.on('user-disconnected', userId => {
        const peerObj = peersRef.current.find(p => p.peerID === userId);
        if (peerObj) {
          peerObj.peer.close();
        }
        peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
        setPeers([...peersRef.current]);
      });
    });

    return () => {
      socketRef.current.disconnect();
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [roomId]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peer.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          target: userToSignal,
          candidate: event.candidate,
          id: callerID
        });
      }
    };

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.createOffer().then(offer => {
      peer.setLocalDescription(offer);
      socketRef.current.emit('offer', {
        target: userToSignal,
        callerID,
        signal: offer,
      });
    });

    peer.ontrack = event => {
      setPeers(prev => prev.map(p => {
        if (p.peerID === userToSignal) {
          return { ...p, stream: event.streams[0] };
        }
        return p;
      }));
    };

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peer.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', {
          target: callerID,
          candidate: event.candidate,
          id: socketRef.current.id
        });
      }
    };

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    peer.setRemoteDescription(new RTCSessionDescription(incomingSignal)).then(() => {
      peer.createAnswer().then(answer => {
        peer.setLocalDescription(answer);
        socketRef.current.emit('answer', {
          target: callerID,
          signal: answer,
          id: socketRef.current.id,
        });
      });
    });

    peer.ontrack = event => {
      setPeers(prev => prev.map(p => {
        if (p.peerID === callerID) {
          return { ...p, stream: event.streams[0] };
        }
        return p;
      }));
    };

    return peer;
  }

  const toggleMute = () => {
    const audioTrack = streamRef.current.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  const toggleVideo = () => {
    const videoTrack = streamRef.current.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOff(!videoTrack.enabled);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 w-10 h-10 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            <Users className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GateRoom</h1>
            <p className="text-xs text-blue-400 font-mono">Room: {roomId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300 text-sm hidden md:inline-block">
            Logged in as <span className="font-bold text-white">{localStorage.getItem('username')}</span>
          </span>
          <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-500/20">
            <LogOut className="w-4 h-4" />
            <span>Leave</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max content-start bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-y-auto">
        <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video border border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.5)] group">
          <video className="w-full h-full object-cover transform scale-x-[-1]" ref={localVideoRef} autoPlay muted playsInline />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm border border-white/10 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>You ({localStorage.getItem('username')})</span>
          </div>
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="bg-gray-700 p-4 rounded-full">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {peers.map((peer) => (
          <VideoComponent key={peer.peerID} peer={peer} />
        ))}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 p-6 flex justify-center items-center space-x-6 z-10">
        <button 
          onClick={toggleMute}
          className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        <button 
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>
      </footer>
    </div>
  );
};

const VideoComponent = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    if (peer.stream) {
      ref.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div className="relative bg-gray-800 rounded-2xl overflow-hidden aspect-video border border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      <video className="w-full h-full object-cover" ref={ref} autoPlay playsInline />
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm border border-white/10 flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span>Participant</span>
      </div>
    </div>
  );
};

export default Room;
