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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white select-none cursor-pointer transition-all duration-700 ease-out ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/60 via-white to-white pointer-events-none" />

      {/* Skip Button in Top Right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleFinish();
        }}
        className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-purple-600 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm group cursor-pointer"
        title="Skip intro"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Centered Video / Logo Container */}
      <div className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center">
        <div className="relative overflow-hidden bg-white flex items-center justify-center">
          <video
            ref={videoRef}
            src="/SL_Logo.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleFinish}
            className="w-full h-auto max-h-[60vh] object-contain block bg-white"
          />
        </div>

        {/* Brand Caption & Status */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs uppercase tracking-widest text-purple-700 font-extrabold">
            Stockledger Enterprise ERP
          </p>
          <p className="text-xs text-slate-600 font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            Initializing Production & Stock Ledger Modules...
          </p>
          <div className="w-48 h-1 bg-purple-100 rounded-full mx-auto overflow-hidden mt-3">
            <div className="h-full bg-purple-600 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
