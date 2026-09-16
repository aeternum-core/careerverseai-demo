'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { 
  Terminal, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SimulationScenario {
  id: string;
  careerTitle: string;
  domain: string;
  context: string;
  situation: string;
  options: {
    key: 'A' | 'B' | 'C';
    title: string;
    description: string;
    behaviorTag: string;
    signals: string[];
    feedback: string;
  }[];
}

const BEHAVIORAL_SCENARIOS: SimulationScenario[] = [
  {
    id: 'swe-prod-bug',
    careerTitle: 'Software Engineering & AI Systems',
    domain: 'Technology',
    context: 'Black Friday Peak Traffic: 2.4M Concurrent Users',
    situation: 'A critical memory leak is causing checkout service latencies to spike to 4,200ms. 3% of transactions are failing. Executive leadership demands immediate resolution.',
    options: [
      {
        key: 'A',
        title: 'Deploy Hotfix Patch Directly to Production',
        description: 'Bypass the full regression test suite to ship an inline patch that restarts the leaking worker processes every 5 minutes.',
        behaviorTag: 'High Decisiveness & Speed',
        signals: ['+2% Leadership', '+2% Operational Decisiveness', '-1% Quality Orientation'],
        feedback: 'You restored transaction throughput in 90 seconds, but introduced technical debt that required post-incident cleanup.'
      },
      {
        key: 'B',
        title: 'Initiate Full Cluster Rollback to Previous Stable Release',
        description: 'Roll back to the previous deployment artifact immediately and route traffic away from the affected nodes.',
        behaviorTag: 'Risk Aversion & System Safety',
        signals: ['+3% Risk Management', '+1% Adaptability'],
        feedback: 'You minimized catastrophic revenue risk with disciplined operational protocol, trading off new feature availability.'
      },
      {
        key: 'C',
        title: 'Isolate Root-Cause via Memory Profiler & Canary Deploy',
        description: 'Deploy an isolated canary pod with heap inspection tools to capture the exact leaking pointer before cutting over a verified fix.',
        behaviorTag: 'Deep Root-Cause & Analytical Rigor',
        signals: ['+3% Analytical Thinking', '+3% Quality Orientation', '+1% Risk Management'],
        feedback: 'You identified a circular reference in the caching layer. The root cause was permanently resolved with zero regression.'
      }
    ]
  },
  {
    id: 'ai-bias-ethics',
    careerTitle: 'AI Ethics & Machine Learning Research',
    domain: 'Science & AI',
    context: 'Loan Approval Foundation Model Audit',
    situation: 'Pre-launch validation indicates your deep neural credit model scores applicants from underrepresented demographic regions 14% lower due to historical training bias.',
    options: [
      {
        key: 'A',
        title: 'Apply Post-Processing Threshold Adjustments',
        description: 'Calibrate the decision boundary threshold mathematically per demographic bracket without retraining the core weights.',
        behaviorTag: 'Pragmatic Engineering',
        signals: ['+2% Speed', '+1% Analytical Thinking'],
        feedback: 'You balanced legal compliance with delivery schedules, though underlying feature dependencies remained skewed.'
      },
      {
        key: 'B',
        title: 'Halt Deployment & Retrain with Synthetic Fair-Sampling',
        description: 'Block product launch, commission a 2-week adversarial debiasing pipeline, and present the risk dossier to stakeholders.',
        behaviorTag: 'Ethical Integrity & Rigorous Quality',
        signals: ['+4% Quality Orientation', '+3% Ethical Reasoning', '+2% Risk Management'],
        feedback: 'Stakeholders respected your principled engineering standard. The retrained model achieved state-of-the-art fairness certification.'
      },
      {
        key: 'C',
        title: 'Deploy with Human-in-the-Loop Review Tier',
        description: 'Release model with autonomous approval only for high-confidence non-marginal scores, routing flagged cases to human reviewers.',
        behaviorTag: 'Adaptive Systems Architecture',
        signals: ['+3% Adaptability', '+2% Leadership', '+2% Risk Management'],
        feedback: 'An exemplary hybrid deployment strategy that shielded the organization from reputational damage while maintaining velocity.'
      }
    ]
  },
  {
    id: 'fintech-arbitrage',
    careerTitle: 'Quantitative Trading & FinTech',
    domain: 'Commerce',
    context: 'High-Frequency Arbitrage Anomaly',
    situation: 'Your stochastic model detects an uncharacteristic 45-millisecond latency discrepancy between Tokyo and London derivatives order books. Potential profit is ₹45L, but capital exposure risk is high.',
    options: [
      {
        key: 'A',
        title: 'Execute Full Automated Capital Position',
        description: 'Authorize the algorithmic execution engine to seize the spread before competing hedge funds react.',
        behaviorTag: 'High Risk Appetite & Aggressive Capital Capture',
        signals: ['+4% Risk Taking', '+2% Decisiveness'],
        feedback: 'You generated ₹42L in alpha profit, but triggered internal risk management warning thresholds for peak drawdown.'
      },
      {
        key: 'B',
        title: 'Execute 25% Fractional Probe Position',
        description: 'Allocate a fraction of available liquidity to confirm the arbitrage spread is not a phantom liquidity spoof.',
        behaviorTag: 'Calculated Risk & Quantitative Prudence',
        signals: ['+3% Risk Management', '+2% Analytical Thinking'],
        feedback: 'Smart execution strategy. The probe confirmed genuine market depth, allowing a calculated scale-in.'
      },
      {
        key: 'C',
        title: 'Hold Execution & Audit Cross-Exchange Clock Drift',
        description: 'Pause trade execution to verify if GPS time-synchronization on the London node has drifted by microseconds.',
        behaviorTag: 'Deep Analytical Precision',
        signals: ['+4% Analytical Thinking', '+3% Quality Orientation'],
        feedback: 'Incredible catch! The discrepancy was caused by clock jitter, not real arbitrage. You prevented a potential ₹80L loss.'
      }
    ]
  }
];

