
import React, { useEffect, useState } from 'react';
import ZazzyPuppy from './NikiPuppy';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 backdrop-blur-sm' : 'opacity-0 backdrop-blur-none pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/80 transition-opacity" onClick={onClose}></div>
      
      <div className={`bg-[#09090b] border border-white/10 w-full max-w-sm rounded-[2rem] shadow-2xl p-8 relative overflow-hidden transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-8 opacity-0'}`}>
        
        {/* Ambient Glow */}
        <div className="absolute top-[-50%] right-[-50%] w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/10 z-20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center relative z-10">
          
          <div className="mb-6 transform hover:scale-110 transition-transform duration-500 cursor-pointer">
             <ZazzyPuppy mood="happy" className="w-24 h-24" />
          </div>

          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
            RupeeRewind
          </h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed px-2 font-medium">
            Helping India visualize the true value of money. <br/>
            <span className="text-blue-500/80 italic text-xs">Guided by Zazzy 🐾</span>
          </p>

          {/* Concept Card */}
          <div className="group w-full bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-white/5 hover:border-amber-500/30 hover:bg-zinc-900/50 transition-all duration-500 mb-4 overflow-hidden relative">
            
            <div className="relative p-4 flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                 <span className="text-2xl">👨‍💻</span>
               </div>
               <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest block mb-0.5">Concept by</span>
                  <h3 className="text-zinc-200 font-bold text-sm group-hover:text-white transition-colors">Nikshep Doggalli</h3>
                  <p className="text-zinc-500 text-[10px]">(Zazzy's Human)</p>
               </div>
            </div>
          </div>

          <a 
            href="https://instagram.com/nikkk.exe" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full group bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 rounded-xl py-4 px-6 flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <span className="text-zinc-300 font-medium text-xs group-hover:text-white transition-colors">Connect on Instagram</span>
          </a>

        </div>
      </div>
    </div>
  );
};

export default AboutModal;
