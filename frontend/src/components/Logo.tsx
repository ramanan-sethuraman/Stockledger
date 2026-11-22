import React from 'react';

interface LogoProps {
  variant?: 'mark' | 'horizontal' | 'compact' | 'stacked';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const sizeMap = {
    sm: { mark: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { mark: 'w-10 h-10', text: 'text-lg', sub: 'text-[10px]' },
    lg: { mark: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { mark: 'w-20 h-20', text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Standalone Mark (Perfect Circle / Round Badge)
  const MarkIcon = () => (
    <div
      className={`relative ${currentSize.mark} rounded-full bg-[#0F172A] border-2 border-sky-400/40 ring-2 ring-blue-600/30 shadow-xl shadow-blue-950/50 flex items-center justify-center p-2 overflow-hidden shrink-0 group transition-all duration-300 hover:ring-sky-400/50 hover:border-sky-300`}
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/30 via-sky-500/15 to-transparent rounded-full pointer-events-none" />

      {/* Outer Subtle Concentric Orbit Ring */}
      <div className="absolute inset-1 rounded-full border border-sky-400/15 pointer-events-none" />

      {/* Isometric Vector SVG Symbol with circular disc base */}
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105">
        {/* Deep Circular Disc Background */}
        <circle cx="50" cy="50" r="48" fill="#0B132B" stroke="#38BDF8" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="44" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        <defs>
          <linearGradient id="compTop" x1="20" y1="15" x2="80" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="compLeft" x1="15" y1="40" x2="50" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="compRight" x1="50" y1="40" x2="85" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Outer Crate / Block Facets */}
        <path d="M50 16 L78 30 L50 44 L22 30 Z" fill="url(#compTop)" />
        <path d="M22 30 L50 44 L50 56 L22 42 Z" fill="url(#compLeft)" />
        <path d="M50 44 L78 30 L78 42 L50 56 Z" fill="url(#compRight)" />

        {/* Middle S-Ribbon Step */}
        <path d="M50 48 L70 58 L50 68 L30 58 Z" fill="#38BDF8" opacity="0.9" />
        <path d="M30 58 L50 68 L50 78 L30 68 Z" fill="#2563EB" />
        <path d="M50 68 L70 58 L70 68 L50 78 Z" fill="#1E3A8A" />

        {/* Lower Foundation Balance */}
        <path d="M36 72 L50 79 L64 72 L50 65 Z" fill="#93C5FD" />
        <path d="M36 72 L50 79 L50 84 L36 77 Z" fill="#1D4ED8" />
        <path d="M50 79 L64 72 L64 77 L50 84 Z" fill="#0F172A" />

        {/* Precision Highlights */}
        <path d="M22 30 L50 44 L78 30" stroke="#BAE6FD" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );

  if (variant === 'mark') {
    return <MarkIcon />;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <MarkIcon />
        <div className="mt-3">
          <div className={`font-black tracking-tight leading-none ${currentSize.text} ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            STOCK<span className="text-sky-500">LEDGER</span>
          </div>
          {showTagline && (
            <div className={`text-slate-400 font-semibold tracking-wider uppercase mt-1 ${currentSize.sub}`}>
              Every Stock · Every Transaction · Every Detail
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <MarkIcon />
      <div>
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight leading-none ${currentSize.text} ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            STOCK<span className="text-sky-500">LEDGER</span>
          </span>
          <span className="text-[9px] bg-blue-500/20 text-sky-400 font-extrabold px-1.5 py-0.5 rounded border border-blue-400/30 tracking-widest uppercase">
            ERP
          </span>
        </div>
        {showTagline && (
          <span className={`block font-semibold tracking-wide uppercase text-slate-400 mt-0.5 ${currentSize.sub}`}>
            Every Stock · Every Transaction · Every Detail
          </span>
        )}
      </div>
    </div>
  );
};
