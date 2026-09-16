'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { 
  Route, 
  Sparkles, 
  CheckSquare, 
  Printer, 
  Award, 
  Sliders, 
  TrendingUp, 
  Lock, 
  Unlock, 
  ArrowRight, 
  GitBranch, 
  CheckCircle2, 
  Calendar,
  Layers,
  Zap
} from 'lucide-react';

interface CareerPathNode {
  id: string;
  title: string;
  category: string;
  skillsRequired: string[];
  unlocked: boolean;
  salaryRange: string;
  demandTag: string;
}

const CAREER_UNLOCK_GRAPH: CareerPathNode[] = [
  {
    id: 'data-analyst',
    title: 'Data & Business Analyst',
    category: 'Analytics',
    skillsRequired: ['Python', 'SQL & Data Modeling'],
    unlocked: true,
    salaryRange: '₹8L - ₹18L / yr',
    demandTag: 'High Demand'
  },
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    category: 'Core AI',
    skillsRequired: ['Python', 'Machine Learning', 'System Design'],
    unlocked: true,
    salaryRange: '₹14L - ₹36L / yr',
    demandTag: 'Critical Demand'
  },
  {
    id: 'ai-architect',
    title: 'Autonomous Systems Architect',
    category: 'Frontier AI',
    skillsRequired: ['Machine Learning', 'Cloud & MLOps', 'System Design'],
    unlocked: false,
    salaryRange: '₹28L - ₹65L / yr',
    demandTag: 'High Scarcity'
  },
  {
    id: 'product-analyst',
    title: 'Product Growth Analyst',
    category: 'Product',
    skillsRequired: ['SQL & Data Modeling', 'Communication & Pitch'],
    unlocked: true,
    salaryRange: '₹10L - ₹24L / yr',
    demandTag: 'High Demand'
  },
  {
    id: 'mlops-lead',
    title: 'Enterprise MLOps Lead',
    category: 'DevOps & AI',
    skillsRequired: ['Cloud & MLOps', 'System Design', 'Python'],
    unlocked: false,
    salaryRange: '₹22L - ₹48L / yr',
    demandTag: 'Extreme Growth (+110%)'
  }
];

