
import React from 'react';
import ZazzyPuppy from './NikiPuppy';

const AboutCard: React.FC = () => {
  return (
    <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-lg transition-colors duration-300 mt-8">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-50%] right-[-50%] w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          <div className="transform group-hover:scale-105 transition-transform duration-500">
             <ZazzyPuppy mood="happy" className="w-24 h-24" />
          </div>

          <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-black text-white tracking-tighter mb-2">
                RupeeRewind
              </h2>
              <p className="text-zinc-300 text-sm mb-4 leading-relaxed font-medium">
                Helping India visualize the true value of money. <br/>
                <span className="text-blue-400 italic text-xs">Guided by Zazzy 🐾</span>
              </p>

              {/* Concept Card */}
              <div className="group/card w-full max-w-sm bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/5 hover:border-amber-500/30 hover:bg-zinc-900/80 transition-all duration-300 overflow-hidden">
                <div className="relative p-3 flex items-center gap-3">
                   <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center border border-white/10 shadow-inner group-hover/card:scale-105 transition-transform">
                     <span className="text-xl">👨‍💻</span>
                   </div>
                   <div className="text-left">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-0.5">Concept by</span>
                      <h3 className="text-zinc-100 font-bold text-sm group-hover/card:text-white transition-colors">Nikshep Doggalli</h3>
                      <p className="text-zinc-400 text-[10px]">(Zazzy's Human)</p>
                   </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center md:justify-start">
                  <a 
                    href="https://instagram.com/nikkk.exe" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Connect on Instagram
                  </a>
              </div>
          </div>
        </div>
      </div>
  );
};

export default AboutCard;
