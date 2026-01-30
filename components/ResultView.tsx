
import React, { useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import html2canvas from 'html2canvas';
import { CalculationResult, ChartDataPoint, CityTierMove, AIAnalysisState, AppMode } from '../types';
import { ECONOMIC_EVENTS } from '../constants';
import InfoTooltip from './InfoTooltip';
import CommodityTicker from './CommodityTicker';
import AssetComparator from './AssetComparator';
import Receipt from './Receipt';
import MobileStoryContainer from './MobileStoryContainer';
import AIAnalysis from './AIAnalysis';
import ZazzyPuppy from './NikiPuppy'; 
import { getRealEstateInsight } from '../services/geminiService';

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
      <div className="bg-[#1c1c1e] border border-zinc-800 p-4 rounded-xl shadow-2xl min-w-[200px] z-50">
        <div className="flex justify-between items-center mb-3">
            <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider drop-shadow-md">{label}</p>
            {event && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">{event.label}</span>}
        </div>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-zinc-300 drop-shadow-sm">{entry.name}</span>
                 </div>
                 <span className="text-sm font-semibold text-white tabular-nums drop-shadow-md">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(entry.value)}
                 </span>
              </div>
            </div>
          ))}
        </div>
        {event && (
            <div className="mt-3 pt-2 border-t border-white/5">
                <p className="text-xs text-zinc-400 italic">"{event.description}"</p>
            </div>
        )}
      </div>
    );
  }
  return null;
};