export default function RoadmapPage() {
  const { token, apiUrl, careerTwin, setCareerTwin, awardXP } = useStore();
  const [activeTab, setActiveTab] = useState<'graph' | 'whatif' | 'milestones'>('graph');

  // What-If Sliders State
  const [projectsDelta, setProjectsDelta] = useState(1);
  const [internshipsDelta, setInternshipsDelta] = useState(1);
  const [skillDelta, setSkillDelta] = useState(10);
  const [whatIfData, setWhatIfData] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Standard Roadmap Milestones
  const [career, setCareer] = useState('Technology');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load baseline what-if projection
  const runWhatIfSimulation = async (proj: number, intern: number, skill: number) => {
    setIsSimulating(true);
    try {
      const res = await fetch(`${apiUrl}/api/student/what-if`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectsDelta: proj,
          internshipsDelta: intern,
          verifiedSkillDelta: skill
        })
      });
      if (res.ok) {
        const data = await res.json();
        setWhatIfData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (token) {
      runWhatIfSimulation(projectsDelta, internshipsDelta, skillDelta);
    }
  }, [token]);

  const handleSliderChange = (type: 'proj' | 'intern' | 'skill', val: number) => {
    let p = projectsDelta;
    let i = internshipsDelta;
    let s = skillDelta;

    if (type === 'proj') { p = val; setProjectsDelta(val); }
    if (type === 'intern') { i = val; setInternshipsDelta(val); }
    if (type === 'skill') { s = val; setSkillDelta(val); }

    runWhatIfSimulation(p, i, s);
  };

  return (
    <div className="space-y-8 print:p-0">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              CAREER INTELLIGENCE GRAPH
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Dynamic Path Graph & Career Trajectory
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Visualize how acquiring foundational skill clusters unlocks high-growth career nodes and simulate your readiness trajectory.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0b0625] p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'graph'
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-neon-purple'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Career Unlocks Graph
          </button>
          
          <button
            onClick={() => setActiveTab('whatif')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'whatif'
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-neon-purple'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            What-If Simulator
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'milestones'
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-neon-purple'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Milestone Steps
          </button>
        </div>
      </div>

      {/* TAB 1: CAREER UNLOCKS GRAPH */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          <GlassCard glowColor="purple" className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Unlock className="w-5 h-5 text-indigo-400" />
                  Skill-to-Career Unlock Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your verified skill combinations unlock progressive professional paths across the career cosmos.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-500/30">
                3 of 5 Paths Unlocked
              </span>
            </div>

            {/* Visual Graph Architecture Tree */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAREER_UNLOCK_GRAPH.map((node) => (
                <div
                  key={node.id}
                  className={`p-5 rounded-3xl border transition-all space-y-4 ${
                    node.unlocked
                      ? 'bg-gradient-to-br from-[#110834] to-[#08031d] border-indigo-500/50 shadow-neon-purple'
                      : 'bg-black/40 border-white/10 opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest block font-bold">
                        {node.category}
                      </span>
                      <h3 className="text-base font-black text-white">{node.title}</h3>
                    </div>
                    {node.unlocked ? (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3 text-emerald-400" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" /> Locked
                      </span>
                    )}
                  </div>

                  {/* Required Skill Nodes */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      Required Skill Unlock Cluster:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {node.skillsRequired.map((skill, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-white/5 text-slate-200 border border-white/10 px-2 py-0.5 rounded-lg flex items-center gap-1 font-mono"
                        >
                          <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Compensation and Demand */}
                  <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-white/10">
                    <span className="text-slate-300 font-bold">{node.salaryRange}</span>
                    <span className="text-cyan-400">{node.demandTag}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 2: WHAT-IF CAREER TRAJECTORY SIMULATOR */}
      {activeTab === 'whatif' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Sliders */}
          <GlassCard glowColor="purple" className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 block">
                Interactive Career Modeling
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Variable Controls
              </h3>
            </div>

            {/* Slider 1: Projects */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Additional Applied Projects</span>
                <span className="text-indigo-400 font-bold">+{projectsDelta} Projects</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={projectsDelta}
                onChange={(e) => handleSliderChange('proj', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">Impact: ~3.5% CRI boost per project</span>
            </div>

            {/* Slider 2: Internships */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Additional Internships</span>
                <span className="text-cyan-400 font-bold">+{internshipsDelta} Internships</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={internshipsDelta}
                onChange={(e) => handleSliderChange('intern', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">Impact: ~6.5% CRI boost per internship</span>
            </div>

            {/* Slider 3: Verified Skill Score Lift */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Target Skill Proficiency Lift</span>
                <span className="text-emerald-400 font-bold">+{skillDelta}% Verified</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={skillDelta}
                onChange={(e) => handleSliderChange('skill', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono block">Impact: Closes key algorithmic gaps</span>
            </div>
          </GlassCard>

          {/* Projection Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard glowColor="purple" className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                    Dynamic Trajectory Analysis
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Projected Employability Horizon
                  </h3>
                </div>

                {whatIfData && (
                  <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-mono text-xs text-emerald-300 font-bold">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    +{whatIfData.deltaGain}% Readiness Gain
                  </div>
                )}
              </div>

              {/* Trajectory Cards */}
              {whatIfData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">TODAY</span>
                    <span className="text-xl font-black text-white font-mono">{whatIfData.trajectory.today}%</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Current Base</span>
                  </div>

                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase block">IN 6 MONTHS</span>
                    <span className="text-xl font-black text-indigo-300 font-mono">{whatIfData.trajectory.sixMonths}%</span>
                    <span className="text-[10px] text-emerald-400 block font-mono">With +{projectsDelta} Proj</span>
                  </div>

                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase block">IN 1 YEAR</span>
                    <span className="text-xl font-black text-cyan-300 font-mono">{whatIfData.trajectory.oneYear}%</span>
                    <span className="text-[10px] text-emerald-400 block font-mono">With +{internshipsDelta} Intern</span>
                  </div>

                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase block">IN 3 YEARS</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">{whatIfData.trajectory.threeYears}%</span>
                    <span className="text-[10px] text-emerald-400 block font-mono">Target Mastered</span>
                  </div>
                </div>
              )}

              {/* Dynamically Unlocked Roles */}
              {whatIfData && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-xs font-mono uppercase text-indigo-300 font-bold block flex items-center gap-1.5">
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    Roles Unlocked Under This What-If Strategy:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {whatIfData.unlockedCareers.map((role: string, i: number) => (
                      <span key={i} className="text-xs font-bold text-white bg-indigo-950/70 border border-indigo-500/40 px-3 py-1.5 rounded-xl shadow-neon-purple flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 3: STEP-BY-STEP MILESTONES */}
      {activeTab === 'milestones' && (
        <GlassCard glowColor="purple" className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Year-by-Year Career Roadmap
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting Machine Learning & Intelligent Autonomous Systems
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Roadmap
            </button>
          </div>

          <div className="space-y-6">
            {/* Year 1 */}
            <div className="p-5 rounded-2xl bg-black/40 border border-indigo-500/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">YEAR 1: FOUNDATION</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">In Progress</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Master Python, linear algebra, vector calculus, and object-oriented architectures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Build 2 applied predictive models using PyTorch & Scikit-Learn on public datasets.</span>
                </li>
              </ul>
            </div>

            {/* Year 3 */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">YEAR 3: ENTERPRISE DEPLOYMENT & MLOPs</span>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full border border-slate-500 text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Containerize deep neural networks using Docker and orchestrate on Kubernetes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full border border-slate-500 text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>Complete an applied Machine Learning / Data Engineering internship.</span>
                </li>
              </ul>
            </div>

            {/* Year 5 */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">YEAR 5: ARCHITECTURE LEADERSHIP</span>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full border border-slate-500 text-[10px] flex items-center justify-center shrink-0 mt-0.5">5</span>
                  <span>Direct foundational model fine-tuning and lead multi-agent autonomous engineering squads.</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
