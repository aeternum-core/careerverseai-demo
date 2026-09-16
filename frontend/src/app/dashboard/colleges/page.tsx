'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { School, Search, MapPin, Award, IndianRupee } from 'lucide-react';

export default function CollegeExplorerPage() {
  const { token, apiUrl } = useStore();
  const [domain, setDomain] = useState('');
  const [maxFees, setMaxFees] = useState('10000000');
  const [location, setLocation] = useState('');
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/ai/colleges?domain=${domain}&maxFees=${maxFees}&preferredLocation=${location}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setColleges(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [domain, maxFees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <School className="w-8 h-8 text-indigo-400" />
          College Match AI
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore and filter top universities based on domain, budget constraints, and locations.
        </p>
      </div>

      {/* Filter Bar */}
      <GlassCard glowColor="purple" className="border-indigo-500/20 grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-[#090520]/80">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Target Domain</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0a2d] border border-indigo-500/30 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner cursor-pointer transition-all"
          >
            <option value="" className="bg-[#0b0726] text-slate-100 py-2">All Domains</option>
            <option value="Technology" className="bg-[#0b0726] text-slate-100 py-2">Technology</option>
            <option value="Law" className="bg-[#0b0726] text-slate-100 py-2">Law</option>
            <option value="Commerce" className="bg-[#0b0726] text-slate-100 py-2">Commerce</option>
            <option value="Arts" className="bg-[#0b0726] text-slate-100 py-2">Arts</option>
            <option value="Science" className="bg-[#0b0726] text-slate-100 py-2">Science</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Max Yearly Fees (₹)</label>
          <select
            value={maxFees}
            onChange={(e) => setMaxFees(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0a2d] border border-indigo-500/30 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner cursor-pointer transition-all"
          >
            <option value="10000000" className="bg-[#0b0726] text-slate-100 py-2">No Limit</option>
            <option value="1000000" className="bg-[#0b0726] text-slate-100 py-2">₹10,00,000</option>
            <option value="500000" className="bg-[#0b0726] text-slate-100 py-2">₹5,00,000</option>
            <option value="300000" className="bg-[#0b0726] text-slate-100 py-2">₹3,00,000</option>
            <option value="150000" className="bg-[#0b0726] text-slate-100 py-2">₹1,50,000</option>
            <option value="75000" className="bg-[#0b0726] text-slate-100 py-2">₹75,000</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Preferred Location</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-indigo-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bangalore, Karnataka"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0e0a2d] border border-indigo-500/30 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
            />
          </div>
        </div>

        <button
          onClick={fetchColleges}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs shadow-neon-purple transition-all flex items-center justify-center gap-1.5 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Search className="w-3.5 h-3.5" />
          Query Database
        </button>
      </GlassCard>

      {/* College list */}
      {loading ? (
        <div className="text-center py-20 text-indigo-400 animate-pulse text-sm">
          🔍 Scanning academic registers...
        </div>
      ) : colleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colleges.map((col, i) => (
            <GlassCard key={i} glowColor="purple" className="flex flex-col justify-between border-white/5 relative">
              <div className="absolute top-4 right-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {col.domain}
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{col.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {col.location}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-center font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Nirf Rank</span>
                    <span className="text-sm font-bold text-white flex items-center justify-center gap-0.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      #{col.ranking}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Yearly Fees</span>
                    <span className="text-sm font-bold text-white flex items-center justify-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5 text-indigo-400" />
                      {col.fees.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Placements</span>
                    <span className="text-sm font-bold text-emerald-400">{col.placementRate}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Key Facilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {col.facilities.map((fac: string, idx: number) => (
                      <span key={idx} className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-slate-300">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 text-sm">
          No matching colleges located. Try widening your budget or locations parameters.
        </div>
      )}
    </div>
  );
}
