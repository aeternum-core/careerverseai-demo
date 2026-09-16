'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Cpu, Terminal, GraduationCap, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function LandingPage() {
  return (
    <main className="w-full flex-grow flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center max-w-4xl space-y-6 z-10 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold tracking-wider uppercase animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Next-Generation AI Career Navigation
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
          Map Your Destiny in the <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-500 to-cyan-400">
            CareerVerse AI
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Embark on an interstellar career navigation journey. Discover matching colleges, simulate future jobs, predict placements, and master skills using generative AI.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-6">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-neon-purple flex items-center gap-2 transform hover:scale-[1.03] transition-all duration-300"
          >
            Launch Career Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-2xl flex items-center gap-2 transition-all duration-300"
          >
            Access Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl w-full z-10 mb-20 px-4">
        {[
          { number: "98%", label: "Placement Match Rate" },
          { number: "500+", label: "Colleges Indexed" },
          { number: "15,000+", label: "Voyagers Enrolled" },
          { number: "30+", label: "Interactive Simulations" }
        ].map((stat, i) => (
          <GlassCard key={i} className="text-center py-6 border-white/5">
            <h3 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 font-mono">
              {stat.number}
            </h3>
            <p className="text-xs text-indigo-300 font-medium mt-1 uppercase tracking-wide">
              {stat.label}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Key Feature Pillars */}
      <div className="max-w-6xl w-full z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">
          Core Exploration Systems
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glowColor="purple" className="flex flex-col justify-between h-64">
            <div>
              <Compass className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">3D Career Galaxy Map</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Zoom, rotate and select active fields across Tech, Science, Commerce, and Arts using interactive particle orbits.
              </p>
            </div>
            <Link href="/login" className="text-xs text-indigo-300 font-bold hover:text-white flex items-center gap-1 mt-4">
              Explore Galaxy <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>

          <GlassCard glowColor="cyan" className="flex flex-col justify-between h-64">
            <div>
              <Terminal className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Interactive Simulations</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Experience day-in-the-life tasks. Debug code as a coder, review case arguments as a lawyer, diagnose patients as a doctor.
              </p>
            </div>
            <Link href="/login" className="text-xs text-cyan-300 font-bold hover:text-white flex items-center gap-1 mt-4">
              Enter Simulator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>

          <GlassCard glowColor="pink" className="flex flex-col justify-between h-64">
            <div>
              <Cpu className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI DNA Assessment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Decipher your personality profiles and learning indices. Map matching categories and unlock dynamic credentials.
              </p>
            </div>
            <Link href="/login" className="text-xs text-pink-300 font-bold hover:text-white flex items-center gap-1 mt-4">
              Analyze Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
