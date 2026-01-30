
import React from 'react';
import { COMMODITIES } from '../constants';
import InfoTooltip from './InfoTooltip';

interface CommodityTickerProps {
  salaryThen: number;
  salaryNow: number; 
  yearThen: number;
  yearNow: number;
}

const CommodityTicker: React.FC<CommodityTickerProps> = ({ salaryThen, salaryNow, yearThen, yearNow }) => {
  
  const getPrice = (prices: { [year: number]: number }, targetYear: number) => {
    if (prices[targetYear]) return prices[targetYear];
    const years = Object.keys(prices).map(Number).sort((a, b) => a - b);
    const closest = years.reduce((prev, curr) => 
      (Math.abs(curr - targetYear) < Math.abs(prev - targetYear) ? curr : prev)
    );
    return prices[closest];
  };

  const yearsElapsed = yearNow - yearThen;

  return (
    <div className="bg-[#151516] border border-white/5 rounded-3xl p-6 w-full h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-6">
         <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            Purchasing Power Reality
            <InfoTooltip text="How many items could your salary buy then vs now?" />
         </h3>
      </div>
      
      {/* Grid Layout: 2 Columns on Mobile, 4 on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COMMODITIES.map((item) => {
          const priceThen = getPrice(item.prices, yearThen);
          const priceNow = getPrice(item.prices, yearNow);
          
          const qtyThen = Math.floor(salaryThen / priceThen);
          const qtyNow = Math.floor(salaryNow / priceNow);
          const diff = qtyNow - qtyThen;
          const isLess = diff < 0;

          return (
            <div key={item.id} className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5 flex flex-col items-center text-center">
               <div className="text-3xl mb-3">{item.emoji}</div>
               <div className="text-sm font-bold text-zinc-300 mb-2">{item.name}</div>
               
               <div className="w-full flex justify-between text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-semibold">
                 <span>{yearThen}</span>
                 <span>Now</span>
               </div>
               
               <div className="w-full flex justify-between items-center font-mono text-base font-black mb-3 bg-black/20 rounded-lg px-2 py-1">
                 <span className="text-zinc-400">{qtyThen}</span>
                 <span className="text-zinc-600">→</span>
                 <span className={isLess ? 'text-red-400' : 'text-emerald-400'}>{qtyNow}</span>
               </div>
               
               <span className={`text-[10px] px-2 py-1.5 rounded-md font-bold leading-tight w-full ${isLess ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                 {isLess ? 'LOST' : 'GAINED'} capacity for {Math.abs(diff)}
               </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommodityTicker;