export default function SimulatorPage() {
  const router = useRouter();
  const { token, apiUrl, careerTwin, setCareerTwin, awardXP } = useStore();

  const [activeScenario, setActiveScenario] = useState<SimulationScenario>(BEHAVIORAL_SCENARIOS[0]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [latencySeconds, setLatencySeconds] = useState<number>(0);
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);
  const [behaviorDeltas, setBehaviorDeltas] = useState<Record<string, number> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Reset timer on scenario change
  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOption(null);
    setDecisionFeedback(null);
    setBehaviorDeltas(null);
  }, [activeScenario]);

  const handleSelectChoice = async (option: any) => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setLatencySeconds(elapsed);
    setSelectedOption(option);
    setIsProcessing(true);

    try {
      const res = await fetch(`${apiUrl}/api/student/simulation/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: activeScenario.id,
          title: activeScenario.careerTitle,
          choice: option.key,
          choiceText: option.title,
          latencySeconds: elapsed
        })
      });

      if (res.ok) {
        const data = await res.json();
        setDecisionFeedback(data.feedbackMessage);
        setBehaviorDeltas(data.behaviorDeltas);
        if (data.twin) {
          setCareerTwin(data.twin);
        }
        awardXP(60, 'Simulation Strategist');
      }
    } catch (err) {
      console.error('Failed to submit simulation decision:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextScenario = () => {
    if (scenarioIndex < BEHAVIORAL_SCENARIOS.length - 1) {
      const nextIdx = scenarioIndex + 1;
      setScenarioIndex(nextIdx);
      setActiveScenario(BEHAVIORAL_SCENARIOS[nextIdx]);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setScenarioIndex(0);
    setActiveScenario(BEHAVIORAL_SCENARIOS[0]);
    setIsFinished(false);
    setSelectedOption(null);
    setDecisionFeedback(null);
    setBehaviorDeltas(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              BEHAVIORAL ASSESSMENT SIMULATOR
            </span>
            <span className="text-xs text-slate-400 font-mono">Scenario {scenarioIndex + 1} of {BEHAVIORAL_SCENARIOS.length}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Real-World Decision Laboratory
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Measure your operational judgment, analytical rigor, and risk tolerance under real high-stakes scenarios.
          </p>
        </div>

        {careerTwin && (
          <div className="flex items-center gap-3 bg-[#0a0522] border border-indigo-500/30 px-4 py-2 rounded-2xl shadow-neon-purple">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Twin Career Fit</span>
              <span className="text-xs font-black text-white font-mono">{careerTwin.careerFit[0]?.role} ({careerTwin.careerFit[0]?.score}%)</span>
            </div>
          </div>
        )}
      </div>

      {!isFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Scenario Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard glowColor="purple" className="space-y-6 relative overflow-hidden">
              <div className="border-b border-white/10 pb-4 flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                    {activeScenario.domain} • {activeScenario.careerTitle}
                  </span>
                  <h2 className="text-xl font-black text-white mt-1">
                    {activeScenario.context}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1 rounded-xl border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Timer Active</span>
                </div>
              </div>

              {/* Problem Brief */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                  INCIDENT REPORT / CRISIS DILEMMA:
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {activeScenario.situation}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Select Your Operational Strategy:
                </span>

                {activeScenario.options.map((opt) => {
                  const isSelected = selectedOption?.key === opt.key;
                  return (
                    <button
                      key={opt.key}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectChoice(opt)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-500 shadow-neon-purple'
                          : selectedOption !== null
                          ? 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                          : 'bg-black/40 border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold font-mono text-sm shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'
                        }`}>
                          {opt.key}
                        </span>
                        <div className="space-y-1">
                          <span className="text-sm font-bold text-white block">{opt.title}</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                          <span className="inline-block mt-1 text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                            Strategy: {opt.behaviorTag}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* FEEDBACK DRAWER AFTER CHOICE */}
              {selectedOption && (
                <div className="p-5 rounded-2xl bg-[#090520] border border-emerald-500/40 space-y-4 animate-in fade-in duration-300 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      Behavioral Signal Recorded (Time: {latencySeconds}s)
                    </div>
                    <span className="text-xs font-mono text-indigo-300 bg-indigo-950/70 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                      Career Twin Updated
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedOption.feedback}
                  </p>

                  {/* Signals Applied */}
                  <div className="flex flex-wrap gap-2">
                    {selectedOption.signals.map((sig: string, i: number) => (
                      <span key={i} className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        {sig}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextScenario}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-neon-purple transition-all flex items-center gap-1.5"
                    >
                      <span>Proceed to Next Dilemma</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Right Sidebar: Live Behavioral Intelligence Profile */}
          <div className="space-y-6">
            <GlassCard glowColor="purple" className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 block">
                  Adaptive Feedback Loop
                </span>
                <h3 className="text-base font-black text-white flex items-center gap-2 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Your Behavioral Profile
                </h3>
              </div>

              {careerTwin && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Analytical Thinking</span>
                      <span className="text-indigo-400 font-bold">{careerTwin.behavior.analyticalThinking}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${careerTwin.behavior.analyticalThinking}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Risk Management</span>
                      <span className="text-cyan-400 font-bold">{careerTwin.behavior.riskManagement}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${careerTwin.behavior.riskManagement}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Quality Orientation</span>
                      <span className="text-emerald-400 font-bold">{careerTwin.behavior.qualityOrientation}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${careerTwin.behavior.qualityOrientation}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Leadership & Decisiveness</span>
                      <span className="text-amber-400 font-bold">{careerTwin.behavior.leadership}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${careerTwin.behavior.leadership}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">Adaptability</span>
                      <span className="text-pink-400 font-bold">{careerTwin.behavior.adaptability}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-pink-400 h-full rounded-full" style={{ width: `${careerTwin.behavior.adaptability}%` }} />
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                💡 Every simulation measures judgment nuances, not just memorized knowledge. These traits refine your Career Readiness Index in real-time.
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        /* Final Completion Summary */
        <GlassCard glowColor="purple" className="text-center p-8 space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-neon-purple animate-bounce">
            <Award className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Behavioral Assessment Completed!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your decisions across critical operational dilemmas have been ingested into your Career Twin. Your Readiness Index and Career Alignments have been recalibrated.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-90 text-white rounded-2xl text-xs font-bold shadow-neon-purple transition-all"
            >
              View Updated Career Twin Dashboard
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-2xl text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Simulation
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
