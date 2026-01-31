
import React, { useRef, useEffect, useState } from 'react';
import { COMMODITIES } from '../constants';
import AnimatedCounter from './AnimatedCounter';

interface CommodityTickerProps {
  salaryThen: number;
  salaryNow: number; 
  yearThen: number;
  yearNow: number;
}

const CommodityTicker: React.FC<CommodityTickerProps> = ({ salaryThen, salaryNow, yearThen, yearNow }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const getPrice = (prices: { [year: number]: number }, targetYear: number) => {
    if (prices[targetYear]) return prices[targetYear];
    const years = Object.keys(prices).map(Number).sort((a, b) => a - b);
    const closest = years.reduce((prev, curr) => 
      (Math.abs(curr - targetYear) < Math.abs(prev - targetYear) ? curr : prev)
    );
    return prices[closest];
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    
    const scroll = () => {
      if (!isPaused) {
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

  const CommodityItem: React.FC<{ item: any }> = ({ item }) => {
      const priceThen = getPrice(item.prices, yearThen);
      const priceNow = getPrice(item.prices, yearNow);
      
      const qtyThen = Math.floor(salaryThen / priceThen);
      const qtyNow = Math.floor(salaryNow / priceNow);
      const diff = qtyNow - qtyThen;
      const isLess = diff < 0;

      return (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-100 dark:border-white/5 flex flex-col items-center text-center w-[170px] h-[160px] mx-2 shadow-sm justify-between select-none shrink-0">
           <div>
              <div className="text-3xl mb-3 transform hover:scale-110 transition-transform duration-300 cursor-pointer">{item.emoji}</div>
              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-2 whitespace-nowrap">{item.name}</div>
              
              <div className="w-full flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider font-semibold">
                <span>{yearThen}</span>
                <span>Now</span>
              </div>
           </div>
           
           <div className="w-full">
              <div className="w-full flex justify-between items-center font-mono text-base font-black mb-3 bg-zinc-200 dark:bg-black/20 rounded-lg px-2 py-1">
                <span className="text-zinc-600 dark:text-zinc-300">{qtyThen}</span>
                <span className="text-zinc-400 dark:text-zinc-500">→</span>
                <span className={isLess ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}>
                    <AnimatedCounter value={qtyNow} />
                </span>
              </div>
              
              <span className={`text-[10px] px-2 py-1.5 rounded-md font-bold leading-tight w-full block ${isLess ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                {isLess ? 'LOST' : 'GAINED'} capacity for {Math.abs(diff)}
              </span>
           </div>
        </div>
      );
  };

  const marqueeItems = [...COMMODITIES, ...COMMODITIES, ...COMMODITIES, ...COMMODITIES];

  return (
    <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/5 rounded-3xl p-6 w-full h-full flex flex-col justify-center shadow-lg transition-colors duration-300 overflow-hidden">
      <div className="mb-6">
         <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-widest flex items-center gap-2 mb-1">
            Purchasing Power Reality
         </h3>
         <p className="text-[10px] text-zinc-400 dark:text-zinc-400 font-medium">(How many items could your salary buy then vs now?)</p>
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
         {/* 2-row layout */}
         <div className="grid grid-rows-2 grid-flow-col gap-4 w-max">
             {marqueeItems.map((item, idx) => (
                 <CommodityItem key={`${item.id}-${idx}`} item={item} />
             ))}
         </div>
      </div>
    </div>
  );
};

export default CommodityTicker;