const ResultView: React.FC<ResultViewProps> = ({ result, chartData, aiState, aiText, onGenerateAI, onSwitchMode }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [liveRealEstatePrice, setLiveRealEstatePrice] = useState<number | null>(null);
  const [isCheckingRealEstate, setIsCheckingRealEstate] = useState(false);
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
        link.download = `RupeeRewind_Report_${result.originalYear}.png`;
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

  const handleCheckLiveRealEstate = async () => {
      setIsCheckingRealEstate(true);
      const price = await getRealEstateInsight(result.selectedCity.name);
      if (price) {
          setLiveRealEstatePrice(price);
      }
      setIsCheckingRealEstate(false);
  };

  // Shared Styles for Glow
  const labelClass = "text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]";
  const silverTextClass = "text-zinc-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.15)]";

  // --- CARD COMPONENTS ---

  const SummaryCard = (
      <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 relative overflow-hidden group w-full h-full flex flex-col justify-center">
        {/* Backdrop Emoji - Left Corner */}
        <div className="absolute -left-4 -bottom-4 text-[10rem] opacity-[0.03] grayscale pointer-events-none select-none group-hover:scale-105 transition-transform duration-700">
            📊
        </div>

        <div className="absolute top-6 right-6 z-10">
           <button 
             onClick={handleDownload}
             disabled={isDownloading}
             className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg transform active:scale-95 backdrop-blur-md"
           >
             {isDownloading ? '...' : 'Share! 📤'}
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 sm:mt-0 relative z-10">
            <div>
              <h3 className={labelClass}>
                Your Projected Income
                <InfoTooltip text="This is how much your money has grown!" />
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight ${isBeatInflation ? 'text-white' : 'text-white'} drop-shadow-2xl`}>
                  {formatCurrency(result.salaryWithIncrement)}
                </span>
              </div>
              <p className="text-zinc-500 text-sm">
                Based on your historical growth.
              </p>
            </div>
             <div>
              <h3 className={labelClass}>
                Required for Lifestyle
                <InfoTooltip text="This is how much money you NEED to buy the same toys as before." />
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-zinc-400 tracking-tight drop-shadow-lg">
                  {formatCurrency(result.adjustedAmount)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                  {result.cityTier !== CityTierMove.SAME_TIER && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          {result.cityTier}
                      </span>
                  )}
                  {result.selectedCity.name !== 'National Average' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                          {result.selectedCity.name}
                      </span>
                  )}
                  {result.selectedDomain.id !== 'general' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                          {result.selectedDomain.label} Domain
                      </span>
                  )}
              </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center relative z-10">
            <div className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold border ${isBeatInflation ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} shadow-lg`}>
               {isBeatInflation 
                  ? `Beating Inflation by ${formatCurrency(Math.abs(difference))}! Great Job! 🎉` 
                  : 'Lagging Behind Inflation'}
            </div>
             
             {!isBeatInflation && (
                <div className="text-sm text-zinc-400 flex items-center">
                   Gap: <span className="font-bold ml-1.5 text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">Holy Moly! {formatCurrency(Math.abs(difference))}</span>
                </div>
             )}
        </div>
      </div>
  );

  const CashErosionCard = (
    <div className="bg-[#151516] border border-purple-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center h-full w-full group">
        {/* Backdrop Emoji - Left */}
        <div className="absolute -left-4 -bottom-6 text-[10rem] opacity-[0.04] grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform duration-700">
            📉
        </div>
        
        <div className="relative z-10">
            <h3 className="flex items-center text-purple-400/80 text-sm font-bold uppercase tracking-widest mb-6 drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]">
                Cash Erosion Reality
                <InfoTooltip text="If you put your original money in a drawer, this is what it feels like today." />
            </h3>
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-4">
                    <span className="text-lg text-zinc-400 font-medium">Original Stash</span>
                    <span className="text-xl font-bold text-white drop-shadow-md">{formatCompact(result.originalAmount)}</span>
                </div>
                
                <div className="text-center py-6">
                    <p className="text-sm text-zinc-500 mb-2">Mother Trinity! It's effectively worth only</p>
                    <span className="text-6xl font-black text-purple-400 tracking-tight block drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
                        {formatCurrency(result.erodedOriginalAmount)}
                    </span>
                    <p className="text-zinc-500 text-sm mt-4">
                        In {result.originalYear}'s purchasing power terms. <br/>
                        <span className="text-purple-300 font-medium">You lost {((result.originalAmount - result.erodedOriginalAmount)/result.originalAmount * 100).toFixed(0)}% value to inflation!</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );

  const GoldCard = (
    <div className="bg-[#151516] border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center h-full w-full group">
        {/* Backdrop Emoji - Left */}
        <div className="absolute -left-4 -bottom-6 text-[10rem] opacity-[0.04] grayscale pointer-events-none select-none group-hover:scale-110 transition-transform duration-700">
            ⚱️
        </div>

        <div className="relative z-10">
            <h3 className="text-amber-500/80 text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                Gold Equivalent
                {result.isGoldPriceLive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                    LIVE PRICE
                </span>
                )}
            </h3>
            <div className="text-center py-6">
                <p className="text-sm text-zinc-500 mb-2">If you bought Gold instead of Cash</p>
                <span className="text-5xl font-black text-amber-400 tracking-tight block drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                    {formatCurrency(result.goldAdjustedAmount)}
                </span>
                <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 inline-block backdrop-blur-sm">
                    <p className="text-zinc-300 text-sm">
                        That's <span className="text-amber-400 font-bold">{(result.goldAdjustedAmount/result.salaryWithIncrement).toFixed(1)}x</span> your current projected salary!
                    </p>
                </div>
            </div>
        </div>
    </div>
  );

  // New Metrics Calculation for Missed Fortune
  const missedFortuneFD = Math.round(result.originalAmount * 0.20 * 12 * ((Math.pow(1.06, result.targetYear - result.originalYear) - 1) / 0.06) * 1.06); 
  const luxuryCarPrice = 5500000; // ~55L for entry luxury
  const carsCouldBuy = (result.sipMissedFortune / luxuryCarPrice).toFixed(1);

  const MissedFortuneCard = (
    <div className="bg-[#151516] border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden h-full w-full group">
        {/* Backdrop Emoji - Left */}
        <div className="absolute -left-8 -bottom-10 text-[10rem] opacity-[0.04] grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform duration-700">
            🚀
        </div>

        <div className="relative z-10">
            <h3 className="text-blue-400/80 text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">
                Missed Fortune (SIP vs FD)
                <InfoTooltip text="Comparison of investing 20% of monthly income in Nifty 50 (13%) vs Fixed Deposit (6%)." />
            </h3>
            <div className="text-center py-4 mb-6">
                <p className="text-sm text-zinc-500 mb-2">Smart Wealth Potential</p>
                <span className="text-4xl sm:text-5xl font-black text-blue-400 tracking-tight block drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]">
                    {formatCurrency(result.sipMissedFortune)}
                </span>
            </div>

            {/* Comparison Bar */}
            <div className="space-y-4">
                 <div className="flex flex-col gap-1">
                     <div className="flex justify-between text-xs text-zinc-400">
                         <span>Cost of Safety (FD)</span>
                         <span>{formatCompact(missedFortuneFD)}</span>
                     </div>
                     <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                         <div className="bg-zinc-600 h-full" style={{ width: `${(missedFortuneFD / result.sipMissedFortune) * 100}%` }}></div>
                     </div>
                 </div>
                 
                 <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
                     <div className="text-3xl">🏎️</div>
                     <div className="text-right">
                         <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Lifestyle Upgrade</p>
                         <p className="text-sm text-blue-200 font-bold">Equivalent to <span className="text-white">{carsCouldBuy}</span> Brand New BMW X1s! Holy Moly! 🚘</p>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );

  // Dynamic Real Estate Affordability Calculation
  const realEstateAffordabilityNow = liveRealEstatePrice 
     ? (result.salaryWithIncrement * 12) / liveRealEstatePrice 
     : result.sqftAffordabilityNow;

  // New Metrics for Real Estate
  // Implied price derivation to respect city tiers in fallback scenario
  const impliedSqftPrice = (result.salaryWithIncrement * 12) / result.sqftAffordabilityNow;
  const price1000Sqft = (liveRealEstatePrice || impliedSqftPrice) * 1000;
  
  const yearsToBuyHome = (price1000Sqft / (result.salaryWithIncrement * 12)).toFixed(1);
  const loanAmount = price1000Sqft * 0.8;
  const interestRate = 0.085; // 8.5%
  const tenureMonths = 240; // 20 years
  const r = interestRate / 12;
  const emi = (loanAmount * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  const emiBurden = ((emi / result.salaryWithIncrement) * 100).toFixed(0);

  const RealEstateCard = (
        <div className="bg-[#151516] border border-white/10 rounded-3xl p-6 relative overflow-hidden h-full group">
             {/* Backdrop Emoji - Left */}
             <div className="absolute -left-2 -bottom-4 text-[6rem] opacity-[0.04] grayscale pointer-events-none select-none group-hover:scale-105 transition-transform">
                🏠
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">Real Estate Affordability</h3>
                <div className="flex flex-col items-end">
                    <span className="text-xs bg-zinc-800 text-white px-2 py-1 rounded shadow-md mb-1">{result.selectedCity.name}</span>
                    {liveRealEstatePrice && <span className="text-[9px] text-green-400 font-bold bg-green-900/30 px-1 rounded animate-pulse">LIVE RATES</span>}
                </div>
            </div>
            
            <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                    <div>
                        <span className="text-[10px] text-zinc-500 block">Purchasable/Yr</span>
                        <span className={`block font-bold text-lg ${silverTextClass}`}>{realEstateAffordabilityNow.toFixed(0)} sqft</span>
                    </div>
                     <div className="text-right">
                         <span className="text-[10px] text-zinc-500 block">Diff since {result.originalYear}</span>
                         {realEstateAffordabilityNow < result.sqftAffordabilityOriginal ? (
                            <span className="text-sm font-bold text-red-400">
                                {((result.sqftAffordabilityOriginal - realEstateAffordabilityNow)/result.sqftAffordabilityOriginal * 100).toFixed(0)}% Harder 📉
                            </span>
                        ) : (
                            <span className="text-sm font-bold text-emerald-400">Easier! 📈</span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg">
                        <span className="text-xs text-zinc-400">Years to buy 2BHK (1000 sqft)</span>
                        <span className="text-sm font-bold text-white">{yearsToBuyHome} Years</span>
                    </div>
                    <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg">
                         <span className="text-xs text-zinc-400">EMI Burden (Today)</span>
                         <span className={`text-sm font-bold ${Number(emiBurden) > 40 ? 'text-red-400' : 'text-emerald-400'}`}>
                             {emiBurden}% of Salary
                         </span>
                    </div>
                </div>

                {!liveRealEstatePrice && (
                    <button 
                        onClick={handleCheckLiveRealEstate}
                        disabled={isCheckingRealEstate}
                        className="w-full mt-2 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-bold transition-all flex items-center justify-center gap-2"
                    >
                        {isCheckingRealEstate ? (
                            <>
                                <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                                Checking...
                            </>
                        ) : (
                            <>
                                🔎 Check Live Rates
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    // New Metrics for Tax Card
    const effectiveTaxRate = ((result.taxNow / result.salaryWithIncrement) * 100).toFixed(1);
    const taxFreedomDay = Math.round((result.taxNow / result.salaryWithIncrement) * 365);
    const date = new Date(new Date().getFullYear(), 0, taxFreedomDay);
    const freedomDateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const TaxCard = (
         <div className="bg-[#151516] border border-red-500/10 rounded-3xl p-6 relative overflow-hidden h-full group">
            {/* Backdrop Emoji - Left */}
            <div className="absolute -left-4 -bottom-4 text-[6rem] opacity-[0.04] grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform">
                🏛️
            </div>

            <h3 className="text-red-400/80 text-xs font-bold uppercase tracking-widest mb-4 relative z-10 drop-shadow-[0_0_8px_rgba(248,113,113,0.2)]">
                The Tax Reality
            </h3>
            
            <div className="space-y-4 relative z-10">
                 <div className="grid grid-cols-2 gap-2">
                     <div className="bg-red-900/10 border border-red-500/20 p-3 rounded-xl">
                         <p className="text-[10px] text-red-300 mb-1">Tax Then</p>
                         <p className="text-lg font-bold text-white">{formatCompact(result.taxOriginal)}</p>
                     </div>
                     <div className="bg-red-900/10 border border-red-500/20 p-3 rounded-xl">
                         <p className="text-[10px] text-red-300 mb-1">Tax Now</p>
                         <p className="text-lg font-bold text-white">{formatCompact(result.taxNow)}</p>
                     </div>
                 </div>
                 
                 <div className="space-y-2 pt-2">
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-zinc-400">Effective Tax Rate</span>
                        <span className="text-sm font-bold text-white">{effectiveTaxRate}%</span>
                     </div>
                     <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                         <div className="bg-red-500 h-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" style={{ width: `${Math.min(Number(effectiveTaxRate) * 2, 100)}%` }}></div>
                     </div>
                 </div>

                 <div className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                     <div className="text-2xl">📅</div>
                     <div>
                         <p className="text-[10px] text-zinc-500 uppercase font-bold">Tax Freedom Day</p>
                         <p className="text-xs text-zinc-300 leading-tight">
                             You work for the government until <span className="text-white font-bold">{freedomDateStr}</span> every year.
                         </p>
                     </div>
                 </div>
            </div>
         </div>
    );

  const ChartCard = (
      <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 h-[400px] w-full relative overflow-hidden">
        {/* Backdrop Emoji - Centered but subtle */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] opacity-[0.01] pointer-events-none select-none">
            📉
        </div>

        <h4 className="text-zinc-400 text-base font-medium mb-6 relative z-10 drop-shadow-md">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="#525252" 
                tick={{fontSize: 12, fill: '#737373'}} 
                tickMargin={15}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                hide={true} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#a1a1aa' }}/>
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Your Income"
                stroke="#fff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="value2" 
                name="Required Income" 
                stroke="#71717a" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorRequired)" 
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

  const MobileAboutCard = (
      <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 relative overflow-hidden h-full flex flex-col items-center justify-center text-center group">
         {/* Glow Effect */}
         <div className="absolute top-[-50%] right-[-50%] w-60 h-60 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

         <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
             <ZazzyPuppy mood="happy" className="w-32 h-32" />
         </div>

         <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
            RupeeRewind
         </h2>
         <p className="text-zinc-500 text-sm mb-8 leading-relaxed px-2 font-medium">
            Helping India visualize the true value of money. <br/>
            <span className="text-blue-500/80 italic text-xs">Guided by Zazzy 🐾</span>
         </p>

         <div className="w-full bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-white/5 p-4 mb-6 relative">
            <div className="relative flex items-center justify-center gap-4">
               <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center border border-white/10 shadow-inner">
                 <span className="text-xl">👨‍💻</span>
               </div>
               <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest block mb-0.5">Concept by</span>
                  <h3 className="text-zinc-200 font-bold text-sm">Nikshep Doggalli</h3>
               </div>
            </div>
         </div>

         <a 
            href="https://instagram.com/nikkk.exe" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-black hover:bg-zinc-900 border border-zinc-800 transition-all duration-300 rounded-xl py-3 px-6 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <span className="text-zinc-300 font-medium text-xs">Connect on Instagram</span>
          </a>
      </div>
  );

  return (
    <>
       {/* Receipt Hidden from View */}
       <Receipt ref={receiptRef} result={result} />

       {/* --- TABLET/DESKTOP VIEW --- */}
       <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-min">
            <div className="md:col-span-2">
                {SummaryCard}
            </div>
            
            {/* Asset Comparator in 2nd position */}
            <div className="md:col-span-2">
                <AssetComparator yearThen={result.originalYear} yearNow={result.targetYear} />
            </div>

            {ChartCard}
            
            <div className="space-y-8">
                {CashErosionCard}
                {GoldCard}
            </div>

            <div className="md:col-span-2">
                <CommodityTicker 
                    salaryThen={result.originalAmount} 
                    salaryNow={result.salaryWithIncrement} 
                    yearThen={result.originalYear}
                    yearNow={result.targetYear}
                />
            </div>

            {MissedFortuneCard}
            
            <div className="grid grid-rows-2 gap-8 h-full">
                {RealEstateCard}
                {TaxCard}
            </div>

            <div className="md:col-span-2">
               <AIAnalysis state={aiState} analysisText={aiText} onGenerate={onGenerateAI} />
            </div>
       </div>

       {/* --- MOBILE VIEW (Stories) --- */}
       <div className="block md:hidden h-[700px]">
           <MobileStoryContainer>
               {SummaryCard}
               {/* Asset Comparator in 2nd position */}
               <AssetComparator yearThen={result.originalYear} yearNow={result.targetYear} />
               
               {ChartCard}
               
               {CashErosionCard}
               {GoldCard}

               <CommodityTicker 
                    salaryThen={result.originalAmount} 
                    salaryNow={result.salaryWithIncrement} 
                    yearThen={result.originalYear}
                    yearNow={result.targetYear}
               />
               
               {MissedFortuneCard}
               {RealEstateCard}
               {TaxCard}
               
               {/* Last Card is About Section + AI Button + Future CTA */}
               <div className="flex flex-col h-full">
                    <div className="flex-1 mb-4 overflow-y-auto">
                        {MobileAboutCard}
                    </div>
                    
                    {/* Future Prediction Call To Action */}
                    <div className="mt-2 mb-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 p-4 rounded-2xl mx-2 relative z-50">
                        <p className="text-xs text-zinc-300 mb-2 font-medium text-center">Curious about your future wealth?</p>
                        <button
                            onClick={() => onSwitchMode && onSwitchMode(AppMode.FUTURE)}
                            className="w-full py-3 bg-white text-black font-bold text-xs rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 transform active:scale-95 transition-transform"
                        >
                            🔮 Try Future Prediction
                        </button>
                    </div>

                    <div className="pb-20">
                         <AIAnalysis state={aiState} analysisText={aiText} onGenerate={onGenerateAI} />
                    </div>
               </div>
           </MobileStoryContainer>
       </div>
    </>
  );
};

export default ResultView;
