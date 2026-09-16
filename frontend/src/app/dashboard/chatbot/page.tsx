'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { io, Socket } from 'socket.io-client';
import { MessageSquareCode, Send, Sparkles, Terminal, FileSearch } from 'lucide-react';

export default function ChatbotPage() {
  const { token, apiUrl } = useStore();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch History from DB and Connect Sockets
  useEffect(() => {
    // REST fetch initial chat context history
    async function loadHistory() {
      try {
        const res = await fetch(`${apiUrl}/api/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ message: "Hello", history: [] }) // Handshake trigger
        });
        const data = await res.json();
        if (res.ok && data.history) {
          // Filter out the initial handshake message if desired or just show it
          setMessages(data.history.slice(2)); // skips initial mock welcome sequence
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadHistory();

    // Sockets initialization
    socketRef.current = io(apiUrl);

    socketRef.current.on('receive_message', (data: any) => {
      setMessages(prev => [...prev, data]);
      setTyping(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [token, apiUrl]);

  // 2. Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // 3. Send Message
  const sendMessage = (text: string) => {
    if (!text.trim() || !socketRef.current) return;
    
    // Add User message locally
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Emit via Sockets
    socketRef.current.emit('send_message', {
      message: text,
      history: messages
    });
  };

  const handleQuickCommand = (cmd: string) => {
    sendMessage(cmd);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <MessageSquareCode className="w-8 h-8 text-indigo-400" />
            AI Career Counselor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Talk to our counselor, practice job interviews, or request resume reviews.
          </p>
        </div>
      </div>

      {/* Main Chat Deck */}
      <GlassCard className="flex-grow flex flex-col justify-between overflow-hidden p-0 border-white/5 bg-black/35 relative">
        <div className="absolute inset-0 bg-cosmic-glow pointer-events-none" />

        {/* Messages Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 relative z-10">
          
          {/* Welcome default bot greeting */}
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 rounded-2xl px-4 py-3 text-xs leading-relaxed">
              🌌 Voyager connection established! I am your AI Counselor. Ask me about careers, college paths, or type **"Mock Interview"** / **"Review Resume"** to run specific career simulators.
            </div>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line border ${
                m.role === 'user'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-white/5 border-white/5 text-slate-200'
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-white/5 border border-white/5 text-slate-400 rounded-2xl px-4 py-3 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Control Footer */}
        <div className="p-4 border-t border-white/5 bg-black/40 space-y-3 relative z-10">
          
          {/* Quick Shortcuts */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickCommand("Let's do a Mock Interview prep for tech role")}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full text-[10px] font-semibold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Practice Mock Interview
            </button>
            <button
              onClick={() => handleQuickCommand("Can you review my CV details for missing skills?")}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full text-[10px] font-semibold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <FileSearch className="w-3.5 h-3.5 text-pink-400" />
              Review Resume Keywords
            </button>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. How do I get into space law?)"
              className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-neon-purple transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
