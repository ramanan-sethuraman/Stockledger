import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface VideoSplashScreenProps {
  onComplete: () => void;
}

export const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Fallback if autoplay is restricted
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    // Safety fallback timer (video is ~3.65s)
    const timer = setTimeout(() => {
      handleFinish();
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070C18] select-none cursor-pointer transition-all duration-700 ease-out ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-violet-600/15 to-transparent pointer-events-none" />

      {/* Skip Button in Top Right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleFinish();
        }}
        className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg group cursor-pointer"
        title="Skip intro"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Centered Video Container */}
      <div className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-950/50 border border-purple-500/30 bg-black">
          <video
            ref={videoRef}
            src="/SL_Logo.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleFinish}
            className="w-full h-auto max-h-[70vh] object-contain block"
          />
        </div>

        {/* Brand Caption & Status */}
        <div className="mt-6 text-center space-y-1.5">
          <p className="text-xs uppercase tracking-widest text-purple-400 font-extrabold">
            Stockledger Enterprise ERP
          </p>
          <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            Initializing Production & Stock Ledger Modules...
          </p>
        </div>
      </div>
    </div>
  );
};
