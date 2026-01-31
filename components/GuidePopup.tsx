
import React, { useState, useEffect } from 'react';
import ZazzyPuppy from './NikiPuppy';

interface GuidePopupProps {
  onDismiss: () => void;
  title?: string;
  message?: React.ReactNode;
}

const GuidePopup: React.FC<GuidePopupProps> = ({ 
  onDismiss, 
  title = "Let's Time Travel! ⚡️", 
  message = "Select a Year and Amount above to see what happens!" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in animation
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
       <div className="relative group animate-bounce-slow">
          {/* Zazzy Peeking from Top Left - The requested pattern */}
          <div className="absolute -top-10 -left-4 z-20 transform -rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-110 duration-300">
              <ZazzyPuppy mood="excited" className="w-16 h-16 drop-shadow-md" />
          </div>

          {/* Bubble */}
          <div className="bg-white dark:bg-zinc-800 border-2 border-blue-500/20 dark:border-blue-400/20 p-5 pl-8 rounded-2xl shadow-2xl max-w-[280px] relative z-10 backdrop-blur-md">
              <button 
                 onClick={onDismiss} 
                 className="absolute -top-2 -right-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
              >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <h4 className="text-sm font-black text-zinc-900 dark:text-white mb-1">{title}</h4>
              <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {message}
              </div>
          </div>
       </div>
    </div>
  );
};

export default GuidePopup;
