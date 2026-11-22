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
  showTagline = false,
}) => {
  const sizeMap = {
    sm: { imgH: 'h-6 sm:h-7', markSize: 'w-7 h-7 p-1', containerPad: 'px-2.5 py-1' },
    md: { imgH: 'h-8 sm:h-9', markSize: 'w-9 h-9 p-1.5', containerPad: 'px-3 py-1.5' },
    lg: { imgH: 'h-10 sm:h-11', markSize: 'w-12 h-12 p-2', containerPad: 'px-3.5 py-2' },
    xl: { imgH: 'h-13 sm:h-14', markSize: 'w-16 h-16 p-2.5', containerPad: 'px-4 py-2.5' },
  };

  const currentSize = sizeMap[size];

  // Standalone Mark (Circular emblem with authentic purple mark)
  const MarkIcon = () => (
    <div
      className={`relative ${currentSize.markSize} rounded-full bg-white border border-purple-200 shadow-md shadow-purple-950/20 flex items-center justify-center overflow-hidden shrink-0 group transition-all duration-300 hover:scale-105`}
    >
      <img
        src="/stockledger-mark.png"
        alt="Stockledger Mark"
        className="w-full h-full object-contain"
      />
    </div>
  );

  if (variant === 'mark') {
    return <MarkIcon />;
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src="/stockledger-brand-cropped.png"
          alt="Stockledger"
          className={`${currentSize.imgH} w-auto object-contain drop-shadow-sm`}
        />
        {showTagline && (
          <div className="text-slate-400 font-semibold tracking-wider uppercase mt-1 text-[10px]">
            Every Stock · Every Transaction · Every Detail
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant (default)
  if (theme === 'dark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className={`bg-white/95 hover:bg-white rounded-xl ${currentSize.containerPad} shadow-lg shadow-purple-950/20 border border-purple-100/30 backdrop-blur-md transition-all duration-200 inline-flex items-center gap-2`}>
          <img
            src="/stockledger-brand-cropped.png"
            alt="Stockledger"
            className={`${currentSize.imgH} w-auto object-contain`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/stockledger-brand-cropped.png"
        alt="Stockledger"
        className={`${currentSize.imgH} w-auto object-contain drop-shadow-sm`}
      />
    </div>
  );
};
