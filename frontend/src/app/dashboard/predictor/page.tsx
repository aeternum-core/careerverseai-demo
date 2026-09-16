'use client';

import React, { useState } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { Cpu, Star, ArrowUpRight, ShieldAlert, Award } from 'lucide-react';

export default function PlacementPredictorPage() {
  const { token, apiUrl, awardXP } = useStore();

  // Inputs
  const [cgpa, setCgpa] = useState('8.2');
  const [skills, setSkills] = useState('JavaScript, React, Next.js, Node.js');
  const [projects, setProjects] = useState('2');
  const [internships, setInternships] = useState('1');

  // Outputs
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch(`${apiUrl}/api/ai/predict-placement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cgpa: parseFloat(cgpa),
          skills: skillsArray,
          projects: parseInt(projects) || 0,
          internships: parseInt(internships) || 0
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPrediction(data);
        awardXP(100, 'Placement Strategist');
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
          <Cpu className="w-8 h-8 text-indigo-400" />
          AI Placement Predictor
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Input your credentials to calculate recruitment preparedness and salary ranges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Inputs */}
        <GlassCard glowColor="purple" className="lg:col-span-2 space-y-5 h-fit">
          <h2 className="text-lg font-bold text-white mb-4">Credentials Ledger</h2>
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">CGPA (0 - 10.0)</label>
              <input
                type="number"
                step="0.01"
                required
                min={0}
                max={10}
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Skills (Comma Separated)</label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Complete Projects Count</label>
              <input
                type="number"
                required
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Completed Internships</label>
              <input
                type="number"
                required
                value={internships}
                onChange={(e) => setInternships(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-neon-purple transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Evaluating Model...' : 'Analyze Placement Readiness'}
            </button>
          </form>
        </GlassCard>

        {/* Right Side: Prediction Details */}
        <div className="lg:col-span-3 space-y-6">
          {prediction ? (
            <>
              {/* Score Indicator */}
              <GlassCard glowColor="cyan" className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    Readiness Appraisal
                  </h3>
                  <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    Calculated Index
                  </span>
                </div>

                <div className="flex items-center gap-8">
                  {/* Gauge */}
                  <div className="w-24 h-24 rounded-full border-4 border-cyan-500/30 flex items-center justify-center relative shadow-neon-cyan">
                    <span className="text-3xl font-black text-white font-mono">{prediction.readinessScore}%</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 font-semibold">EXPECTED SALARY BRACKET</p>
                    <p className="text-xl font-extrabold text-white">{prediction.salaryRange}</p>
                    <p className="text-xs text-slate-400">
                      Interview status: <span className="text-cyan-300 font-semibold">{prediction.interviewReadiness}</span>
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Matches & recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Recruiter Match List</h4>
                  <div className="space-y-2">
                    {prediction.companyMatchProbability.map((comp: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-200">
                        <span>{comp}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Roadmap Upgrades</h4>
                  <div className="space-y-2">
                    {prediction.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex gap-2 text-xs text-indigo-200 leading-relaxed bg-indigo-900/10 p-2.5 rounded-lg border border-indigo-500/10">
                        <span className="text-indigo-400">💡</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </>
          ) : (
            <GlassCard className="flex flex-col items-center justify-center text-center py-20 border-white/5 h-full">
              <ShieldAlert className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Awaiting Data</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Submit your credentials ledger on the left to run our matching algorithms.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
