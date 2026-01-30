
import React, { forwardRef } from 'react';
import { CalculationResult } from '../types';
import ZazzyPuppy from './NikiPuppy';

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
      if (val >= 100000) return `₹${(val/100000).toFixed(1)} L`;
      return formatCurrency(val);
  };

  const today = new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="fixed left-[-9999px] top-0">
      <div 
        ref={ref} 
        className="w-[450px] bg-[#fdfdfd] text-black font-sans p-10 relative overflow-hidden"
      >
        {/* Simple Clean Header */}
        <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-6">
            <div className="flex items-center gap-4">
                <ZazzyPuppy mood="happy" className="w-14 h-14" />
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">RupeeRewind</h1>
                    <p className="text-sm font-semibold text-zinc-500">by Nikshep</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Official Report</p>
                <p className="text-sm font-medium">{today}</p>
            </div>
        </div>

        {/* Main Stats */}
        <div className="space-y-6 mb-8">
             <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Amount in {result.originalYear}</span>
                    <span className="text-2xl font-bold">{formatCurrency(result.originalAmount)}</span>
                </div>
                <div className="w-full h-px bg-zinc-200 my-4"></div>
                <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Value Today (Required)</span>
                    <span className="text-3xl font-black text-blue-600">{formatCurrency(result.adjustedAmount)}</span>
                </div>
             </div>

             <div className="flex justify-between items-center px-2">
                <span className="text-sm font-semibold text-zinc-400">Your Current Value</span>
                <span className="text-xl font-bold">{formatCurrency(result.salaryWithIncrement)}</span>
             </div>
             
             <div className="flex justify-between items-center px-2">
                <span className="text-sm font-semibold text-red-400">Inflation Loss</span>
                <span className="text-xl font-bold text-red-500">
                    {result.adjustedAmount > result.salaryWithIncrement ? '-' : '+'}
                    {formatCurrency(Math.abs(result.adjustedAmount - result.salaryWithIncrement))}
                </span>
             </div>
        </div>

        {/* Purchasing Power Footer */}
        <div className="bg-black text-white p-6 rounded-2xl">
             <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Cash Erosion Reality</p>
             <div className="flex flex-col gap-1">
                <span className="text-sm text-zinc-300">Your {formatCompact(result.originalAmount)} kept as cash is now effectively</span>
                <span className="text-4xl font-black">{formatCurrency(result.erodedOriginalAmount)}</span>
                <span className="text-[10px] text-zinc-500 mt-1">in {result.originalYear}'s purchasing power</span>
             </div>
        </div>
      </div>
    </div>
  );
});

export default Receipt;
