'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../context/store';
import { 
  LayoutDashboard, 
  Dna, 
  Globe2, 
  Cpu, 
  Terminal, 
  School, 
  Calendar, 
  GraduationCap, 
  MessageSquareCode, 
  FileSearch, 
  Route, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard/student', icon: LayoutDashboard, roles: ['student'] },
    { name: 'DNA Assessment', path: '/dashboard/assessment', icon: Dna, roles: ['student'] },
    { name: 'Career Galaxy', path: '/dashboard/galaxy', icon: Globe2, roles: ['student'] },
    { name: 'Future Predictor', path: '/dashboard/predictor', icon: Cpu, roles: ['student'] },
    { name: 'Career Simulator', path: '/dashboard/simulator', icon: Terminal, roles: ['student'] },
    { name: 'College Explorer', path: '/dashboard/colleges', icon: School, roles: ['student'] },
    { name: 'Entrance Exams', path: '/dashboard/exams', icon: Calendar, roles: ['student'] },
    { name: 'Scholarships', path: '/dashboard/scholarships', icon: GraduationCap, roles: ['student'] },
    { name: 'AI Chatbot', path: '/dashboard/chatbot', icon: MessageSquareCode, roles: ['student'] },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: FileSearch, roles: ['student'] },
    { name: 'Roadmaps', path: '/dashboard/roadmap', icon: Route, roles: ['student'] },
    { name: 'Admin Hub', path: '/dashboard/admin', icon: ShieldAlert, roles: ['admin'] },
    { name: 'Counselor Desk', path: '/dashboard/counselor', icon: UserCheck, roles: ['counselor'] }
  ];

  const filteredLinks = links.filter(l => l.roles.includes(user.role));

  return (
    <aside className="w-64 min-h-[calc(100vh-70px)] glass-panel border-r border-white/5 p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
          Cosmic Navigation
        </p>

        {filteredLinks.map((link, idx) => {
          const Icon = link.icon;
          const isActive = pathname === link.path;
          return (
            <Link
              key={idx}
              href={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm ${
                isActive 
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/30 shadow-neon-cyan' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-white/5 pt-4 px-3 text-[11px] text-slate-500 text-center">
        ⚡ CareerVerse AI Engine v1.0
      </div>
    </aside>
  );
}
