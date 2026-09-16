'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/store';
import { io, Socket } from 'socket.io-client';
import { MessageSquareCode, Sparkles, X, Send, Terminal, HelpCircle } from 'lucide-react';
import GlassCard from './GlassCard';

export default function AIAssistant() {
  const { token, apiUrl, careerTwin, user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize socket connections
  useEffect(() => {
    socketRef.current = io(apiUrl);

    socketRef.current.on('receive_message', (data: any) => {
      setMessages(prev => [...prev, data]);
      setTyping(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [apiUrl]);

  // Scroll viewport down
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const getTwinContext = () => {
    if (!careerTwin) return undefined;
    return `
STUDENT CAREER TWIN PROFILE:
- Name: ${careerTwin.studentName || user?.profile?.fullName || 'Cadet'}
- Target Career: ${careerTwin.targetCareer}
- Career Readiness Index (CRI): ${careerTwin.readiness.current}% (Target: ${careerTwin.readiness.target}%)
- Verified Skills: ${careerTwin.skills.map(s => `${s.name} (${s.verified}% verified, ${s.selfReported}% self-reported)`).join(', ')}
- Behavioral Signals: Analytical Thinking (${careerTwin.behavior.analyticalThinking}%), Quality Orientation (${careerTwin.behavior.qualityOrientation}%), Risk Management (${careerTwin.behavior.riskManagement}%)
- Top Career Fit: ${careerTwin.careerFit[0]?.role} (${careerTwin.careerFit[0]?.score}% Fit)
- Identified Skill Gaps: ${careerTwin.careerFit[0]?.skillGaps?.join(', ') || 'None'}
- Identified Experience Gaps: ${careerTwin.careerFit[0]?.expGaps?.join(', ') || 'None'}
`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const userMsg = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    // Emit via sockets with rich Career Twin memory context
    socketRef.current.emit('send_message', {
      message: input,
      history: messages,
      context: getTwinContext()
    });
  };

  const handleQuickCommand = (promptText: string) => {
    setInput('');
    if (!socketRef.current) return;

    const userMsg = { role: 'user', content: promptText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    socketRef.current.emit('send_message', {
      message: promptText,
      history: messages,
      context: getTwinContext()
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans print:hidden">
      {/* 1. Floating Launch Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white flex items-center justify-center shadow-neon-purple hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all duration-300 transform hover:scale-105 active:scale-95 relative group"
        >
          <MessageSquareCode className="w-6 h-6 animate-pulse" />
          {/* Badge indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 border border-indigo-950 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-950 animate-bounce">
            AI
          </span>
        </button>
      )}

      {/* 2. Floating Glassmorphic Chat Panel */}
      {isOpen && (
        <GlassCard
          glowColor="purple"
          className="w-80 md:w-96 h-[480px] flex flex-col justify-between overflow-hidden p-0 border-indigo-500/30 shadow-2xl relative animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/80 to-purple-950/40 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Gemini Counselor</h3>
                <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-ping" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-black/20 text-xs">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-2">
                <MessageSquareCode className="w-8 h-8 text-indigo-400/50 mx-auto" />
                <p className="text-slate-300 font-semibold">Initiate Trajectory Dialogue</p>
                <p className="text-slate-500 text-[10px] max-w-xs mx-auto">Ask about engineering entry thresholds, syllabus planners, or mock placements!</p>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-line border ${
                    m.role === 'user'
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-[#150f38] border-indigo-500/25 text-slate-200'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-[#150f38] border border-indigo-500/25 text-slate-400 rounded-2xl px-3.5 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick command nodes */}
          {messages.length === 0 && (
            <div className="px-4 py-2 bg-black/40 flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickCommand("Tell me about future job options")}
                className="text-[9px] bg-white/5 hover:bg-white/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full transition-all"
              >
                🚀 Careers
              </button>
              <button
                onClick={() => handleQuickCommand("How can I prepare for CLAT exam?")}
                className="text-[9px] bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full transition-all"
              >
                ⚖️ Law Entrance
              </button>
            </div>
          )}

          {/* Form controls */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-white/5 bg-gradient-to-b from-black/40 to-indigo-950/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Gemini anything..."
              className="flex-grow px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-neon-purple transition-all flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </GlassCard>
      )}
    </div>
  );
}
