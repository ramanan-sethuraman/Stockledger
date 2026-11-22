import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
}) => {
  const { toggleTheme, isDark } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`h-9 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer shrink-0 whitespace-nowrap ${
          isDark
            ? 'bg-purple-950/80 border-purple-800 text-amber-300 hover:bg-purple-900 shadow-sm'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-sm'
        } ${className}`}
        title={isDark ? 'Switch to Light Mode (Sun)' : 'Switch to Dark Mode (Moon)'}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 rotate-0 hover:rotate-45 transition-transform duration-300" />
            <span className="text-[11px]">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-purple-600 hover:-rotate-12 transition-transform duration-300" />
            <span className="text-[11px]">Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`h-9 w-9 p-2 rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer group shrink-0 ${
        isDark
          ? 'bg-[#180E2E] border-purple-800/80 text-amber-400 hover:text-amber-300 hover:bg-purple-900/60 shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:text-purple-600 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 group-hover:text-purple-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
};
