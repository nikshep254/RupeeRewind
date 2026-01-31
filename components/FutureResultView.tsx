
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FuturePredictionResult, ChartDataPoint } from '../types';
import MobileStoryContainer from './MobileStoryContainer';
import AnimatedCounter from './AnimatedCounter'; 
import AboutCard from './AboutCard';
import GuidePopup from './GuidePopup';

interface FutureResultViewProps {
  result: FuturePredictionResult;
  chartData: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const nominal = payload.find((p: any) => p.name.includes('Nominal'))?.value || 0;
    const real = payload.find((p: any) => p.name.includes('Real'))?.value || 0;
    const gap = nominal - real;

    return (
      <div className="bg-[#1c1c1e] border border-zinc-800 p-4 rounded-xl shadow-2xl min-w-[200px]">
        <p className="text-zinc-300 text-xs uppercase font-bold mb-3 tracking-wider drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{label}</p>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-zinc-200">{entry.name}</span>
                 </div>
                 <span className="text-sm font-semibold text-white tabular-nums">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(entry.value)}
                 </span>
              </div>
            </div>
          ))}
          {nominal > 0 && real > 0 && (
            <div className="pt-2 mt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300">Inflation Loss</span>
                    <span className="text-red-400 font-medium">
                        -{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(gap)}
                    </span>
                </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const FutureResultView: React.FC<FutureResultViewProps> = ({ result, chartData }) => {
  const [shockMode, setShockMode] = useState(false);
  const [showShockGuide, setShowShockGuide] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const futureYear = currentYear + result.years;

  const inflationRateUsed = shockMode ? 12.0 : result.projectedInflationRate;

  useEffect(() => {
    // Show the guide popup after a short delay to ensure user sees the interface first
    const timer = setTimeout(() => {
        setShowShockGuide(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleShockMode = () => {
      setShockMode(!shockMode);
      if (showShockGuide) {
          setShowShockGuide(false);
      }
  };

  // Recalculate basic metrics for Shock Mode display
  const futureRealAmountShock = Math.round(result.futureNominalAmount / Math.pow(1 + inflationRateUsed / 100, result.years));
  const goalFutureShock = result.goalComparison.costToday * Math.pow(1 + inflationRateUsed / 100, result.years);
  
  const displayRealAmount = shockMode ? futureRealAmountShock : result.futureRealAmount;
  const displayGoalFuture = shockMode ? Math.round(goalFutureShock) : result.goalComparison.costFuture;

  // Recalculate Chart Data for Shock Mode
  const displayChartData = shockMode ? chartData.map(pt => ({
      ...pt,
      value2: Math.round(pt.value / Math.pow(1 + inflationRateUsed / 100, pt.year - currentYear))
  })) : chartData;


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

  const isWinning = displayRealAmount > result.currentAmount;
  const realGrowthPercentage = ((displayRealAmount - result.currentAmount) / result.currentAmount) * 100;
  const goalGap = displayGoalFuture - result.goalComparison.costToday;

  // Shared Styles
  const labelClass = "text-zinc-300 text-xs uppercase tracking-widest font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]";
  const subLabelClass = "text-zinc-400 text-[14px] font-medium uppercase tracking-wider mb-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]";

  // --- COMPONENT BLOCKS FOR REUSE ---

  const MainProjectionCard = (
      <div className={`bg-[#151516] border transition-all duration-500 rounded-3xl p-8 relative overflow-hidden w-full group ${shockMode ? 'border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-white/10'}`}>
        {/* Backdrop Emoji - Left */}
        <div className="absolute -left-8 -bottom-10 text-[10rem] opacity-5 grayscale pointer-events-none select-none group-hover:scale-110 transition-transform duration-700">
            {shockMode ? '😱' : '📈'}
        </div>

        <div className="flex justify-between items-start mb-3 relative z-10">
             <h3 className={labelClass}>
                Projected Monthly Income (Nominal)
             </h3>
             <button 
                onClick={toggleShockMode}
                className={`text-[14px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider transition-all cursor-pointer z-50 ${shockMode ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
             >
                {shockMode ? '⚡ Shock Mode ON' : '⚠️ Test Shock'}
             </button>
        </div>

        <div className="flex items-baseline gap-2 mb-2 relative z-10">
          <span className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
            <AnimatedCounter value={result.futureNominalAmount} formatFn={formatCurrency} />
          </span>
        </div>
        <p className="text-zinc-200 text-base mb-8 relative z-10">
          The number on your paycheck in {futureYear}.
        </p>
        
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
          <div>
            <span className={`block ${subLabelClass}`}>Real Value (Today's Terms)</span>
            <span className={`text-2xl font-bold ${isWinning ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg`}>
              <AnimatedCounter value={displayRealAmount} formatFn={formatCurrency} />
            </span>
            <p className="text-xs text-zinc-300 mt-1">Adjusted for <span className={shockMode ? 'text-red-500 font-bold' : ''}>{inflationRateUsed}%</span> inflation</p>
          </div>
          <div>
            <span className={`block ${subLabelClass}`}>Effective Real Growth</span>
             <span className={`text-2xl font-bold ${realGrowthPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg`}>
               {realGrowthPercentage > 0 ? '+' : ''}{realGrowthPercentage.toFixed(1)}%
            </span>
             <p className="text-xs text-zinc-300 mt-1">
               {realGrowthPercentage < 0 
                ? "You are effectively losing money." 
                : "You are beating inflation."}
             </p>
          </div>
        </div>
      </div>
  );

  const IllusionCard = () => {
      const croreToday = 10000000;
      // Reverse calculate: what 1 crore in future is worth today
      const realValueCrore = croreToday / Math.pow(1 + inflationRateUsed / 100, result.years);
      
      return (
        <div className="bg-[#1c1c1e] border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden w-full group">
             <div className="absolute -right-6 -top-6 text-[8rem] opacity-5 grayscale pointer-events-none select-none">🏆</div>
             
             <h3 className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">The "1 Crore" Illusion</h3>
             <p className={subLabelClass + " mb-6"}>Why becoming a 'Crorepati' won't feel special</p>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <p className="text-zinc-300 text-[10px] uppercase font-bold mb-1">Having ₹1 Crore in {futureYear}</p>
                     <p className="text-zinc-400 text-xs">Is purchasing power equivalent to having only...</p>
                 </div>
                 <div className="text-right">
                     <p className="text-3xl font-black text-white"><AnimatedCounter value={realValueCrore} formatFn={formatCompact}/></p>
                     <p className="text-xs text-zinc-300 mt-1">today.</p>
                 </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-white/5">
                 <p className="text-xs text-zinc-300 text-center italic">
                     To feel like a millionaire of today, you'll need <span className="text-amber-400 font-bold">{formatCompact(croreToday * Math.pow(1 + inflationRateUsed / 100, result.years))}</span> in {futureYear}.
                 </p>
             </div>
        </div>
      );
  };

  const DreamGoalCard = (
      <div className="bg-[#1c1c1e] border border-purple-500/20 rounded-3xl p-8 relative overflow-hidden w-full group">
         {/* Backdrop Emoji - Left */}
         <div className="absolute -left-6 -bottom-6 text-[8rem] opacity-5 grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform duration-700">
             🏠
         </div>

         <div className="flex items-center gap-3 mb-6 relative z-10">
             <div className="text-3xl">🏠</div>
             <div>
                 <h3 className="text-purple-400 text-xs font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]">Dream Goal Reality Check</h3>
                 <p className="text-white font-bold text-lg">{result.goalComparison.label}</p>
             </div>
         </div>
         
         <div className="flex justify-between items-center mb-4 relative z-10">
             <div>
                 <p className="text-zinc-300 text-xs font-medium mb-1">Cost Today</p>
                 <p className="text-xl font-bold text-zinc-200">{formatCompact(result.goalComparison.costToday)}</p>
             </div>
             <div className="text-zinc-500 text-2xl">→</div>
             <div className="text-right">
                 <p className="text-zinc-300 text-xs font-medium mb-1">Cost in {result.years} Years</p>
                 <p className="text-3xl font-black text-purple-400 drop-shadow-lg">
                    <AnimatedCounter value={displayGoalFuture} formatFn={formatCompact} />
                 </p>
             </div>
         </div>
         
         <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20 text-center relative z-10">
             <p className="text-purple-200 text-sm font-medium">
                 You need an extra <span className="font-bold text-white"><AnimatedCounter value={goalGap} formatFn={formatCompact} /></span> just to cover inflation!
             </p>
         </div>
      </div>
  );

  const WealthCard = (
      <div className="bg-[#151516] border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden w-full group">
          {/* Backdrop Emoji - Left */}
          <div className="absolute -left-10 -bottom-10 text-[10rem] opacity-5 grayscale pointer-events-none select-none group-hover:scale-110 transition-transform duration-700">
             💰
          </div>

          <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)] relative z-10">
             Lazy vs Smart Wealth 
          </h3>
          <p className={subLabelClass + " mb-6 relative z-10"}>Projected wealth if you save 20% of monthly income</p>
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="bg-zinc-900/80 backdrop-blur-sm p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🐢</span>
                      <span className="text-zinc-200 text-sm font-bold">Lazy (FD/Bank)</span>
                  </div>
                  <p className="text-2xl font-bold text-zinc-200">
                     <AnimatedCounter value={result.wealthLazy} formatFn={formatCompact} />
                  </p>
                  <p className="text-[14px] text-zinc-400 mt-1">@ 6% Return</p>
              </div>
              
              <div className="bg-blue-900/10 backdrop-blur-sm p-5 rounded-2xl border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🚀</span>
                      <span className="text-white text-sm font-bold">Smart (SIP/Nifty)</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 drop-shadow-md">
                    <AnimatedCounter value={result.wealthSmart} formatFn={formatCompact} />
                  </p>
                  <p className="text-[14px] text-blue-300/70 mt-1">@ 12% Return</p>
              </div>
          </div>
          
          <div className="mt-4 text-center relative z-10">
              <p className="text-zinc-300 text-xs">
                  Difference: <span className="text-white font-bold glow-sm"><AnimatedCounter value={result.wealthSmart - result.wealthLazy} formatFn={formatCompact} /></span> gained by being smart!
              </p>
          </div>
      </div>
  );

  const TaxAndLivingCard = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        let animationId: number;
        const scroll = () => {
        if (!isPaused) {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                container.scrollLeft = 0;
            } else {
                container.scrollLeft += 0.5;
            }
        }
        animationId = requestAnimationFrame(scroll);
        };
        animationId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationId);
    }, [isPaused]);

    // Duplicate for smooth loop
    const displayItems = [...result.futureItemPrices, ...result.futureItemPrices, ...result.futureItemPrices];

    return (
      <div className="flex flex-col gap-6 w-full">
        {/* Taxman */}
        <div className="bg-[#151516] border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group">
             {/* Backdrop Emoji - Left */}
             <div className="absolute -left-6 -bottom-6 text-[10rem] opacity-10 grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform duration-700">
                💸
             </div>

             <h3 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)] relative z-10">The Taxman Warning</h3>
             <div className="flex flex-col sm:flex-row items-end gap-4 justify-between relative z-10">
                 <div className="w-full">
                     <p className="text-zinc-300 text-sm mb-1 font-medium drop-shadow-sm">Projected Monthly Tax in {futureYear}</p>
                     <p className="text-3xl font-black text-white drop-shadow-lg">
                        <AnimatedCounter value={result.futureTax} formatFn={formatCurrency} />
                     </p>
                     <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                         Your income grows, but so does your tax bracket.
                     </p>
                 </div>
             </div>
        </div>
        
        {/* Cost of Living */}
        <div className="bg-[#151516] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
             {/* Backdrop Emoji - Left */}
              <div className="absolute -left-2 -bottom-4 text-[6rem] opacity-5 grayscale pointer-events-none select-none">
                🏷️
             </div>
             
             <h3 className={labelClass + " mb-4 relative z-10"}>Future Price Check</h3>
             
             <div 
                ref={scrollRef}
                className="flex overflow-x-auto pb-4 scrollbar-hide w-full cursor-grab active:cursor-grabbing relative z-10"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
             >
                <div className="flex gap-4 w-max">
                    {displayItems.map((item, idx) => (
                        <div key={`${item.name}-${idx}`} className="bg-zinc-900/50 rounded-xl p-3 min-w-[120px] text-center border border-white/5 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors shrink-0">
                            <div className="text-2xl mb-1">{item.emoji}</div>
                            <div className="text-xs text-zinc-400 mb-1 font-medium whitespace-nowrap">{item.name}</div>
                            <div className="text-sm font-bold text-white drop-shadow-sm">₹{shockMode ? Math.round(item.price * Math.pow(1.12/1.06, result.years)) : item.price}</div>
                        </div>
                    ))}
                </div>
             </div>
        </div>
      </div>
    );
  };

  const ChartCard = (
      <div className={`bg-[#151516] border rounded-3xl p-8 h-[400px] w-full transition-all duration-500 ${shockMode ? 'border-red-900/30' : 'border-white/10'}`}>
        <h4 className="text-zinc-200 text-base font-medium mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          Gap: Paycheck vs Purchasing Power {shockMode && <span className="text-red-500 font-bold ml-2">(SHOCK MODE)</span>}
        </h4>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayChartData}>
              <defs>
                <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isWinning ? "#10b981" : "#ef4444"} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={isWinning ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="#525252" 
                tick={{fontSize: 12, fill: '#a1a1aa'}} 
                tickMargin={15}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                hide={true} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', color: '#d4d4d8' }}/>
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Nominal (Paycheck)"
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorNominal)" 
                animationDuration={1500}
              />
               <Area 
                type="monotone" 
                dataKey="value2" 
                name="Real (Adjusted)"
                stroke={isWinning ? "#10b981" : "#ef4444"} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorReal)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
  );

  return (
    <>
        {showShockGuide && (
            <GuidePopup
                title="Ready for a scare? 👻"
                message={<span>Click the <strong className="text-red-500">Test Shock</strong> button to see what happens if inflation hits <strong className="text-white">12%</strong>!</span>}
                onDismiss={() => setShowShockGuide(false)}
            />
        )}

        {/* --- TABLET/DESKTOP VIEW --- */}
        <div className="hidden md:block space-y-8">
            {MainProjectionCard}
            <IllusionCard />
            {DreamGoalCard}
            {WealthCard}
            <TaxAndLivingCard />
            {ChartCard}
            <AboutCard />
        </div>

        {/* --- MOBILE VIEW (Stories) --- */}
        <div className="block md:hidden h-[680px]">
            <MobileStoryContainer>
                {MainProjectionCard}
                <IllusionCard />
                {DreamGoalCard}
                {WealthCard}
                <TaxAndLivingCard />
                {ChartCard}
                <AboutCard />
            </MobileStoryContainer>
        </div>
    </>
  );
};

export default FutureResultView;
