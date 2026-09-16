'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { ShieldCheck, Plus, Settings, AlertTriangle, FileText, Check } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboardPage() {
  const { token, apiUrl } = useStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add College Form States
  const [colName, setColName] = useState('');
  const [colDomain, setColDomain] = useState('Technology');
  const [colRank, setColRank] = useState('12');
  const [colFees, setColFees] = useState('180000');
  const [colLocation, setColLocation] = useState('Hyderabad');
  const [colPlacement, setColPlacement] = useState('85');
  const [success, setSuccess] = useState(false);

  async function loadAnalytics() {
    try {
      const res = await fetch(`${apiUrl}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, [token, apiUrl]);

  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    try {
      const res = await fetch(`${apiUrl}/api/admin/colleges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: colName,
          domain: colDomain,
          ranking: parseInt(colRank) || 10,
          fees: parseInt(colFees) || 100000,
          placementRate: parseInt(colPlacement) || 80,
          location: colLocation,
          facilities: ["AI Laboratories", "Libraries", "Computing Wing"]
        })
      });
      if (res.ok) {
        setSuccess(true);
        setColName('');
        // Reload analytics
        loadAnalytics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#06b6d4', '#ec4899', '#eab308'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-rose-500 animate-pulse" />
          System Administrator Central
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor user statistics registries, update chatbot presets, and add academic colleges.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-indigo-400 animate-pulse text-sm">
          📂 Syncing system telemetry and configuration logs...
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Key Analytics overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Registrations", value: analytics?.totalUsers || 24 },
              { label: "Appointments Logged", value: analytics?.totalAppointments || 6 },
              { label: "Accumulated Student XP", value: `${(analytics?.accumulatedXP || 450).toLocaleString()} XP` },
              { label: "Active Streaks (>1 day)", value: analytics?.activeStreaks || 3 }
            ].map((widget, i) => (
              <GlassCard key={i} className="border-white/5 py-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{widget.label}</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">{widget.value}</span>
              </GlassCard>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Registration Trend Area Chart */}
            <GlassCard glowColor="purple" className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                Registrations Acceleration Index (Monthly)
              </h3>
              <div className="w-full h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.registrationsTrend || []}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#475569" fontSize={11} />
                    <YAxis stroke="#475569" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0b0726', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Career Distribution Pie Chart */}
            <GlassCard glowColor="cyan" className="lg:col-span-2 space-y-4 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-cyan-400" />
                Trajectory Domain Distribution (%)
              </h3>
              <div className="w-full h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.domainDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(analytics?.domainDistribution || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0b0726', border: '1px solid rgba(255,255,255,0.08)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center text-[10px]">
                {(analytics?.domainDistribution || []).map((entry: any, index: number) => (
                  <span key={index} className="flex items-center gap-1 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {entry.name}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Settings & Add College Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add College Form */}
            <GlassCard className="border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Index New College/University
              </h3>

              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  College database index successfully registered!
                </div>
              )}

              <form onSubmit={handleAddCollege} className="grid grid-cols-2 gap-4 text-xs">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-slate-300 font-semibold">College/University Name</label>
                  <input
                    type="text"
                    required
                    value={colName}
                    onChange={(e) => setColName(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Study Domain</label>
                  <select
                    value={colDomain}
                    onChange={(e) => setColDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0a2d] border border-indigo-500/30 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner cursor-pointer"
                  >
                    <option value="Technology" className="bg-[#0b0726] text-slate-100 py-2">Technology</option>
                    <option value="Law" className="bg-[#0b0726] text-slate-100 py-2">Law</option>
                    <option value="Commerce" className="bg-[#0b0726] text-slate-100 py-2">Commerce</option>
                    <option value="Science" className="bg-[#0b0726] text-slate-100 py-2">Science</option>
                    <option value="Arts" className="bg-[#0b0726] text-slate-100 py-2">Arts</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">National NIRF Rank</label>
                  <input
                    type="number"
                    required
                    value={colRank}
                    onChange={(e) => setColRank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Yearly Fees (₹)</label>
                  <input
                    type="number"
                    required
                    value={colFees}
                    onChange={(e) => setColFees(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Campus Placement Rate (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={colPlacement}
                    onChange={(e) => setColPlacement(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-slate-300 font-semibold">Campus Location</label>
                  <input
                    type="text"
                    required
                    value={colLocation}
                    onChange={(e) => setColLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="col-span-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-neon-purple mt-2"
                >
                  Commit College to Registry
                </button>
              </form>
            </GlassCard>

            {/* Quick settings warning */}
            <GlassCard className="border-white/5 space-y-4 h-fit">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Prompt Configuration Notes
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The AI Core counselor runs in **Hybrid Fallback** mode. It dynamically scans the environment for `OPENAI_API_KEY`. If undefined, it generates high-fidelity local templates for resumes, roadmaps, and psychometrics.
              </p>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold rounded-lg flex items-center gap-1.5">
                Current status: local mock counselor engine (active)
              </div>
            </GlassCard>
          </div>

        </div>
      )}
    </div>
  );
}
