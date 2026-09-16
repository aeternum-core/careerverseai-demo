'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/store';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import AIAssistant from '../../components/AIAssistant';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { token, user } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Session validation check
    if (mounted && !token) {
      router.push('/login');
    }
  }, [mounted, token, router]);

  if (!mounted || !token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-dark text-slate-400">
        🚀 Synchronizing credentials...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cosmic-dark">
      {/* Dynamic Headers */}
      <Navbar />

      <div className="flex flex-1 relative z-10">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Core Main Page Scrollable viewport */}
        <main className="flex-grow p-8 overflow-y-auto max-w-[calc(100vw-256px)]">
          {children}
        </main>
      </div>

      {/* Floating Gemini Chatbot Panel */}
      <AIAssistant />
    </div>
  );
}
