
import React, { useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import html2canvas from 'html2canvas';
import { CalculationResult, ChartDataPoint, AppMode, AIAnalysisState } from '../types';
import { ECONOMIC_EVENTS, GENZ_EXPENSES, SHRINKFLATION_ITEMS, POLITICIAN_CAGR, INFLUENCER_TIERS, BANGALORE_TRAFFIC_HOURS } from '../constants';
import CommodityTicker from './CommodityTicker';
import AssetComparator from './AssetComparator';
import Receipt from './Receipt';
import MobileStoryContainer from './MobileStoryContainer';
import TimeMachineInvestor from './TimeMachineInvestor'; 
import AboutCard from './AboutCard';
import AnimatedCounter from './AnimatedCounter'; 
import { PovertyBadge, AvocadoToastToggle, TechDeflation, TrafficCost, GoldDigger } from './FunCards';
import AIAnalysis from './AIAnalysis';

interface ResultViewProps {
  result: CalculationResult;
  chartData: ChartDataPoint[];
  aiState: AIAnalysisState;
  aiText: string;
  onGenerateAI: () => void;
  onSwitchMode?: (mode: AppMode) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const event = ECONOMIC_EVENTS.find(e => e.year === label);
    return (
      <div className="bg-white dark:bg-[#1c1c1e] border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl shadow-2xl min-w-[200px] z-50">
        <div className="flex justify-between items-center mb-3">
            <p className="text-zinc-500 dark:text-zinc-300 text-xs uppercase font-bold tracking-wider drop-shadow-md">{label}</p>
            {event && <span className="text-[10px] bg-zinc-100 dark:bg-white/10 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-200">{event.label}</span>}
        </div>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-zinc-700 dark:text-zinc-200 drop-shadow-sm">{entry.name}</span>
                 </div>
                 <span className="text-sm font-semibold text-zinc-900 dark:text-white tabular-nums drop-shadow-md">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(entry.value)}
                 </span>
              </div>
            </div>
          ))}
        </div>
        {event && (
            <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-white/10">
                <p className="text-xs text-zinc-500 dark:text-zinc-300 italic">"{event.description}"</p>
            </div>
        )}
      </div>
    );
  }
  return null;
};

