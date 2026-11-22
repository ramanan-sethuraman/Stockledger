import React from 'react';

interface LogoProps {
  variant?: 'mark' | 'horizontal' | 'compact' | 'stacked';
  theme?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  const sizeMap = {
    sm: { imgH: 'h-6 sm:h-7', markSize: 'w-7 h-7 p-1' },
    md: { imgH: 'h-8 sm:h-9', markSize: 'w-9 h-9 p-1.5' },
    lg: { imgH: 'h-10 sm:h-11', markSize: 'w-12 h-12 p-2' },
    xl: { imgH: 'h-13 sm:h-14', markSize: 'w-16 h-16 p-2.5' },
  };

  const currentSize = sizeMap[size];

  // Standalone Mark (Circular emblem with authentic purple mark)
  const MarkIcon = () => (
    <div
      className={`relative ${currentSize.markSize} rounded-full bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group transition-all duration-300 hover:scale-105`}
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
          className={`${currentSize.imgH} w-auto object-contain`}
        />
        {showTagline && (
          <div className="text-slate-500 font-semibold tracking-wider uppercase mt-1 text-[10px]">
            Every Stock · Every Transaction · Every Detail
          </div>
        )}
      </div>
    );
  }

  // Horizontal variant (pure crisp authentic purple logo without any surrounding container box)
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/stockledger-brand-cropped.png"
        alt="Stockledger"
        className={`${currentSize.imgH} w-auto object-contain block`}
      />
    </div>
  );
};
