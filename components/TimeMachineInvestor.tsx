
import React, { useRef, useEffect, useState } from 'react';
import { TIME_MACHINE_ASSETS } from '../constants';
import AnimatedCounter from './AnimatedCounter';

interface TimeMachineInvestorProps {
  originalAmount: number;
  yearThen: number;
  yearNow: number;
}

const TimeMachineInvestor: React.FC<TimeMachineInvestorProps> = ({ originalAmount, yearThen, yearNow }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const formatCompact = (val: number) => {
      if (val >= 10000000) return `₹${(val/10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `₹${(val/100000).toFixed(1)} L`;
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(val);
  };

  const getPrice = (prices: { [year: number]: number }, targetYear: number) => {
     if (prices[targetYear]) return prices[targetYear];
     const years = Object.keys(prices).map(Number).sort((a, b) => a - b);
     
     if (targetYear <= years[0]) return prices[years[0]];
     if (targetYear >= years[years.length - 1]) return prices[years[years.length - 1]];

     for (let i = 0; i < years.length - 1; i++) {
        if (targetYear > years[i] && targetYear < years[i+1]) {
            return prices[years[i]]; 
        }
     }
     return 1;
  };

  const investmentAmount = originalAmount;
  
  const getAssetEmoji = (id: string) => {
      if (id === 'bitcoin') return '₿';
      if (id === 'ethereum') return 'Ξ';
      if (id === 'nifty') return '🇮🇳';
      if (id === 'reliance') return '🛢️';
      if (id === 'infosys') return '💻';
      if (id === 'apple') return '🍎';
      if (id === 'tesla') return '⚡';
      return '📈';
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    
    const scroll = () => {
      if (!isPaused) {
        // Sync ref with actual scroll position if manually scrolled significantly
        if (Math.abs(container.scrollLeft - scrollPosRef.current) > 10) {
            scrollPosRef.current = container.scrollLeft;
        }

        scrollPosRef.current += 1; // Robust scroll speed
        
        if (scrollPosRef.current >= (container.scrollWidth - container.clientWidth)) {
           scrollPosRef.current = 0;
           container.scrollLeft = 0;
        } else {
           container.scrollLeft = scrollPosRef.current;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);


  const AssetItem: React.FC<{ asset: any }> = ({ asset }) => {
        const priceThen = getPrice(asset.prices, yearThen);
        const priceNow = getPrice(asset.prices, yearNow);
        const units = investmentAmount / priceThen;
        const valueNow = units * priceNow;
        const roi = ((valueNow - investmentAmount) / investmentAmount) * 100;

        return (
            <div className="bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group w-[220px] h-[130px] shadow-sm select-none mx-2 shrink-0">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-zinc-700 dark:text-zinc-100 text-sm">{asset.name}</h4>
                        <span className="text-[10px] bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-300">{asset.ticker}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-base shadow-md`} style={{ backgroundColor: asset.color }}>
                        {getAssetEmoji(asset.id)}
                    </div>
                </div>
                
                <div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-0.5">Value Today</div>
                    <div className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                        <AnimatedCounter value={valueNow} formatFn={formatCompact} />
                    </div>
                    <div className="text-[10px] font-bold text-emerald-500 mt-1">
                        +<AnimatedCounter value={roi} />%
                    </div>
                </div>
            </div>
        )
  };

  // Duplicate items for a smoother loop buffer
  const marqueeAssets = [...TIME_MACHINE_ASSETS, ...TIME_MACHINE_ASSETS, ...TIME_MACHINE_ASSETS, ...TIME_MACHINE_ASSETS]; 

  return (
    <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden w-full shadow-lg">
        {/* Backdrop Emoji */}
        <div className="absolute -right-10 -top-10 text-[10rem] opacity-[0.03] grayscale pointer-events-none select-none">
            ⏳
        </div>

        <div className="relative z-10 mb-6">
            <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                Time Machine Investor
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-300 font-medium">(What if you invested your entire monthly salary of ₹{originalAmount} once in {yearThen}?)</p>
        </div>

        <div 
             ref={scrollRef}
             className="overflow-x-auto pb-4 scrollbar-hide w-full cursor-grab active:cursor-grabbing"
             onMouseEnter={() => setIsPaused(true)}
             onMouseLeave={() => setIsPaused(false)}
             onTouchStart={() => setIsPaused(true)}
             onTouchEnd={() => setIsPaused(false)}
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
             {/* 2-row grid layout */}
             <div className="grid grid-rows-2 grid-flow-col gap-4 w-max">
                 {marqueeAssets.map((asset, idx) => (
                     <AssetItem key={`${asset.id}-${idx}`} asset={asset} />
                 ))}
             </div>
        </div>
        
        <div className="mt-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-xl border border-zinc-100 dark:border-white/5 text-center relative z-20">
             <p className="text-xs text-zinc-500 dark:text-zinc-300 italic">
                 *Past performance is not indicative of future results. Based on historical data.
             </p>
        </div>
    </div>
  );
};

export default TimeMachineInvestor;
