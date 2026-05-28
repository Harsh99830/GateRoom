import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from 'lucide-react';

const VideoCall = ({ socket, roomId, partnerName, isInitiator, onEndCall }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  useEffect(() => {
    // Join room
    socket.emit('join-room', roomId, socket.id);

    const setupWebRTC = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = localStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = peerConnection;

        // Add local tracks
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('webrtc-ice-candidate', { roomId, candidate: event.candidate });
          }
        };

        // Listen for signaling from partner
        socket.on('webrtc-offer', async ({ offer }) => {
          if (!peerConnectionRef.current) return;
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit('webrtc-answer', { roomId, answer });
        });

        socket.on('webrtc-answer', async ({ answer }) => {
          if (!peerConnectionRef.current) return;
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on('webrtc-ice-candidate', async ({ candidate }) => {
          if (!peerConnectionRef.current) return;
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        });

        socket.on('partner-disconnected', () => {
          onEndCall('Partner disconnected');
        });

      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    setupWebRTC();

    // The initiator sends the offer once the partner joins the room
    const handleUserConnected = async () => {
      if (isInitiator && peerConnectionRef.current) {
        try {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socket.emit('webrtc-offer', { roomId, offer });
        } catch (err) {
          console.error("Error creating offer:", err);
        }
      }
    };

    socket.on('user-connected', handleUserConnected);

    return () => {
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('webrtc-ice-candidate');
      socket.off('user-connected');
      socket.off('partner-disconnected');
      
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [roomId, socket, isInitiator, partnerName, onEndCall]);

  return (
    <div className="relative w-full h-screen bg-gray-950 overflow-hidden flex items-center justify-center">
      {/* Remote Video (Fullscreen) */}
      <video 
        ref={remoteVideoRef} 
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Local Video (Bottom-Right Small) */}
      <div className="absolute bottom-28 right-6 w-32 h-48 md:w-48 md:h-64 bg-gray-900 rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/20 z-20 transition-transform hover:scale-105">
        <video 
          ref={localVideoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : 'block'}`}
        />
        {isVideoOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <VideoOff className="w-8 h-8 text-gray-500" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/60 text-xs font-medium text-white px-2 py-1 rounded-md backdrop-blur border border-white/10">
          You
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20 bg-gray-900/80 backdrop-blur-md px-8 py-4 rounded-full border border-gray-700/50 shadow-2xl">
         <button 
           onClick={toggleMute} 
           className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
         >
           {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
         </button>
         
         <button 
           onClick={() => onEndCall('Call ended')} 
           className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
         >
           <PhoneOff className="w-6 h-6" />
         </button>
         
         <button 
           onClick={toggleVideo} 
           className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
         >
           {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
         </button>
      </div>
    </div>
  );
};

export default VideoCall;
