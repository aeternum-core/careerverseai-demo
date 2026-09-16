'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { Sparkles, Trophy, Flame, Shield, Calendar, ArrowUpRight, Cpu } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const { user, token, apiUrl } = useStore();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssessment() {
      try {
        const res = await fetch(`${apiUrl}/api/student/assessment`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAssessmentData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssessment();
  }, [token, apiUrl]);

  // Default charts data if DNA assessment has not been completed
  const defaultChartData = [
    { subject: 'Technology', score: 60, fullMark: 100 },
    { subject: 'Science', score: 50, fullMark: 100 },
    { subject: 'Commerce', score: 40, fullMark: 100 },
    { subject: 'Arts', score: 70, fullMark: 100 },
    { subject: 'Law', score: 30, fullMark: 100 },
  ];

  const chartData = assessmentData?.careerFit
    ? Object.entries(assessmentData.careerFit).map(([key, val]) => ({
        subject: key,
        score: val as number,
        fullMark: 100
      }))
    : defaultChartData;

  const currentLevel = Math.floor((user?.profile?.xp || 0) / 100) + 1;
  const xpInLevel = (user?.profile?.xp || 0) % 100;

  return (
    <div className="space-y-8">
      {/* Welcome Message Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-cyan-950/40 border border-indigo-500/20 shadow-neon-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-cosmic-glow pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.profile?.fullName}! 🌌
          </h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Level {currentLevel} Space Cadet. Complete assessments and simulators to increase your Career XP and earn badges!
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          {/* Level Progress Circle */}
          <div className="relative w-20 h-20 flex items-center justify-center bg-black/40 border-2 border-indigo-500/40 rounded-full shadow-neon-cyan">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block leading-none">LEVEL</span>
              <span className="text-2xl font-black text-white font-mono">{currentLevel}</span>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-white">XP Progress</p>
            <div className="w-40 bg-white/10 h-2 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full" style={{ width: `${xpInLevel}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">{xpInLevel}/100 XP to Level {currentLevel + 1}</p>
          </div>
        </div>
      </div>

      {/* Main Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Career DNA Profile */}
        <GlassCard glowColor="purple" className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Your Career DNA Radar
            </h2>
            {assessmentData ? (
              <span className="text-xs font-bold text-indigo-300 uppercase bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-500/30">
                🧬 DNA Parsed: {assessmentData.personality}
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 animate-pulse">
                ⚠️ Assessment Pending
              </span>
            )}
          </div>

          <div className="w-full h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                <Radar
                  name="Career Fit"
                  dataKey="score"
                  stroke="#818cf8"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block font-semibold">Strengths</span>
              <p className="text-indigo-200 font-medium">{assessmentData?.strengths?.join(', ') || 'Structured thinking, Problem solving'}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
              <span className="text-slate-400 block font-semibold">Learning Style</span>
              <p className="text-cyan-200 font-medium">{assessmentData?.learningStyle || 'Logical-Mathematical'}</p>
            </div>
          </div>
        </GlassCard>

        {/* Right Side: Missions & Milestones */}
        <div className="space-y-8">
          <GlassCard glowColor="pink" className="space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-400" />
              Active Learning Missions
            </h2>
            <div className="space-y-3">
              {[
                { task: "Complete Career DNA Assessment", xp: "+150 XP", done: !!assessmentData },
                { task: "Inspect 3D Galaxy Coordinates", xp: "+50 XP", done: true },
                { task: "Run Coder Simulation Sandbox", xp: "+100 XP", done: (user?.profile?.xp || 0) > 100 }
              ].map((mission, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${mission.done ? 'bg-indigo-600 border-indigo-400' : 'border-white/20'}`}>
                      {mission.done && <span className="text-[10px] text-white">✓</span>}
                    </div>
                    <span className={`text-xs ${mission.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>{mission.task}</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 font-mono">{mission.xp}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Badges Showcase */}
          <GlassCard className="space-y-4 border-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Earned Badges ({user?.profile?.badges?.length || 0})
            </h2>
            <div className="flex flex-wrap gap-2">
              {user?.profile?.badges?.map((badge, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-full shadow-sm">
                  <Shield className="w-3.5 h-3.5 fill-amber-500/20" />
                  {badge}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Footer Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="border-white/5 flex justify-between items-center py-6">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Exam Readiness Index</p>
            <p className="text-3xl font-extrabold text-white font-mono">82%</p>
          </div>
          <Calendar className="w-10 h-10 text-indigo-500/40" />
        </GlassCard>

        <GlassCard className="border-white/5 flex justify-between items-center py-6">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Placement Score Forecast</p>
            <p className="text-3xl font-extrabold text-emerald-400 font-mono">78%</p>
          </div>
          <ArrowUpRight className="w-10 h-10 text-emerald-500/40" />
        </GlassCard>

        <GlassCard className="border-white/5 flex justify-between items-center py-6">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Learning Streaks</p>
            <p className="text-3xl font-extrabold text-amber-400 font-mono">{user?.profile?.streak || 0} Days</p>
          </div>
          <Flame className="w-10 h-10 text-amber-500/40" />
        </GlassCard>
      </div>
    </div>
  );
}
