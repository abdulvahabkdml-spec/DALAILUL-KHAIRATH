import React from 'react';

/**
 * CampusLogo Component
 * Recreates the geometric architecture of the campus logo (Image 1) 
 * but applies the smooth, premium 3D/gradient style seen in Image 2.
 */
export const CampusLogo = ({ 
  className = '', 
  width = 300, 
  height = 300, 
  showText = true,
  variant = 'default' 
}: { 
  className?: string, 
  width?: number | string, 
  height?: number | string, 
  showText?: boolean,
  variant?: 'default' | 'white' | 'gold'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <img 
        src="/main l.png" 
        alt="Dalailul Khairath Logo"
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width, 
          height: typeof height === 'number' ? `${height}px` : height,
          objectFit: 'contain'
        }}
        className="drop-shadow-2xl campus-logo-img"
      />
      {showText && (
        <div className="text-center mt-2">
          <h1 
            className="text-[#005D91] dark:text-[#E2E8F0] uppercase tracking-[0.3em] font-serif-premium font-bold"
            style={{ fontSize: typeof width === 'number' ? width * 0.1 : '1.5rem' }}
          >
            DALAILUL KHAIRATH
          </h1>
        </div>
      )}
    </div>
  );
};


