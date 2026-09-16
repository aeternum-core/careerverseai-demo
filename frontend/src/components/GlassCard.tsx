import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'cyan' | 'pink' | 'none';
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', glowColor = 'none', onClick }: GlassCardProps) {
  const glowClasses = {
    purple: 'shadow-neon-purple hover:shadow-[0_0_25px_rgba(139,92,246,0.65)]',
    cyan: 'shadow-neon-cyan hover:shadow-[0_0_25px_rgba(6,182,212,0.65)]',
    pink: 'shadow-neon-pink hover:shadow-[0_0_25px_rgba(236,72,153,0.65)]',
    none: 'hover:border-white/20'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-6 rounded-2xl border border-white/10 transition-all duration-300 ${onClick ? 'cursor-pointer transform hover:-translate-y-1' : ''} ${glowClasses[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
}
