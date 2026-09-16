'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/store';
import { Sparkles, Trophy, LogOut, Flame, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 py-4 px-8 flex justify-between items-center">
      <Link href="/dashboard/student" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-neon-purple animate-pulse">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-cyan-400">
          CAREERVERSE AI
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-amber-400 font-semibold text-sm">
          <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
          <span>{user.profile.streak || 0} Day Streak</span>
        </div>

        {/* XP Tracker */}
        <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full text-purple-300 font-semibold text-sm">
          <Trophy className="w-4 h-4 text-purple-400" />
          <span>{user.profile.xp || 0} XP</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user.profile.fullName}</p>
            <p className="text-[10px] text-indigo-300 capitalize">{user.role}</p>
          </div>

          <button
            onClick={logout}
            className="text-slate-400 hover:text-rose-400 transition-colors duration-200 ml-2"
            title="Sign Out Voyager"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