const ResultView: React.FC<ResultViewProps> = ({ result, chartData, aiState, aiText, onGenerateAI, onSwitchMode }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [avocadoMode, setAvocadoMode] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

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
  const difference = result.salaryWithIncrement - result.adjustedAmount;
  const gainPct = ((result.salaryWithIncrement - result.adjustedAmount) / result.adjustedAmount * 100).toFixed(0);

  // Avocado Adjustment
  const genZCost = GENZ_EXPENSES.reduce((acc, curr) => acc + curr.cost, 0);
  const displayRequiredIncome = avocadoMode ? Math.max(0, result.adjustedAmount - genZCost) : result.adjustedAmount;

  // CAGR Calculation for User
  const years = result.targetYear - result.originalYear;
  const userCAGR = (Math.pow(result.salaryWithIncrement / result.originalAmount, 1 / years) - 1) * 100;

  const handleDownload = async () => {
    if (receiptRef.current) {
      setIsDownloading(true);
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: null, 
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `RupeeRewind_WealthCard_${result.originalYear}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Receipt generation failed", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Bumped up font sizes and brightness for desktop (md:)
  const labelClass = "text-zinc-500 dark:text-zinc-300 text-xs md:text-base font-bold uppercase tracking-widest mb-1";
  const subLabelClass = "text-zinc-400 dark:text-zinc-300 text-[10px] md:text-sm font-medium mb-3";

  // Calculations for Real Estate Card
  const yearsToBuy2BHKThen = (1000 / result.sqftAffordabilityOriginal).toFixed(1);
  const yearsToBuy2BHKNow = (1000 / result.sqftAffordabilityNow).toFixed(1);
  const affordabilityShrinkage = ((result.sqftAffordabilityOriginal - result.sqftAffordabilityNow) / result.sqftAffordabilityOriginal) * 100;

  // --- MERGED CARDS & COMPONENTS ---

  const SummaryCard = (
      <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group w-full h-full flex flex-col justify-center shadow-lg transition-colors duration-300">
        <div className="absolute -left-4 -bottom-4 text-[10rem] opacity-[0.03] grayscale pointer-events-none select-none group-hover:scale-105 transition-transform duration-700">
            📊
        </div>

        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
           <button 
             onClick={handleDownload}
             disabled={isDownloading}
             className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/20 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/20 transition-all text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg transform active:scale-95"
           >
             {isDownloading ? '...' : 'Share Wealth Card 📤'}
           </button>
           <div className="hidden md:block transform scale-75 origin-top-right">
             <PovertyBadge isRich={isBeatInflation} year={result.originalYear} city={result.selectedCity.name} />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 sm:mt-0 relative z-10">
            <div>
              <h3 className={labelClass}>Projected Stash</h3>
              <p className={subLabelClass}>(How much your money grew based on increments)</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">
                  <AnimatedCounter value={result.salaryWithIncrement} formatFn={formatCurrency} />
                </span>
              </div>
              
              <div className="mt-2 text-xs md:text-sm">
                   {result.industryGrowthDiff > 0 ? (
                       <span className="text-emerald-500 font-bold">Currently beating {result.selectedIndustry} Avg by {result.industryGrowthDiff}% 🚀</span>
                   ) : (
                       <span className="text-red-500 font-bold">Lagging {result.selectedIndustry} Avg by {Math.abs(result.industryGrowthDiff)}% ⚠️</span>
                   )}
              </div>
            </div>
             <div>
              <h3 className={labelClass}>{avocadoMode ? "Boomer Required Income" : "Required Income"}</h3>
              <p className={subLabelClass}>(minimum income to beat inflation)</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight transition-colors duration-500 ${avocadoMode ? 'text-green-500' : 'text-zinc-400 dark:text-zinc-400'}`}>
                  <AnimatedCounter value={displayRequiredIncome} formatFn={formatCurrency} />
                </span>
              </div>
              
              <div className="mt-4">
                 <AvocadoToastToggle isActive={avocadoMode} onToggle={() => setAvocadoMode(!avocadoMode)} />
              </div>

            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center relative z-10">
            <div className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border ${isBeatInflation ? 'bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
               {isBeatInflation 
                  ? `Beating Inflation by ${gainPct}%! Holy Moly! 🤩` 
                  : 'Lagging Behind Inflation 📉'}
            </div>
             
             {!isBeatInflation && (
                <div className="text-sm text-zinc-500 dark:text-zinc-300 flex items-center">
                   Gap: <span className="font-bold ml-1.5 text-red-500 dark:text-red-400">{formatCurrency(Math.abs(difference))}</span>
                </div>
             )}
        </div>
        
        <div className="md:hidden mt-6 flex justify-center">
            <PovertyBadge isRich={isBeatInflation} year={result.originalYear} city={result.selectedCity.name} />
        </div>
      </div>
  );

  const WealthRealityStack = () => {
      const isBeatingPoly = userCAGR > POLITICIAN_CAGR;
      
      const annualSalary = result.salaryWithIncrement;
      // const monthlySalary = annualSalary / 12;
      
      // We will override this to show MrBeast as the "New Rich" benchmark
      const comparison = { name: 'MrBeast', income: 400000000, emoji: '🎮', desc: 'Video Budget' }; // 40 Cr
      const timeToEarnAnnual = (annualSalary / comparison.income).toFixed(6); // Tiny fraction

      // OnlyFans Benchmark (Bhad Bhabie ~ $50M in a year or so, approx 400 Cr)
      const ofMonthlyIncome = 200000000; // 20 Cr/month approx
      const ofTimeToEarnUserAnnual = (annualSalary / ofMonthlyIncome).toFixed(5);

      return (
        <div className="bg-white dark:bg-[#151516] border border-orange-200 dark:border-orange-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden h-full group shadow-lg flex flex-col">
             <h3 className="text-orange-600 dark:text-orange-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                Wealth Reality Check
             </h3>
             <p className="text-zinc-500 dark:text-zinc-300 text-xs md:text-base font-medium mb-6">Comparison against the 'New Rich'</p>

             <div className="flex flex-col gap-4 md:gap-6 relative z-10 w-full h-full justify-center">
                 
                 {/* 1. Politician */}
                 <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/40 p-5 md:p-6 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-orange-500/30 transition-all">
                     <div className="flex justify-between items-center mb-3">
                        <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-200 uppercase font-extrabold tracking-wide">Vs. Avg Indian MP</p>
                        <div className={`px-2 py-1 rounded text-xs md:text-sm font-bold ${isBeatingPoly ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {isBeatingPoly ? 'Winning 🏆' : 'Losing 🏳️'} ({userCAGR.toFixed(1)}%)
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                         <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
                            <span className="text-3xl md:text-4xl">📢</span>
                         </div>
                         <div>
                            <span className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white block leading-none mb-1">{POLITICIAN_CAGR}%</span>
                            <span className="text-xs md:text-base text-zinc-600 dark:text-zinc-300 font-medium">Avg Asset Growth/Yr</span>
                         </div>
                     </div>
                 </div>

                 {/* 2. Influencer - MrBeast */}
                 <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/40 p-5 md:p-6 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-pink-300 dark:hover:border-pink-500/30 transition-all">
                     <div className="flex justify-between items-center mb-3">
                        <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-200 uppercase font-extrabold tracking-wide">Vs. {comparison.name}</p>
                        <span className="text-xs md:text-sm font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded">You = {timeToEarnAnnual} of his video budget</span>
                     </div>
                     <div className="flex items-center gap-4">
                         <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
                            <span className="text-3xl md:text-4xl">{comparison.emoji}</span>
                         </div>
                         <div>
                             <span className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white block leading-none mb-1">YouTube King</span>
                             <span className="text-xs md:text-base text-zinc-600 dark:text-zinc-300 font-medium">Beast Philanthropy 🦁</span>
                         </div>
                     </div>
                 </div>

                 {/* 3. OnlyFans - Bhad Bhabie */}
                 <div className="flex flex-col bg-zinc-50 dark:bg-zinc-900/40 p-5 md:p-6 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all">
                     <div className="flex justify-between items-center mb-3">
                        <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-200 uppercase font-extrabold tracking-wide">Vs. Bhad Bhabie</p>
                        <span className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Earned in {ofTimeToEarnUserAnnual} Months 💀</span>
                     </div>
                     <div className="flex items-center gap-4">
                         <div className="bg-white dark:bg-black/20 p-3 rounded-xl border border-zinc-100 dark:border-white/5">
                            <span className="text-3xl md:text-4xl">📸</span>
                         </div>
                         <div>
                             <span className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white block leading-none mb-1">OnlyFans Elite</span>
                             <span className="text-xs md:text-base text-zinc-600 dark:text-zinc-300 font-medium">"Cash Me Outside" 🤑</span>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
      );
  };

  const MergedErosionShrinkflationCard = () => (
    <div className="bg-white dark:bg-[#151516] border border-rose-200 dark:border-rose-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden h-full group shadow-lg">
        <h3 className="text-rose-600 dark:text-rose-500/80 text-xs md:text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            The Silent Robbery
        </h3>
        <p className={subLabelClass + " mb-6"}>Value erosion & hidden shrinkflation</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Cash Erosion */}
            <div className="border-r border-zinc-100 dark:border-white/10 pr-0 sm:pr-8 flex flex-col justify-center">
                <p className="text-[10px] md:text-sm text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-1">Cash Value Eroded</p>
                <span className="text-3xl md:text-5xl font-black text-rose-500 dark:text-rose-400 tracking-tight block">
                    <AnimatedCounter value={result.erodedOriginalAmount} formatFn={formatCompact} />
                </span>
                <p className="text-xs md:text-base text-zinc-400 dark:text-zinc-200 mt-2">
                    Your original ₹{formatCompact(result.originalAmount)} is effectively worth this much today.
                </p>
            </div>

            {/* Shrinkflation */}
            <div>
                <p className="text-[10px] md:text-sm text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-3">Shrinkflation (Hidden Tax)</p>
                <div className="space-y-4">
                    {SHRINKFLATION_ITEMS.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs md:text-base">
                            <span className="text-zinc-700 dark:text-zinc-200 font-bold flex items-center gap-2">
                                {item.emoji} {item.name}
                            </span>
                            <div className="flex gap-2 text-[10px] md:text-sm">
                                <span className="text-zinc-400 dark:text-zinc-500 line-through decoration-red-500">{item.oldWeight}</span>
                                <span className="text-zinc-900 dark:text-white font-bold">{item.newWeight}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  const MergedRealEstateTaxCard = () => (
      <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden h-full group shadow-lg">
          <h3 className="text-zinc-500 dark:text-zinc-300 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Reality Check: Home & Tax</h3>
          <p className={subLabelClass + " mb-6"}>Home affordability drop vs Tax burden rise</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Real Estate */}
              <div className="border-r border-zinc-100 dark:border-white/10 pr-0 sm:pr-8">
                  <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] md:text-sm text-zinc-500 dark:text-zinc-400 uppercase font-bold">Property Affordability</p>
                      <span className="text-[10px] bg-zinc-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-200 font-bold">{result.selectedCity.name}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-xs md:text-base">
                          <span className="text-zinc-400 dark:text-zinc-300">Then</span>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{result.sqftAffordabilityOriginal.toFixed(0)} sqft/yr</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-base">
                          <span className="text-zinc-400 dark:text-zinc-300">Now</span>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{result.sqftAffordabilityNow.toFixed(0)} sqft/yr</span>
                      </div>
                      <div className="mt-2 w-full bg-red-100 dark:bg-red-500/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${affordabilityShrinkage}%` }}></div>
                      </div>
                      <span className="text-[10px] md:text-sm text-red-500 font-bold mt-1 text-right">-{affordabilityShrinkage.toFixed(0)}% Capacity</span>
                  </div>
              </div>

              {/* Tax */}
              <div className="flex flex-col justify-center">
                  <p className="text-[10px] md:text-sm text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-2">The Tax Trap</p>
                  <div className="flex justify-between items-end mb-2">
                      <div>
                          <p className="text-xs md:text-base text-zinc-400 dark:text-zinc-300">You work for Govt</p>
                          <p className="text-xl md:text-3xl font-black text-zinc-900 dark:text-white">{result.daysWorkedForTax} <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">days/mo</span></p>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Tax Then</p>
                          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-300">{formatCompact(result.taxOriginal)}</p>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">Tax Now</p>
                          <p className="text-sm md:text-xl font-bold text-red-500">{formatCompact(result.taxNow)}</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const MissedFortuneCard = (
    <div className="bg-white dark:bg-[#151516] border border-blue-200 dark:border-blue-500/20 rounded-3xl p-8 relative overflow-hidden h-full w-full group shadow-lg transition-colors duration-300">
        <div className="absolute -left-8 -bottom-10 text-[10rem] opacity-[0.04] grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform duration-700">
            🚀
        </div>

        <div className="relative z-10">
            <h3 className="text-blue-600 dark:text-blue-400/80 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                Missed Fortune (Mutual Funds)
            </h3>
            <p className={subLabelClass + " mb-6"}>Comparison of investing 20% of monthly income in SIPs</p>
            
            <div className="text-center py-4 mb-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <p className="text-[10px] md:text-sm uppercase text-zinc-500 dark:text-zinc-300 mb-1 font-bold">Standard Nifty SIP (13%)</p>
                <span className="text-3xl sm:text-5xl font-black text-blue-500 dark:text-blue-400 tracking-tight block">
                    <AnimatedCounter value={result.sipMissedFortune} formatFn={formatCurrency} />
                </span>
            </div>

            <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-3 tracking-widest">Top Performers ({result.originalYear}-{result.targetYear})</p>
            <div className="space-y-3">
                {result.mutualFundReturns.slice(0, 3).map((mf, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-zinc-100 dark:border-white/5 pb-2 last:border-0">
                        <div className="flex items-center gap-2">
                             <span className="text-lg md:text-2xl">{mf.emoji}</span>
                             <div>
                                 <p className="text-xs md:text-base font-bold text-zinc-800 dark:text-zinc-200">{mf.name}</p>
                                 <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400">{mf.cagr}% CAGR</p>
                             </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm md:text-xl font-bold text-zinc-900 dark:text-white"><AnimatedCounter value={mf.value} formatFn={formatCompact} /></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const ChartCard = (
      <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 h-[400px] w-full relative overflow-hidden shadow-lg transition-colors duration-300">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] opacity-[0.01] pointer-events-none select-none">
            📉
        </div>

        <h4 className="text-zinc-600 dark:text-zinc-200 text-base md:text-xl font-medium mb-6 relative z-10">
          The Gap: What You Have vs What You Need
        </h4>
        <div className="w-full h-[300px] relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#525252" vertical={false} opacity={0.2} />
              <XAxis 
                dataKey="year" 
                stroke="#a1a1aa" 
                tick={{fontSize: 12, fill: '#71717a'}} 
                tickMargin={15}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#a1a1aa' }}/>
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Your Income"
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={0.2} 
                fill="#10b981" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="value2" 
                name="Required Income" 
                stroke="#71717a" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={0.1} 
                fill="#71717a" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="value3" 
                name="Gold Equivalent" 
                stroke="#f59e0b" 
                strokeWidth={1}
                fillOpacity={0} 
                strokeOpacity={0.5}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
  );

  return (
    <>
       <Receipt ref={receiptRef} result={result} />

       <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-min">
            <div className="md:col-span-2">{SummaryCard}</div>
            
            <div className="md:col-span-2">
                 <TimeMachineInvestor 
                    originalAmount={result.originalAmount} 
                    yearThen={result.originalYear} 
                    yearNow={result.targetYear} 
                 />
            </div>

            <div className="md:col-span-2">
                <CommodityTicker 
                    salaryThen={result.originalAmount} 
                    salaryNow={result.salaryWithIncrement} 
                    yearThen={result.originalYear}
                    yearNow={result.targetYear}
                />
            </div>

            {/* Merged Cards Section - Updated */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <WealthRealityStack />
                 <MergedErosionShrinkflationCard />
            </div>

            <div className="md:col-span-2"><AssetComparator yearThen={result.originalYear} yearNow={result.targetYear} /></div>
            
            <div className="grid grid-rows-2 gap-8 h-full">
                {ChartCard}
                <div className="grid grid-cols-2 gap-4">
                     <TechDeflation salaryThen={result.originalAmount * 12} salaryNow={result.salaryWithIncrement * 12} />
                     <TrafficCost salaryNow={result.salaryWithIncrement} />
                </div>
            </div>

            <div className="space-y-8">
                <MergedRealEstateTaxCard />
                <GoldDigger yearThen={result.originalYear} />
            </div>

            <div className="md:col-span-2">{MissedFortuneCard}</div>
            
            <div className="md:col-span-2"><AboutCard /></div>
       </div>

       {/* Mobile View */}
       <div className="block md:hidden h-[720px]">
           <MobileStoryContainer>
               {SummaryCard}
               <WealthRealityStack />
               <TimeMachineInvestor 
                    originalAmount={result.originalAmount} 
                    yearThen={result.originalYear} 
                    yearNow={result.targetYear} 
               />
               <CommodityTicker 
                    salaryThen={result.originalAmount} 
                    salaryNow={result.salaryWithIncrement} 
                    yearThen={result.originalYear}
                    yearNow={result.targetYear}
               />
               <MergedErosionShrinkflationCard />
               <MergedRealEstateTaxCard />
               <AssetComparator yearThen={result.originalYear} yearNow={result.targetYear} />
               {ChartCard}
               <div className="grid grid-cols-1 gap-4 w-full">
                     <TechDeflation salaryThen={result.originalAmount * 12} salaryNow={result.salaryWithIncrement * 12} />
                     <TrafficCost salaryNow={result.salaryWithIncrement} />
               </div>
               <GoldDigger yearThen={result.originalYear} />
               {MissedFortuneCard}
               <AboutCard />
           </MobileStoryContainer>
       </div>
    </>
  );
};

export default ResultView;
