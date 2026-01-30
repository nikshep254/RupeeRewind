
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FuturePredictionResult, ChartDataPoint, AIAnalysisState } from '../types';
import InfoTooltip from './InfoTooltip';
import MobileStoryContainer from './MobileStoryContainer';
import AIAnalysis from './AIAnalysis';

interface FutureResultViewProps {
  result: FuturePredictionResult;
  chartData: ChartDataPoint[];
  aiState: AIAnalysisState;
  aiText: string;
  onGenerateAI: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const nominal = payload.find((p: any) => p.name.includes('Nominal'))?.value || 0;
    const real = payload.find((p: any) => p.name.includes('Real'))?.value || 0;
    const gap = nominal - real;

    return (
      <div className="bg-[#1c1c1e] border border-zinc-800 p-4 rounded-xl shadow-2xl min-w-[200px]">
        <p className="text-zinc-400 text-xs uppercase font-bold mb-3 tracking-wider drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{label}</p>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-zinc-300">{entry.name}</span>
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
                    <span className="text-zinc-400">Inflation Loss</span>
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

const FutureResultView: React.FC<FutureResultViewProps> = ({ result, chartData, aiState, aiText, onGenerateAI }) => {
  const currentYear = new Date().getFullYear();
  const futureYear = currentYear + result.years;

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

  const isWinning = result.futureRealAmount > result.currentAmount;
  const realGrowthPercentage = ((result.futureRealAmount - result.currentAmount) / result.currentAmount) * 100;
  const goalGap = result.goalComparison.costFuture - result.goalComparison.costToday;

  // Shared Styles
  const labelClass = "text-zinc-400 text-xs uppercase tracking-widest font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]";
  const subLabelClass = "text-zinc-400 text-xs uppercase tracking-wider mb-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]";

  // --- COMPONENT BLOCKS FOR REUSE ---

  const MainProjectionCard = (
      <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 relative overflow-hidden w-full group">
        {/* Backdrop Emoji - Left */}
        <div className="absolute -left-8 -bottom-10 text-[10rem] opacity-5 grayscale pointer-events-none select-none group-hover:scale-110 transition-transform duration-700">
            📈
        </div>

        <h3 className={labelClass + " mb-3 relative z-10"}>
          Projected Monthly Income (Nominal)
        </h3>
        <div className="flex items-baseline gap-2 mb-2 relative z-10">
          <span className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
            {formatCurrency(result.futureNominalAmount)}
          </span>
        </div>
        <p className="text-zinc-400 text-base mb-8 relative z-10">
          The number on your paycheck in {futureYear}.
        </p>
        
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
          <div>
            <span className={`block ${subLabelClass}`}>Real Value (Today's Terms)</span>
            <span className={`text-2xl font-bold ${isWinning ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg`}>
              {formatCurrency(result.futureRealAmount)}
            </span>
            <p className="text-xs text-zinc-500 mt-1">Adjusted for {result.projectedInflationRate}% inflation</p>
          </div>
          <div>
            <span className={`block ${subLabelClass}`}>Effective Real Growth</span>
             <span className={`text-2xl font-bold ${realGrowthPercentage >= 0 ? 'text-emerald-400' : 'text-red-400'} drop-shadow-lg`}>
               {realGrowthPercentage > 0 ? '+' : ''}{realGrowthPercentage.toFixed(1)}%
            </span>
             <p className="text-xs text-zinc-500 mt-1">
               {realGrowthPercentage < 0 
                ? "You are effectively losing money." 
                : "You are beating inflation."}
             </p>
          </div>
        </div>
      </div>
  );

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
                 <p className="text-zinc-400 text-xs font-medium mb-1">Cost Today</p>
                 <p className="text-xl font-bold text-zinc-300">{formatCompact(result.goalComparison.costToday)}</p>
             </div>
             <div className="text-zinc-600 text-2xl">→</div>
             <div className="text-right">
                 <p className="text-zinc-400 text-xs font-medium mb-1">Cost in {result.years} Years</p>
                 <p className="text-3xl font-black text-purple-400 drop-shadow-lg">{formatCompact(result.goalComparison.costFuture)}</p>
             </div>
         </div>
         
         <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20 text-center relative z-10">
             <p className="text-purple-300 text-sm font-medium">
                 You need an extra <span className="font-bold text-white">{formatCompact(goalGap)}</span> just to cover inflation!
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

          <h3 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)] relative z-10">
             Lazy vs Smart Wealth <InfoTooltip text="Projected wealth if you save 20% of your income monthly."/>
          </h3>
          
          <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="bg-zinc-900/80 backdrop-blur-sm p-5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🐢</span>
                      <span className="text-zinc-300 text-sm font-bold">Lazy (FD/Bank)</span>
                  </div>
                  <p className="text-2xl font-bold text-zinc-300">{formatCompact(result.wealthLazy)}</p>
                  <p className="text-[10px] text-zinc-500 mt-1">@ 6% Return</p>
              </div>
              
              <div className="bg-blue-900/10 backdrop-blur-sm p-5 rounded-2xl border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🚀</span>
                      <span className="text-white text-sm font-bold">Smart (SIP/Nifty)</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 drop-shadow-md">{formatCompact(result.wealthSmart)}</p>
                  <p className="text-[10px] text-blue-300/70 mt-1">@ 12% Return</p>
              </div>
          </div>
          
          <div className="mt-4 text-center relative z-10">
              <p className="text-zinc-400 text-xs">
                  Difference: <span className="text-white font-bold glow-sm">{formatCompact(result.wealthSmart - result.wealthLazy)}</span> gained by being smart!
              </p>
          </div>
      </div>
  );

