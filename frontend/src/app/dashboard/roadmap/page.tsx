'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { Route, Sparkles, CheckSquare, Printer, Award } from 'lucide-react';

export default function RoadmapPage() {
  const { token, apiUrl, awardXP } = useStore();
  const [career, setCareer] = useState('Technology');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/ai/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ career })
      });
      const data = await res.json();
      if (res.ok) {
        setRoadmap(data.roadmap);
        awardXP(100, 'Future Planner');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current roadmap on mount
  useEffect(() => {
    async function loadRoadmap() {
      try {
        const res = await fetch(`${apiUrl}/api/ai/roadmap`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRoadmap(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadRoadmap();
  }, [token, apiUrl]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Route className="w-8 h-8 text-indigo-400" />
            AI Career Roadmap
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Generate customized 1, 3, and 5 year learning roadmaps.
          </p>
        </div>

        {roadmap && (
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 text-xs flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Roadmap
          </button>
        )}
      </div>

      {/* Select Box */}
      <GlassCard className="border-white/5 flex flex-col md:flex-row gap-4 items-end justify-between print:hidden">
        <div className="space-y-1.5 flex-grow">
          <label className="text-xs font-semibold text-slate-300">Target Career Path</label>
          <select
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0a2d] border border-indigo-500/30 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner cursor-pointer"
          >
            <option value="Technology" className="bg-[#0b0726] text-slate-100 py-2">Technology & Cloud Architect</option>
            <option value="Law" className="bg-[#0b0726] text-slate-100 py-2">Corporate Law & Arbitrations</option>
            <option value="Science" className="bg-[#0b0726] text-slate-100 py-2">Data Science & Bioinformatics</option>
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-neon-purple transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          {loading ? 'Synthesizing Path...' : 'Generate Roadmap'}
        </button>
      </GlassCard>

      {/* Visual Roadmap display */}
      {loading ? (
        <div className="text-center py-20 text-indigo-400 animate-pulse text-sm">
          ⚡ Synthesizing roadmap milestones and learning guidelines...
        </div>
      ) : roadmap ? (
        <div className="space-y-8 relative pl-6 md:pl-0">
          
          {/* Vertical Center Line for Desktop */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-indigo-500/20 -translate-x-1/2 hidden md:block" />

          {/* Year 1 */}
          <div className="relative flex flex-col md:flex-row items-center gap-8 md:justify-start">
            <div className="absolute left-0 md:left-1/2 w-6 h-6 rounded-full bg-indigo-600 border-4 border-indigo-950 -translate-x-1/2 z-15 shadow-neon-purple flex items-center justify-center text-[10px] font-bold text-white">1</div>
            <div className="w-full md:w-[45%]">
              <GlassCard glowColor="purple" className="p-6 border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Year 1: Initiate Trajectory</h3>
                  <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Phase I</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Target Milestones:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside mt-1">
                      {roadmap['1_year']?.goals.map((g: string, idx: number) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Daily Actions:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside mt-1">
                      {roadmap['1_year']?.actionItems.map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Year 3 */}
          <div className="relative flex flex-col md:flex-row items-center gap-8 md:justify-end">
            <div className="absolute left-0 md:left-1/2 w-6 h-6 rounded-full bg-cyan-600 border-4 border-indigo-950 -translate-x-1/2 z-15 shadow-neon-cyan flex items-center justify-center text-[10px] font-bold text-white">3</div>
            <div className="w-full md:w-[45%]">
              <GlassCard glowColor="cyan" className="p-6 border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Year 3: Consolidate Skills</h3>
                  <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Phase II</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Target Milestones:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside mt-1">
                      {roadmap['3_year']?.goals.map((g: string, idx: number) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Daily Actions:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside mt-1">
                      {roadmap['3_year']?.actionItems.map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Year 5 */}
          <div className="relative flex flex-col md:flex-row items-center gap-8 md:justify-start">
            <div className="absolute left-0 md:left-1/2 w-6 h-6 rounded-full bg-pink-600 border-4 border-indigo-950 -translate-x-1/2 z-15 shadow-neon-pink flex items-center justify-center text-[10px] font-bold text-white">5</div>
            <div className="w-full md:w-[45%]">
              <GlassCard glowColor="pink" className="p-6 border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Year 5: Master Domain</h3>
                  <span className="text-[10px] text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">Phase III</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Target Milestones:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside mt-1">
                      {roadmap['5_year']?.goals.map((g: string, idx: number) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Daily Actions:</span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside mt-1">
                      {roadmap['5_year']?.actionItems.map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      ) : (
        <GlassCard className="text-center py-20 border-white/5 flex flex-col justify-center items-center">
          <Route className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-400">Roadmap Pending</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1">Select your desired trajectory domain above to map your learning checkpoints.</p>
        </GlassCard>
      )}
    </div>
  );
}
