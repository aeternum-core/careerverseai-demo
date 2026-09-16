'use client';

import React, { useState } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { Terminal, Shield, Play, RotateCcw, AlertTriangle } from 'lucide-react';

export default function SimulatorPage() {
  const { token, apiUrl, awardXP } = useStore();

  // Active Simulation States
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [activeStep, setActiveStep] = useState<any>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startSimulation = async (career: string) => {
    setLoading(true);
    setSelectedCareer(career);
    setStepIndex(0);
    setFeedback(null);
    setCompleted(false);

    try {
      const res = await fetch(`${apiUrl}/api/ai/simulation/${career}?step=0`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setActiveStep(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (option: any) => {
    setFeedback(option.feedback);
    setLoading(true);

    const nextStepVal = option.nextId;
    setStepIndex(nextStepVal);

    try {
      const res = await fetch(`${apiUrl}/api/ai/simulation/${selectedCareer}?step=${nextStepVal}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // If no options left, the simulation is complete!
        if (!data.options || data.options.length === 0) {
          setCompleted(true);
          awardXP(100, selectedCareer === 'software_engineer' ? 'Tech Innovator' : selectedCareer === 'lawyer' ? 'Legal Advocate' : 'Medical Specialist');
        }
        setActiveStep(data);
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
          <Terminal className="w-8 h-8 text-cyan-400" />
          Career Simulation Engine
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Simulate professional tasks dynamically and evaluate operational parameters.
        </p>
      </div>

      {!selectedCareer ? (
        // Career Selection Grid
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[
            { id: "software_engineer", name: "Software Engineer", desc: "Test security features, deploy hotfixes, and manage accumulated technical debt.", color: "cyan" },
            { id: "lawyer", name: "Corporate Lawyer", desc: "Mitigate intellectual property issues, draft declarations, and organize settlements.", color: "purple" },
            { id: "doctor", name: "Emergency Doctor", desc: "Coordinate vascular diagnoses, stabilize heart rates, and make surgical referrals.", color: "pink" }
          ].map((car, idx) => (
            <GlassCard key={idx} glowColor={car.color as any} className="flex flex-col justify-between h-64">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Interactive Sandbox</span>
                <h3 className="text-xl font-bold text-white mb-3">{car.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{car.desc}</p>
              </div>
              <button
                onClick={() => startSimulation(car.id)}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all text-xs mt-6"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Initialize Simulation
              </button>
            </GlassCard>
          ))}
        </div>
      ) : (
        // Simulator Shell Cockpit
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between bg-black/60 border border-white/10 border-b-0 px-6 py-3 rounded-t-2xl font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
              <span className="ml-2 text-indigo-400">Voyager Sandbox Shell: {selectedCareer.toUpperCase()}</span>
            </div>
            <span>Step index: {stepIndex}</span>
          </div>

          <div className="bg-black/90 border border-white/10 rounded-b-2xl p-8 min-h-[400px] flex flex-col justify-between font-mono text-cyan-400 shadow-2xl relative">
            {loading ? (
              <div className="flex-grow flex items-center justify-center text-sm animate-pulse text-indigo-400">
                ⚡ Initializing sector diagnostics...
              </div>
            ) : completed ? (
              // Completed screen
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-neon-purple bg-emerald-500/10 text-emerald-400">
                  <Shield className="w-8 h-8 fill-emerald-500/20" />
                </div>
                <h3 className="text-xl font-bold text-white">SIMULATION COMPLETED SUCCESSFULLY</h3>
                <p className="text-slate-400 text-xs max-w-md">
                  {activeStep?.scenario || "All challenges resolved. Operational metrics updated in profile."}
                </p>
                <div className="text-xs text-emerald-400">
                  Awarded: <span className="font-bold text-white">+100 Career XP</span>
                </div>
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl font-sans transition-all text-xs"
                >
                  Return to Sandbox Deck
                </button>
              </div>
            ) : (
              // Active simulator step
              <div className="space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Scenario */}
                  <p className="text-slate-200 leading-relaxed text-sm">
                    {activeStep?.scenario}
                  </p>

                  {/* Feedback overlay from previous step */}
                  {feedback && (
                    <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs leading-relaxed flex gap-2">
                      <span className="text-indigo-400 font-bold font-sans">💡 Feedback:</span>
                      <span>{feedback}</span>
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-6">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2 font-sans">Options Selector:</p>
                  {activeStep?.options?.map((opt: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleDecision(opt)}
                      className="w-full text-left p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/10 hover:bg-cyan-950/30 text-cyan-300 hover:text-white transition-all text-xs flex justify-between items-center group font-mono"
                    >
                      <span>{i + 1}. {opt.text}</span>
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-sans">Execute option →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedCareer && (
              <button
                onClick={() => setSelectedCareer(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors text-[10px] font-bold font-sans"
              >
                Exit Sandbox
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
