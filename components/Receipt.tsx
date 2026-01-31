
import React, { forwardRef } from 'react';
import { CalculationResult } from '../types';
import ZazzyPuppy from './NikiPuppy';
import AnimatedCounter from './AnimatedCounter';

interface ReceiptProps {
  result: CalculationResult;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ result }, ref) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };
  
  const formatCompact = (val: number) => {
      if (val >= 10000000) return `₹${(val/10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `₹${(val/100000).toFixed(1)} L`;
      return formatCurrency(val);
  };

  const isBeatInflation = result.salaryWithIncrement >= result.adjustedAmount;
  const today = new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="fixed left-[-9999px] top-0">
      <div 
        ref={ref} 
        className="w-[600px] h-[900px] bg-white text-zinc-900 font-sans relative overflow-hidden flex flex-col p-8 border-[12px] border-zinc-900"
      >
        {/* Money Pattern Backdrop */}
        <div className="absolute inset-0 opacity-[0.03] text-[4rem] leading-none pointer-events-none select-none overflow-hidden break-words font-serif text-zinc-900" style={{ wordBreak: 'break-all' }}>
            💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑 
            💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑
            💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑
            💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑
            💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑
            💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑 💸 💰 💵 🤑
        </div>

        {/* Header */}
        <div className="flex justify-between items-end border-b-4 border-zinc-900 pb-6 mb-8 relative z-10">
            <div>
                 <h1 className="text-5xl font-black uppercase tracking-tighter mb-1 text-zinc-900 leading-none">RupeeRewind</h1>
                 <p className="text-xs text-zinc-500 font-bold tracking-[0.2em] uppercase">Private Wealth Report • {result.originalYear} // {result.targetYear}</p>
            </div>
            <div className="text-right flex flex-col items-end">
                <div className="bg-zinc-900 text-white px-3 py-1.5 font-bold text-sm uppercase tracking-wider inline-block mb-1 transform -rotate-2 shadow-lg">Verified</div>
                <div className="text-zinc-500 text-[10px] font-mono">{today}</div>
            </div>
        </div>

        {/* Main Stats Block */}
        <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
            <div className="col-span-2 bg-zinc-100 p-6 rounded-xl border-2 border-zinc-200 flex items-center justify-between shadow-sm">
                <div className="flex flex-col justify-center">
                    <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">Inflation Adjusted Goal</p>
                    <div className="text-6xl font-black text-zinc-900 tracking-tighter leading-none">
                        <AnimatedCounter value={result.adjustedAmount} formatFn={formatCompact} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-2 font-medium">Monthly income needed to match {result.originalYear}.</p>
                </div>
                <div className="text-right flex flex-col justify-center">
                    <div className={`inline-flex flex-col items-end ${isBeatInflation ? 'text-emerald-600' : 'text-red-600'}`}>
                        <span className="text-4xl font-black tracking-tighter leading-none">{isBeatInflation ? 'WINNING' : 'LAGGING'}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-zinc-200 px-2 py-1 rounded mt-1 text-zinc-600">Status</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border-2 border-zinc-100 shadow-sm flex flex-col justify-center">
                <p className="text-[10px] text-zinc-400 uppercase font-black mb-1 tracking-wider">Salary {result.originalYear}</p>
                <p className="text-3xl font-bold font-mono text-zinc-900 leading-tight">{formatCurrency(result.originalAmount)}</p>
            </div>
            <div className="bg-zinc-900 p-5 rounded-xl border-2 border-zinc-900 shadow-lg flex flex-col justify-center">
                <p className="text-[10px] text-zinc-400 uppercase font-black mb-1 tracking-wider">Projected {result.targetYear}</p>
                <p className="text-3xl font-bold font-mono text-white leading-tight">{formatCurrency(result.salaryWithIncrement)}</p>
            </div>
        </div>

        {/* Dense Data Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 relative z-10 flex-grow content-start">
            {/* Missed Fortune */}
            <div className="col-span-2 bg-zinc-50 p-5 rounded-xl border-2 border-zinc-100 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-2 right-2 p-2 opacity-5 text-8xl grayscale select-none">🚀</div>
                <p className="text-[10px] text-zinc-400 uppercase font-black mb-2 tracking-wider">Missed Fortune (Small Cap SIP)</p>
                <p className="text-4xl font-black text-blue-600 mb-4 tracking-tight leading-none">
                    <AnimatedCounter value={result.mutualFundReturns[0]?.value || result.sipMissedFortune} formatFn={formatCompact} />
                </p>
                <div className="space-y-2">
                    {result.mutualFundReturns.slice(0,2).map((mf, i) => (
                        <div key={i} className="flex justify-between text-xs text-zinc-600 border-b border-zinc-200 pb-1 font-medium">
                            <span>{mf.name}</span>
                            <span className="font-bold">{mf.cagr}% CAGR</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gold */}
            <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-100 flex flex-col justify-between">
                <div>
                     <p className="text-[10px] text-amber-600/60 uppercase font-black mb-1 tracking-wider">Gold Held</p>
                     <p className="text-2xl font-bold text-amber-600 leading-tight"><AnimatedCounter value={result.goldAdjustedAmount} formatFn={formatCompact} /></p>
                </div>
                <div className="text-[10px] text-amber-700/40 mt-2 font-bold">vs Cash: {formatCompact(result.originalAmount)}</div>
            </div>

            {/* Real Estate */}
             <div className="col-span-3 bg-zinc-100 p-4 rounded-xl border-2 border-zinc-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg text-2xl border border-zinc-200 shadow-sm">🏠</div>
                    <div>
                        <p className="text-[10px] text-zinc-400 uppercase font-black">Property Affordability ({result.selectedCity.name})</p>
                        <p className="text-sm font-bold text-zinc-800">
                             Then: <span className="text-zinc-900">{result.sqftAffordabilityOriginal.toFixed(0)} sqft/yr</span> 
                             <span className="mx-2 text-zinc-400">→</span> 
                             Now: <span className="text-zinc-900">{result.sqftAffordabilityNow.toFixed(0)} sqft/yr</span>
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-white bg-red-500 px-3 py-1.5 rounded-lg shadow-sm">
                        {((result.sqftAffordabilityNow - result.sqftAffordabilityOriginal)/result.sqftAffordabilityOriginal * 100).toFixed(0)}% Drop
                    </p>
                </div>
             </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t-4 border-zinc-900 pt-6 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
                <div className="bg-zinc-900 text-white p-1 rounded">
                     <ZazzyPuppy mood="happy" className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm font-black text-zinc-900 uppercase leading-none">RupeeRewind</p>
                    <p className="text-[10px] text-zinc-500 font-bold mt-0.5">Inflation is real. Invest Smart.</p>
                </div>
            </div>
            <div className="text-right">
                 <p className="text-xs font-mono text-zinc-400 font-medium">ID: {result.originalYear}-{Math.floor(Math.random() * 10000)}</p>
            </div>
        </div>
      </div>
    </div>
  );
});

export default Receipt;
