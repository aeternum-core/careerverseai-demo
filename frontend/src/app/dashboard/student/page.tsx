'use client';

import React, { useEffect, useState } from 'react';
import { useStore, ICareerTwinState } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { 
  Cpu, 
  Sparkles, 
  Trophy, 
  Flame, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Target, 
  RotateCcw, 
  HelpCircle,
  QrCode,
  Share2,
  X,
  Layers,
  Award,
  Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, token, apiUrl, careerTwin, setCareerTwin } = useStore();
  const [twin, setTwin] = useState<ICareerTwinState | null>(careerTwin);
  const [loading, setLoading] = useState(!careerTwin);
  const [activeExplainRole, setActiveExplainRole] = useState<string | null>(null);
  const [showPassport, setShowPassport] = useState(false);
  const [verifyingSkill, setVerifyingSkill] = useState<string | null>(null);
  const [missionSuccess, setMissionSuccess] = useState(false);

  // Fetch Career Twin on mount
  useEffect(() => {
    async function loadTwin() {
      try {
        const res = await fetch(`${apiUrl}/api/student/career-twin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTwin(data);
          setCareerTwin(data);
        }
      } catch (err) {
        console.error('Failed to load Career Twin:', err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadTwin();
    }
  }, [token, apiUrl, setCareerTwin]);

  // Handle Daily Mission Completion
  const handleCompleteMission = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/student/mission/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTwin(data.twin);
        setCareerTwin(data.twin);
        setMissionSuccess(true);
        setTimeout(() => setMissionSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Interactive Skill Verification Challenge
  const handleVerifySkill = async (skillName: string) => {
    setVerifyingSkill(skillName);
    try {
      // Simulate completing an adaptive 3-question diagnostic challenge
      const randomScore = Math.floor(75 + Math.random() * 20); // 75-95%
      const res = await fetch(`${apiUrl}/api/student/skill-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ skillName, score: randomScore })
      });
      if (res.ok) {
        const data = await res.json();
        setTwin(data.twin);
        setCareerTwin(data.twin);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingSkill(null);
    }
  };

  if (loading || !twin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-mono text-indigo-300">Synchronizing your living Career Twin...</p>
      </div>
    );
  }

  const currentLevel = Math.floor((user?.profile?.xp || 0) / 100) + 1;

  return (
    <div className="space-y-8">
      
      {/* 1. TOP HEADER: Career Twin Identity & Passport Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-7 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-[#0c0528]/80 to-purple-950/50 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-cosmic-glow pointer-events-none opacity-40" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              LIVING CAREER TWIN ACTIVE
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full text-[11px] font-mono">
              ● Synchronized
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Cadet {twin.studentName || user?.profile?.fullName}
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Targeting <span className="text-white font-bold underline decoration-indigo-500 decoration-2">{twin.targetCareer}</span>. Your Career Twin actively evolves with every simulation decision and skill verified.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setShowPassport(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white rounded-2xl text-xs font-bold shadow-neon-purple transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            Digital Career Passport
          </button>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-2xl border border-white/10">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-white font-bold">{user?.profile?.streak || 3} Day Streak</span>
          </div>
        </div>
      </div>

      {/* 2. THE CORE HERO: Career Readiness Index (CRI) Progress Bar */}
      <GlassCard glowColor="purple" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 block">
              Employability Metric
            </span>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-400" />
              Career Readiness Index: {twin.readiness.current}%
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">CURRENT</span>
              <span className="text-white font-bold text-base">{twin.readiness.current}%</span>
            </div>
            <span className="text-indigo-400 font-bold">→</span>
            <div>
              <span className="text-emerald-400 block text-[10px]">BENCHMARK</span>
              <span className="text-emerald-400 font-bold text-base">{twin.readiness.target}%</span>
            </div>
          </div>
        </div>

        {/* Visual Milestone Track: YOU -> TARGET */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Entry Level (40%)</span>
            <span className="text-indigo-300 font-bold">YOU ARE HERE ({twin.readiness.current}%)</span>
            <span className="text-emerald-400 font-bold">TARGET REACHED (90%)</span>
          </div>
          <div className="w-full bg-slate-900/80 h-3.5 rounded-full overflow-hidden border border-white/10 relative">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${twin.readiness.current}%` }}
            />
            {/* Target Marker Pin */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-emerald-400 shadow-neon-green"
              style={{ left: `${twin.readiness.target}%` }}
            />
          </div>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Domain Knowledge</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-white font-mono">{twin.readiness.knowledge}%</span>
              <span className="text-xs text-indigo-400 font-mono">Strong base</span>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Verified Skills</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-white font-mono">{twin.readiness.skills}%</span>
              <span className="text-xs text-amber-400 font-mono">Needs MLOps</span>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Hands-on Experience</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-white font-mono">{twin.readiness.experience}%</span>
              <span className="text-xs text-cyan-400 font-mono">{twin.experience.projectsCount} Proj • {twin.experience.internshipsCount} Intern</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 3. NEXT BEST ACTION & DAILY CAREER MISSION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Next Best Action */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#120836] to-[#08031d] border border-indigo-500/40 shadow-xl space-y-4 relative">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
            YOUR NEXT BEST ACTION
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              Master Cloud Model Deployment (MLOps)
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong className="text-white">Why?</strong> Your algorithmic modeling and Python proficiency are strong, but cloud inference and containerization are your single largest career gap.
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/roadmap')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-neon-purple"
          >
            Launch MLOps Roadmap
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Career Mission */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1a2f] to-[#060e1d] border border-cyan-500/40 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
              <Trophy className="w-4 h-4 text-cyan-400" />
              DAILY CAREER MISSION
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
              +{twin.dailyMission.xpReward} XP
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white">
              {twin.dailyMission.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {twin.dailyMission.task}
            </p>
          </div>

          <div className="pt-1">
            {twin.dailyMission.completed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                Mission Completed Today! +{twin.dailyMission.delta}% {twin.dailyMission.skillTarget}
              </div>
            ) : (
              <button
                onClick={handleCompleteMission}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                Complete Mission & Claim Reward
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. CAREER FIT MATRIX WITH EXPLAINABLE AI (XAI) */}
      <GlassCard glowColor="purple" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Adaptive Career Alignment
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous intelligence calculated from your verified skills, academic background, and behavioral simulation metrics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {twin.careerFit.map(c => {
            const isExplaining = activeExplainRole === c.role;
            const isTarget = c.role.toLowerCase() === twin.targetCareer.toLowerCase();

            return (
              <div
                key={c.role}
                className={`p-5 rounded-2xl border transition-all ${
                  isTarget 
                    ? 'bg-[#150a3b]/90 border-indigo-500/60 shadow-neon-purple' 
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {isTarget && (
                      <span className="text-[9px] font-mono font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider block mb-1">
                        Primary Target
                      </span>
                    )}
                    <h4 className="text-base font-black text-white">{c.role}</h4>
                  </div>
                  <span className="text-xl font-black text-indigo-400 font-mono">
                    {c.score}%
                  </span>
                </div>

                {/* Evidence count and gaps preview */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{c.evidence.length} Matching signals</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{c.skillGaps.length} Skill gaps to target</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveExplainRole(isExplaining ? null : c.role)}
                  className="mt-4 w-full py-1.5 bg-white/5 hover:bg-white/10 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  {isExplaining ? 'Hide Rationale' : 'Explain Why?'}
                </button>

                {/* EXPLAINABLE AI (XAI) DRAWER */}
                {isExplaining && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">
                        Why this career? (Evidence)
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1 mt-1">
                        {c.evidence.map((ev, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">✓</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">
                        Identified Skill Gaps
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1 mt-1">
                        {c.skillGaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400">⚠</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold">
                        What would boost this score?
                      </span>
                      <div className="space-y-1.5 mt-1">
                        {c.actionableBoosts.map((boost, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] bg-black/40 p-2 rounded-lg border border-white/5">
                            <span className="text-slate-300">{boost.action}</span>
                            <span className="text-emerald-400 font-mono font-bold">+{boost.boost}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 5. DUAL-TIER SKILLS: SELF-REPORTED VS. VERIFIED */}
      <GlassCard glowColor="purple" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Verified Competency Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distinguishing self-reported claims from verified assessment benchmarks.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Self-Reported
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Verified Score
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {twin.skills.map(s => (
            <div key={s.name} className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2.5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-white block">{s.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{s.category}</span>
                </div>
                <button
                  onClick={() => handleVerifySkill(s.name)}
                  disabled={verifyingSkill === s.name}
                  className="px-2.5 py-1 bg-white/5 hover:bg-indigo-600/40 text-indigo-300 hover:text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  {verifyingSkill === s.name ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  )}
                  Verify Skill
                </button>
              </div>

              {/* Verified Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-emerald-400">Verified Proficiency</span>
                  <span className="text-emerald-400 font-bold">{s.verified}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${s.verified}%` }} />
                </div>
              </div>

              {/* Self-Reported Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Self-Reported Claim</span>
                  <span className="text-slate-300">{s.selfReported}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500/70 h-full rounded-full" style={{ width: `${s.selfReported}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 6. BEHAVIORAL PROFILE ENGINE (Updated from Career Simulations) */}
      <GlassCard glowColor="purple" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Behavioral Signal Index
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuously calibrated by your choices, latency, and problem-solving strategies in Career Simulations.
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/simulator')}
            className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            Launch New Simulation
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Analytical</span>
            <span className="text-xl font-black text-indigo-300 font-mono">{twin.behavior.analyticalThinking}%</span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Risk Mgmt</span>
            <span className="text-xl font-black text-cyan-300 font-mono">{twin.behavior.riskManagement}%</span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Quality</span>
            <span className="text-xl font-black text-emerald-300 font-mono">{twin.behavior.qualityOrientation}%</span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Leadership</span>
            <span className="text-xl font-black text-amber-300 font-mono">{twin.behavior.leadership}%</span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Adaptability</span>
            <span className="text-xl font-black text-pink-300 font-mono">{twin.behavior.adaptability}%</span>
          </div>
        </div>
      </GlassCard>

      {/* 7. DIGITAL CAREER PASSPORT MODAL (Holographic Card) */}
      {showPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#13093c] via-[#090320] to-[#040110] border-2 border-indigo-500/50 rounded-3xl p-6 shadow-neon-purple space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 block">CareerVerse Certified</span>
                  <h3 className="text-lg font-black text-white">Digital Career Passport</h3>
                </div>
              </div>
              <button
                onClick={() => setShowPassport(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Passport Body */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-2xl border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">CADET NAME</span>
                  <span className="text-sm font-bold text-white">{twin.studentName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">VERIFIED TOKEN</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">{twin.passportToken}</span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30">
                  <span className="text-[9px] text-slate-400 font-mono block uppercase">Target Specialization</span>
                  <span className="text-xs font-bold text-white">{twin.targetCareer}</span>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[9px] text-slate-400 font-mono block uppercase">Readiness Index</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{twin.readiness.current}% Employable</span>
                </div>
              </div>

              {/* Verified Skills Badges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Verified Skill Matrix</span>
                <div className="flex flex-wrap gap-1.5">
                  {twin.skills.map(s => (
                    <span key={s.name} className="text-[10px] bg-white/5 text-slate-200 border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <span className="text-emerald-400 font-bold">✓</span> {s.name} ({s.verified}%)
                    </span>
                  ))}
                </div>
              </div>

              {/* Simulated QR Code & Authenticity Seal */}
              <div className="flex items-center justify-between bg-black/60 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Cryptographic Verification</span>
                    <span className="text-xs text-slate-300 font-semibold">Shareable with Colleges & Mentors</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://careerverse-ai.vercel.app/verify/${twin.passportToken}`);
                alert('Passport Verification Link copied to clipboard!');
              }}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-neon-purple transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Copy Verification Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
