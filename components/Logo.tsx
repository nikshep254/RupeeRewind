
import React from 'react';

interface LogoProps {
  className?: string;
  disableAnimation?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-16 h-16", disableAnimation = false }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        shapeRendering="crispEdges"
        className="w-full h-full drop-shadow-lg"
      >
          {/* Shadow */}
          <rect x="8" y="29" width="16" height="2" fill="#000" fillOpacity="0.2" />

          {/* Tail (Wagging) */}
          <g className={!disableAnimation ? "origin-[26px_16px] animate-[wiggle_0.5s_infinite_alternate]" : ""}>
             <rect x="23" y="10" width="3" height="6" fill="#FDF6E3" />
             <rect x="24" y="9" width="3" height="3" fill="#E5E5E5" />
          </g>

          {/* Body */}
          <rect x="8" y="18" width="16" height="10" fill="#FDF6E3" />
          
          {/* Legs */}
          <rect x="9" y="27" width="3" height="3" fill="#D97706" />
          <rect x="20" y="27" width="3" height="3" fill="#D97706" />

          {/* Head Group - Slight bob */}
          <g className={!disableAnimation ? "animate-[bounce_2s_infinite]" : ""}>
             <rect x="6" y="6" width="18" height="14" fill="#FDF6E3" />
             
             {/* Ears */}
             <rect x="4" y="7" width="4" height="8" fill="#D97706" />
             <rect x="22" y="7" width="4" height="8" fill="#D97706" />
             
             {/* Top Knot */}
             <rect x="13" y="3" width="4" height="4" fill="#EC4899" /> 
             <rect x="12" y="5" width="6" height="2" fill="#FDF6E3" />

             {/* Eyes */}
             <rect x="10" y="11" width="3" height="3" fill="#1F2937" />
             <rect x="17" y="11" width="3" height="3" fill="#1F2937" />
             <rect x="10" y="11" width="1" height="1" fill="#FFF" />
             <rect x="17" y="11" width="1" height="1" fill="#FFF" />

             {/* Snout */}
             <rect x="12" y="15" width="6" height="4" fill="#E5E7EB" />
             <rect x="14" y="15" width="2" height="1" fill="#111827" /> 
             
             {/* Smile */}
             <rect x="14" y="17" width="2" height="2" fill="#FCA5A5" />
             
             {/* Cheeks */}
             <rect x="8" y="15" width="2" height="2" fill="#FECACA" opacity="0.5" />
             <rect x="20" y="15" width="2" height="2" fill="#FECACA" opacity="0.5" />
          </g>
       </svg>
    </div>
  );
};

export default Logo;
