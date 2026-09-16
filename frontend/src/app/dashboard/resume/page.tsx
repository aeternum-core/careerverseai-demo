'use client';

import React, { useState } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { FileSearch, CheckCircle2, AlertCircle, BookOpen, Award } from 'lucide-react';

export default function ResumeAnalyzerPage() {
  const { token, apiUrl, awardXP } = useStore();

  // Inputs
  const [resumeText, setResumeText] = useState('John Doe\nExperienced in HTML, CSS, JavaScript, React. Built standard portfolios.');
  const [targetRole, setTargetRole] = useState('Software Engineer');

  // Outputs
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/ai/analyze-skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resumeText, targetRole })
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysis(data);
        awardXP(100, 'Skill Analyst');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <FileSearch className="w-8 h-8 text-indigo-400" />
          AI Skill Gap Analyzer
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Paste your resume text or certifications ledger to scan for critical missing industry competencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Inputs */}
        <GlassCard glowColor="purple" className="lg:col-span-2 space-y-4 h-fit">
          <h2 className="text-lg font-bold text-white mb-2">Resume Submission</h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Role Title</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0a2d] border border-indigo-500/30 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner cursor-pointer"
              >
                <option value="Software Engineer" className="bg-[#0b0726] text-slate-100 py-2">Software Engineer</option>
                <option value="Corporate Lawyer" className="bg-[#0b0726] text-slate-100 py-2">Corporate Lawyer</option>
                <option value="Data Scientist" className="bg-[#0b0726] text-slate-100 py-2">Data Scientist</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Resume / CV Details (Paste Text)</label>
              <textarea
                required
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste work experience, degree courses, projects, and certifications details..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors resize-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-neon-purple transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? 'Scanning Resume...' : 'Analyze Skill Gap'}
            </button>
          </form>
        </GlassCard>

        {/* Right Output */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center py-20 text-indigo-400 animate-pulse text-sm">
              📂 Scanning semantic indexes and matching industry maps...
            </div>
          ) : analysis ? (
            <>
              {/* Readiness bar */}
              <GlassCard glowColor="cyan" className="p-6 border-white/5 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Overall Skill Readiness</span>
                  <span className="text-cyan-300 font-extrabold font-mono">{analysis.readinessPercentage}%</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full" style={{ width: `${analysis.readinessPercentage}%` }} />
                </div>
              </GlassCard>

              {/* Skills matched / missing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Present Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.presentSkills.map((sk: string, i: number) => (
                      <span key={i} className="text-[10px] bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                        {sk}
                      </span>
                    ))}
                    {analysis.presentSkills.length === 0 && <span className="text-xs text-slate-500">None detected.</span>}
                  </div>
                </GlassCard>

                <GlassCard className="border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-rose-400" /> Missing Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missingSkills.map((sk: string, i: number) => (
                      <span key={i} className="text-[10px] bg-rose-950/20 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Recommended Courses & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-400" /> Recommended Study Guides
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2">
                    {analysis.recommendedCourses.map((c: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-indigo-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard className="border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> Recommended Credentials
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2">
                    {analysis.certificationsNeeded.map((c: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            </>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center text-center py-24 border-white/5 h-full">
              <FileSearch className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-400">Awaiting Profile Submission</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">Paste your experience sheet to calculate skill gap charts.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
