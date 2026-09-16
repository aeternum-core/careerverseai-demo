'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  symbol?: string;
  pulsePhase: number;
  pulseSpeed: number;
}

const EDUCATIONAL_GLYPHS = ['🎓', '⚛️', '🧠', '</>', '📖', '🧬', '🪐', '∑', '💡', '🔭'];
const PALETTE = [
  { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)' }, // Electric Cyan
  { color: '#818cf8', glow: 'rgba(129, 140, 248, 0.45)' }, // Cosmic Indigo
  { color: '#c084fc', glow: 'rgba(192, 132, 252, 0.4)' }, // Neon Violet
  { color: '#34d399', glow: 'rgba(52, 211, 153, 0.35)' }, // Emerald
  { color: '#f472b6', glow: 'rgba(244, 114, 182, 0.35)' }  // Cyber Pink
];

export default function EducationalCosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse / Touchpad tracking
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseleave', handlePointerLeave);

    // Create knowledge particles
    const particleCount = Math.min(80, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const paletteChoice = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const hasGlyph = i < 18; // First 18 particles display academic glyphs

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: hasGlyph ? 8 : 1.5 + Math.random() * 2,
        color: paletteChoice.color,
        glowColor: paletteChoice.glow,
        symbol: hasGlyph ? EDUCATIONAL_GLYPHS[i % EDUCATIONAL_GLYPHS.length] : undefined,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02
      });
    }

    // Main 60FPS Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // 1. Draw Constellation Network Filaments
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect with Mouse/Touchpad Cursor
        if (mouseX !== null && mouseY !== null) {
          const mdx = p1.x - mouseX;
          const mdy = p1.y - mouseY;
          const mDist = Math.hypot(mdx, mdy);

          if (mDist < 160) {
            const mAlpha = (1 - mDist / 160) * 0.45;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();

            // Subtle magnetic pull
            p1.x -= (mdx / mDist) * 0.3;
            p1.y -= (mdy / mDist) * 0.3;
          }
        }
      }

      // 2. Draw Knowledge Particles & Academic Glyphs
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.pulsePhase += p.pulseSpeed;
        const pulse = 1 + Math.sin(p.pulsePhase) * 0.25;

        if (p.symbol) {
          // Floating Education Glyph Node
          ctx.save();
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.glowColor;

          // Glowing circular backing
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(12, 6, 38, 0.65)';
          ctx.fill();
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Academic Glyph icon
          ctx.font = '11px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.symbol, p.x, p.y);
          ctx.restore();
        } else {
          // Constellation Energy Star
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.glowColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Ambient Aurora Glow Orbs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-cyan-600/15 rounded-full blur-[140px] animate-pulse duration-[10000ms]" />
      <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-purple-600/15 rounded-full blur-[160px] animate-pulse duration-[12000ms]" />

      {/* Interactive Constellation Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-85"
      />
    </div>
  );
}
