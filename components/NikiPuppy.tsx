
import React from 'react';

interface ZazzyPuppyProps {
  className?: string;
  mood?: 'happy' | 'curious' | 'excited';
}

const ZazzyPuppy: React.FC<ZazzyPuppyProps> = ({ className = "w-32 h-32", mood = 'happy' }) => {
  return (
    <div className={`${className} relative animate-bounce`} style={{ animationDuration: '2s' }}>
       {/* Pixel Art SVG for Zazzy - The Shih Tzu */}
       <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
          {/* Shadow */}
          <rect x="8" y="29" width="16" height="2" fill="#000" fillOpacity="0.2" />

          {/* Tail (Wagging position) */}
          <rect x="23" y="10" width="3" height="6" fill="#FDF6E3" />
          <rect x="24" y="9" width="3" height="3" fill="#E5E5E5" />

          {/* Body */}
          <rect x="8" y="18" width="16" height="10" fill="#FDF6E3" />
          {/* Legs */}
          <rect x="9" y="27" width="3" height="3" fill="#D97706" />
          <rect x="20" y="27" width="3" height="3" fill="#D97706" />

          {/* Head Base */}
          <rect x="6" y="6" width="18" height="14" fill="#FDF6E3" />
          
          {/* Ears (Gold/Brown) */}
          <rect x="4" y="7" width="4" height="8" fill="#D97706" /> {/* Left Ear */}
          <rect x="22" y="7" width="4" height="8" fill="#D97706" /> {/* Right Ear */}
          
          {/* Top Knot / Ribbon */}
          <rect x="13" y="3" width="4" height="4" fill="#3b82f6" /> {/* Blue Ribbon for Zazzy */}
          <rect x="12" y="5" width="6" height="2" fill="#FDF6E3" />

          {/* Eyes */}
          <rect x="10" y="11" width="3" height="3" fill="#1F2937" />
          <rect x="17" y="11" width="3" height="3" fill="#1F2937" />
          {/* Eye sparkle */}
          <rect x="10" y="11" width="1" height="1" fill="#FFF" />
          <rect x="17" y="11" width="1" height="1" fill="#FFF" />

          {/* Snout Area */}
          <rect x="12" y="15" width="6" height="4" fill="#E5E7EB" />
          <rect x="14" y="15" width="2" height="1" fill="#111827" /> {/* Nose */}
          
          {/* Mouth/Tongue */}
          {mood === 'excited' ? (
             <rect x="14" y="17" width="2" height="3" fill="#FCA5A5" /> 
          ) : (
             <rect x="13" y="17" width="4" height="1" fill="#9CA3AF" />
          )}

          {/* Cheeks */}
          <rect x="8" y="15" width="2" height="2" fill="#FECACA" opacity="0.5" />
          <rect x="20" y="15" width="2" height="2" fill="#FECACA" opacity="0.5" />
       </svg>
    </div>
  );
};

export default ZazzyPuppy;
