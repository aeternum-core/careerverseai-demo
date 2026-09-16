'use client';

import React from 'react';
import ThreeGalaxy from '../../../components/ThreeGalaxy';
import GlassCard from '../../../components/GlassCard';
import { Compass, ShieldCheck, HelpCircle } from 'lucide-react';

export default function GalaxyPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Compass className="w-8 h-8 text-indigo-400" />
            3D Career Galaxy
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Navigate the interconnected galaxy of human professions.
          </p>
        </div>
      </div>

      {/* Render 3D Canvas component */}
      <ThreeGalaxy />

      {/* Galaxy Map Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="border-white/5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            How to explore
          </h3>
          <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
            <li>Left-click and hold your mouse, then drag to rotate the star systems.</li>
            <li>Use the scroll wheel or pinch to zoom in/out of specific coordinates.</li>
            <li>Hover over orbiting domain nodes to identify active career segments.</li>
            <li>Click a node to open details showing salary scopes, growth indicators and skill gaps.</li>
          </ul>
        </GlassCard>

        <GlassCard className="border-white/5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            Adaptive Navigation
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            If your browser lacks WebGL support, nodes are mapped dynamically. Target domains represent clusters of active jobs indexed from real recruitment trends.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
