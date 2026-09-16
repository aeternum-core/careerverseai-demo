'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import { GraduationCap, Percent, Calendar, ShieldCheck } from 'lucide-react';

const SCHOLARSHIP_SEEDS = [
  { name: "Reliance Foundation Scholarships", target: "Technology", incomeLimit: 800000, minMerit: 85, award: "₹2,00,000 to ₹6,00,000", deadline: "October 30, 2026", details: "For undergraduate students pursuing technology streams." },
  { name: "Kishore Vaigyanik Protsahan Yojana (KVPY)", target: "Science", incomeLimit: 9999999, minMerit: 75, award: "₹5,000 monthly stipend", deadline: "September 15, 2026", details: "NCERT fellowship for encouraging research careers in basic sciences." },
  { name: "Aditya Birla Scholarship Program", target: "Commerce", incomeLimit: 1200000, minMerit: 90, award: "₹1,50,000 yearly", deadline: "November 5, 2026", details: "For meritorious students across top engineering and management schools." },
  { name: "L\'Oreal India For Young Women in Science", target: "Science", incomeLimit: 600000, minMerit: 85, award: "₹2,50,000 for studies", deadline: "October 10, 2026", details: "Aimed at encouraging young women to opt for research careers in Science." },
  { name: "National Scholarship Portal (NSP) Merit-cum-Means", target: "General", incomeLimit: 250000, minMerit: 50, award: "Full fees reimbursement", deadline: "December 20, 2026", details: "Government assistance for professional degrees for minority candidates." }
];

export default function ScholarshipsFinderPage() {
  // Inputs
  const [income, setIncome] = useState('500000');
  const [merit, setMerit] = useState('88');
  const [career, setCareer] = useState('Technology');

  // Outputs
  const [matches, setMatches] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const incVal = parseInt(income) || 0;
    const meritVal = parseInt(merit) || 0;

    const filtered = SCHOLARSHIP_SEEDS.filter(s => {
      // General filters
      if (s.incomeLimit < incVal) return false;
      if (s.minMerit > meritVal) return false;
      return true;
    }).map(s => {
      // Calculate dynamic success probability
      const meritSurplus = meritVal - s.minMerit;
      const incomeRoom = (s.incomeLimit - incVal) / s.incomeLimit;
      const baseProb = 50 + (meritSurplus * 3) + (incomeRoom * 20);
      return {
        ...s,
        probability: Math.min(Math.round(baseProb), 98)
      };
    });

    setMatches(filtered);
    setSearched(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-indigo-400" />
          AI Scholarship Finder
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Resolve eligibility profiles against public and corporate scholarship frameworks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Form */}
        <GlassCard glowColor="purple" className="lg:col-span-2 h-fit space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Eligibility Profiles</h2>
          <form onSubmit={handleMatch} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Annual Family Income (₹)</label>
              <input
                type="number"
                required
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Academic Merit Grade (%)</label>
              <input
                type="number"
                required
                min={0}
                max={100}
                value={merit}
                onChange={(e) => setMerit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Target Career Path</label>
              <select
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0a2d] border border-indigo-500/30 text-slate-100 text-xs font-medium focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner cursor-pointer"
              >
                <option value="Technology" className="bg-[#0b0726] text-slate-100 py-2">Technology</option>
                <option value="Science" className="bg-[#0b0726] text-slate-100 py-2">Science</option>
                <option value="Commerce" className="bg-[#0b0726] text-slate-100 py-2">Commerce</option>
                <option value="Arts" className="bg-[#0b0726] text-slate-100 py-2">Arts</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-neon-purple transition-all"
            >
              Verify Eligible Frameworks
            </button>
          </form>
        </GlassCard>

        {/* Right Output */}
        <div className="lg:col-span-3 space-y-4">
          {searched ? (
            matches.length > 0 ? (
              matches.map((item, i) => (
                <GlassCard key={i} glowColor="cyan" className="p-6 border-white/5 flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-3 flex-grow">
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">{item.name}</h3>
                      <p className="text-[10px] text-indigo-300 uppercase font-mono font-bold mt-1">Stipend Grant: {item.award}</p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-md">{item.details}</p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-semibold font-mono">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline: {item.deadline}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 text-center">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Match Index</span>
                      <span className={`text-2xl font-black font-mono flex items-center justify-center gap-0.5 ${
                        item.probability > 80 ? 'text-emerald-400' : item.probability > 60 ? 'text-cyan-400' : 'text-amber-400'
                      }`}>
                        <Percent className="w-4 h-4" />
                        {item.probability}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <GlassCard className="text-center py-20 border-white/5">
                <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-slate-400">No matching frameworks found.</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Income caps are too low or merit score thresholds were unmet.</p>
              </GlassCard>
            )
          ) : (
            <GlassCard className="text-center py-20 border-white/5 flex flex-col justify-center items-center h-full">
              <GraduationCap className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-sm font-bold text-slate-400">Explore Matching Portals</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">Submit your details to query verified central and corporate fellowship records.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
