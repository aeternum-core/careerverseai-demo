'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../../../context/store';
import { Sparkles, Mail, Lock, User, UserPlus, ShieldAlert } from 'lucide-react';
import GlassCard from '../../../components/GlassCard';

export default function RegisterPage() {
  const router = useRouter();
  const { apiUrl } = useStore();
  
  // Registration States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'otp'>('register');

  // OTP Verification States
  const [otp, setOtp] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }
      if (data.emailSent) {
        setEmailSent(true);
      }

      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      setVerificationSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
        
        {step === 'register' ? (
          <>
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 items-center justify-center shadow-neon-purple mx-auto">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black tracking-wide text-white">VOYAGER REGISTER</h2>
              <p className="text-slate-400 text-sm">Join the CareerVerse mapping network.</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-2.5 rounded-xl mb-6">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Cosmic Explorer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Choose Trajectory Role</label>
                <div className="relative">
                  <ShieldAlert className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b0726] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                  >
                    <option value="student">Student Voyager (Default)</option>
                    <option value="counselor">Certified Counselor</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-neon-purple flex items-center justify-center gap-2 transition-all"
              >
                {loading ? 'Initializing Launchpad...' : (
                  <>
                    Sign Up and Send OTP
                    <UserPlus className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Already mapped?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-white underline font-medium">
                Log in here
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 items-center justify-center shadow-neon-purple mx-auto">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black tracking-wide text-white">VERIFY IDENTITY</h2>
              <p className="text-slate-400 text-sm">We sent a 6-digit OTP code to <br /><span className="text-indigo-300 font-mono font-medium">{email}</span>.</p>
              
              {emailSent ? (
                <p className="text-[11px] text-emerald-400 font-semibold">📬 Verification code delivered to your email inbox!</p>
              ) : devOtp ? (
                <div className="bg-indigo-950/60 border border-indigo-500/30 p-3 rounded-xl space-y-1 my-2">
                  <p className="text-[11px] text-indigo-300 font-medium">🚀 Live Demo Mode (No SMTP needed):</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-pink-400 font-black text-base tracking-widest bg-black/40 px-3 py-0.5 rounded-lg border border-pink-500/20">{devOtp}</span>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtp)}
                      className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-md transition-all shadow-neon-purple"
                    >
                      Auto-Fill OTP
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-amber-400 italic">Check your email or backend logs to read the code!</p>
              )}
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-2.5 rounded-xl mb-6">
                ⚠️ {error}
              </div>
            )}

            {verificationSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-3 rounded-xl mb-6 text-center">
                ✅ OTP Verified! Initiating login sequences...
              </div>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 text-center block">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-36 mx-auto text-center py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold text-lg tracking-[0.4em] focus:outline-none focus:border-indigo-500 transition-colors block"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-neon-purple transition-all"
                >
                  {loading ? 'Validating Token...' : 'Verify Email Address'}
                </button>
              </form>
            )}

            <button
              onClick={() => setStep('register')}
              className="text-slate-400 hover:text-white text-xs block mx-auto mt-6 underline font-semibold"
            >
              ← Edit details
            </button>
          </>
        )}
      </GlassCard>
    </div>
  );
}
