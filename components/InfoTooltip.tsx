
import React, { useState, useEffect, useRef } from 'react';

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block ml-1.5 align-middle z-50">
      <button 
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
        className="focus:outline-none active:scale-95 transition-transform"
        aria-label="More info"
      >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className={`w-4 h-4 text-amber-400 transition-all duration-300 ${isOpen ? 'text-amber-300 scale-110' : 'text-amber-500'}`}
            style={{ filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.6))' }}
        >
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div 
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#1c1c1e] border border-amber-500/20 text-zinc-200 text-[10px] leading-relaxed rounded-xl shadow-2xl transition-all duration-200 text-center backdrop-blur-md z-50 origin-bottom ${
            isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
        }`}
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1c1c1e]"></div>
      </div>
    </div>
  );
};

export default InfoTooltip;
