import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

const ChatPanel = ({ socket, roomId, senderName }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    socket.emit('send-message', {
      roomId,
      text: inputText.trim(),
      senderName
    });

    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800 shadow-xl">
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-white font-semibold">Room Chat</h2>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No messages yet. Say hi to {senderName === 'You' ? 'your partner' : 'your partner'}!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.senderName === senderName;
            return (
              <div 
                key={idx} 
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm ${
                    isMine 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm' 
                      : 'bg-gray-700 text-gray-100 rounded-bl-sm border border-gray-600'
                  }`}
                >
                  <div className="text-sm break-words whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                </div>
                <div className="text-[10px] text-gray-500 mt-1.5 flex items-center space-x-1.5 px-1">
                  {!isMine && <span className="font-medium text-gray-400">{msg.senderName}</span>}
                  {!isMine && <span className="w-1 h-1 rounded-full bg-gray-600"></span>}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-3 items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none max-h-32 min-h-[44px] scrollbar-none"
            rows="1"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/25 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
