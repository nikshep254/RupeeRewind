
import React, { useState, useRef } from 'react';

interface MobileStoryContainerProps {
  children: React.ReactNode[];
}

const MobileStoryContainer: React.FC<MobileStoryContainerProps> = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full relative group h-[100dvh]">
      {/* Story Progress Bars */}
      <div className="flex gap-1.5 mb-2 pt-2 px-2 shrink-0 z-20">
        {children.map((_, idx) => (
          <div key={idx} className="h-1 rounded-full flex-1 bg-zinc-800 overflow-hidden">
             <div 
               className={`h-full bg-white transition-all duration-300 ${idx === currentIndex ? 'w-full' : idx < currentIndex ? 'w-full opacity-30' : 'w-0'}`}
             />
          </div>
        ))}
      </div>
      
      {/* Scroll Snap Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-x-auto snap-x snap-mandatory flex scrollbar-hide w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children.map((child, idx) => (
          <div key={idx} className="w-full flex-shrink-0 snap-center flex flex-col h-full overflow-hidden relative p-4 pb-20">
             {/* Slide Content Wrapper - Centered */}
             <div className="flex-1 flex flex-col justify-center">
                {child}
             </div>
          </div>
        ))}
      </div>
      
      {/* Hint / Next Button Overlay */}
      {currentIndex < children.length - 1 && (
         <button 
            onClick={nextSlide}
            className="absolute bottom-6 right-4 z-50 bg-black/60 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white font-bold text-sm shadow-xl animate-pulse active:scale-95 transition-transform flex items-center gap-2"
         >
            Next ➡️
         </button>
      )}
    </div>
  );
};

export default MobileStoryContainer;