  const TaxAndLivingCard = (
      <div className="flex flex-col gap-6 w-full">
        {/* Taxman */}
        <div className="bg-[#151516] border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group">
             {/* Backdrop Emoji - Left */}
             <div className="absolute -left-6 -bottom-6 text-[8rem] opacity-10 grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform duration-700">
                💸
             </div>

             <h3 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)] relative z-10">The Taxman Warning</h3>
             <div className="flex flex-col sm:flex-row items-end gap-4 justify-between relative z-10">
                 <div className="w-full">
                     <p className="text-zinc-400 text-sm mb-1 font-medium drop-shadow-sm">Projected Monthly Tax in {futureYear}</p>
                     <p className="text-3xl font-black text-white drop-shadow-lg">{formatCurrency(result.futureTax)}</p>
                     <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
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
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                 {result.futureItemPrices.map((item, idx) => (
                     <div key={idx} className="bg-zinc-900/50 rounded-xl p-3 text-center border border-white/5 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors">
                         <div className="text-2xl mb-1">{item.emoji}</div>
                         <div className="text-xs text-zinc-400 mb-1 font-medium">{item.name}</div>
                         <div className="text-sm font-bold text-white drop-shadow-sm">₹{item.price}</div>
                     </div>
                 ))}
             </div>
        </div>
      </div>
  );

  const ChartCard = (
      <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 h-[400px] w-full">
        <h4 className="text-zinc-300 text-base font-medium mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          Gap: Paycheck vs Purchasing Power
        </h4>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
        {/* --- TABLET/DESKTOP VIEW --- */}
        <div className="hidden md:block space-y-8">
            {MainProjectionCard}
            {DreamGoalCard}
            {WealthCard}
            {TaxAndLivingCard}
            {ChartCard}
            <AIAnalysis state={aiState} analysisText={aiText} onGenerate={onGenerateAI} />
        </div>

        {/* --- MOBILE VIEW (Stories) --- */}
        <div className="block md:hidden h-[680px]">
            <MobileStoryContainer>
                {MainProjectionCard}
                {DreamGoalCard}
                {WealthCard}
                {TaxAndLivingCard}
                {ChartCard}
                <AIAnalysis state={aiState} analysisText={aiText} onGenerate={onGenerateAI} />
            </MobileStoryContainer>
        </div>
    </>
  );
};

export default FutureResultView;
