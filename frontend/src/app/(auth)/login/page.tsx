'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../context/store';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';
import GlassCard from '../../../components/GlassCard';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, apiUrl } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAuth(data.token, data.user);
      router.push('/dashboard/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: "mock-google-token-2026",
          email: "voyager.explorer@careerverse.ai",
          fullName: "Cosmic Voyager"
        })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setAuth(data.token, data.user);
      router.push('/dashboard/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-20 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-indigo-900/20 blur-[100px] pointer-events-none" />

      <GlassCard glowColor="purple" className="w-full max-w-md p-8 border-indigo-500/20 relative z-10">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 items-center justify-center shadow-neon-purple mx-auto">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white">WELCOME VOYAGER</h2>
          <p className="text-slate-400 text-sm">Access your CareerVerse profile dashboard.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-2.5 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voyager@careerverse.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-neon-purple flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Entering Hyperdrive...' : (
              <>
                Login to Dashboard
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          onClick={handleGoogleMock}
          disabled={loading}
          className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all text-sm mb-6"
        >
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.139 4.114A5.783 5.783 0 018.2 12.729a5.783 5.783 0 015.785-5.785 5.64 5.64 0 013.918 1.542l3.159-3.159A9.972 9.972 0 0013.985 2a9.985 9.985 0 00-9.985 9.985 9.985 9.985 0 009.985 9.985c5.52 0 9.857-3.887 9.857-9.985 0-.573-.057-1.129-.163-1.685H12.24z"/>
          </svg>
          Quick Google Sign-In MOCK
        </button>

        <p className="text-center text-xs text-slate-500">
          New voyager?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-white underline font-medium">
            Register here
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
