
import React from 'react';
import { GENZ_EXPENSES, SHRINKFLATION_ITEMS, POLITICIAN_CAGR, INFLUENCER_TIERS, BANGALORE_TRAFFIC_HOURS } from '../constants';
import AnimatedCounter from './AnimatedCounter';
import InfoTooltip from './InfoTooltip';

const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

// 1. Poverty Badge
export const PovertyBadge: React.FC<{ isRich: boolean, year: number, city: string }> = ({ isRich, year, city }) => {
    let badgeTitle = "";
    let badgeColor = "";
    let badgeEmoji = "";

    if (isRich) {
        badgeTitle = "Certified Wealthy";
        badgeColor = "bg-yellow-400 text-black border-yellow-500";
        badgeEmoji = "👑";
    } else {
        if (city === "Mumbai" || city === "Bangalore") {
             badgeTitle = `Officially Poor in ${city}`;
             badgeEmoji = "🍜";
        } else {
             badgeTitle = `Rich in ${year}, Broke Now`;
             badgeEmoji = "📉";
        }
        badgeColor = "bg-zinc-800 text-white border-zinc-600";
    }

    return (
        <div className={`rotate-3 inline-flex flex-col items-center justify-center px-6 py-4 rounded-xl border-4 border-double shadow-xl transform hover:scale-105 transition-transform ${badgeColor}`}>
            <span className="text-4xl mb-1">{badgeEmoji}</span>
            <span className="text-xs uppercase font-black tracking-widest">Badge of Honor</span>
            <span className="text-lg font-bold leading-tight text-center max-w-[150px]">{badgeTitle}</span>
        </div>
    );
};

// 2. Avocado Toast Toggle
export const AvocadoToastToggle: React.FC<{ isActive: boolean, onToggle: () => void }> = ({ isActive, onToggle }) => {
    const totalCost = GENZ_EXPENSES.reduce((acc, curr) => acc + curr.cost, 0);

    return (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <span className="text-3xl">🥑</span>
                <div>
                    <h4 className="text-sm font-bold text-green-800 dark:text-green-300">The "Avocado Toast" Filter</h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-300">Remove Gen-Z expenses (-{formatCurrency(totalCost)}) to see Boomer Wealth.</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${isActive ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
            >
                <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
};

// 3. Tech Deflation (iPhone) - Brightened Text
export const TechDeflation: React.FC<{ salaryThen: number, salaryNow: number }> = ({ salaryThen, salaryNow }) => {
    // Approx iPhone Prices
    const iphoneThen = 35000; // ~2010 era
    const iphoneNow = 140000; // ~2024 Pro Max
    
    const pctThen = (iphoneThen / salaryThen) * 100;
    const pctNow = (iphoneNow / salaryNow) * 100;

    return (
        <div className="bg-[#1c1c1e] border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group shadow-lg">
             <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                Tech Deflation
             </h3>
             
             <div className="flex items-center justify-between relative z-10 px-2">
                 <div className="text-center">
                     <span className="text-2xl mb-2 block">📱</span>
                     <p className="text-xs font-bold text-zinc-400 mb-1">2010</p>
                     <p className="text-xl font-black text-white">{pctThen.toFixed(0)}%</p>
                     <p className="text-[10px] text-zinc-400">of annual salary</p>
                 </div>
                 
                 <div className="text-zinc-500">→</div>

                 <div className="text-center">
                     <span className="text-2xl mb-2 block">🤳</span>
                     <p className="text-xs font-bold text-zinc-400 mb-1">NOW</p>
                     <p className="text-xl font-black text-white">{pctNow.toFixed(0)}%</p>
                     <p className="text-[10px] text-zinc-400">of annual salary</p>
                 </div>
             </div>

             <div className="mt-6 bg-zinc-800/50 p-3 rounded-xl border border-white/5 text-center">
                 <p className="text-xs font-medium text-zinc-200">
                     {pctNow > pctThen ? "Phones are eating more of your salary! 💸" : "Tech got cheaper (relative to you)! 📉"}
                 </p>
             </div>
        </div>
    );
};

// 4. The Traffic Tax - Brightened Text
export const TrafficCost: React.FC<{ salaryNow: number }> = ({ salaryNow }) => {
    const hourlyRate = salaryNow / (22 * 9); // 22 days, 9 hours
    const monthlyTrafficLoss = hourlyRate * BANGALORE_TRAFFIC_HOURS * 22;

    return (
        <div className="bg-[#1c1c1e] border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group shadow-lg flex flex-col justify-between">
             <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-widest mb-1">The Traffic Tax</h3>
                    <p className="text-[10px] text-zinc-400 uppercase font-bold">Monthly Loss in Traffic</p>
                 </div>
                 <div className="text-2xl opacity-50">🚦</div>
             </div>

             <div className="relative z-10">
                 <p className="text-3xl font-black text-red-500 tracking-tight">
                    {formatCurrency(monthlyTrafficLoss)}
                 </p>
                 <p className="text-xs text-zinc-300 mt-2 font-medium leading-relaxed">
                     Based on your hourly worth & {BANGALORE_TRAFFIC_HOURS}hrs/day commute.
                 </p>
             </div>
        </div>
    );
};

// 5. Gold Digger
export const GoldDigger: React.FC<{ yearThen: number }> = ({ yearThen }) => (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-lg">
        <div className="absolute -right-6 -bottom-6 text-[8rem] opacity-5 grayscale pointer-events-none select-none group-hover:rotate-12 transition-transform">⚱️</div>
        
        <h3 className="text-amber-600 dark:text-amber-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
            The Gold Digger Index
        </h3>
        <p className="text-zinc-500 dark:text-zinc-300 text-xs md:text-sm font-medium mb-4">Did your salary keep up with Gold?</p>
        
        <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-amber-100 dark:border-amber-500/10 backdrop-blur-sm">
                <p className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-300">Gold Price {yearThen}</p>
                <p className="text-xl md:text-2xl font-black text-amber-700 dark:text-amber-500">Cheap 📉</p>
            </div>
            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-amber-100 dark:border-amber-500/10 backdrop-blur-sm">
                <p className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-300">Gold Price Now</p>
                <p className="text-xl md:text-2xl font-black text-amber-700 dark:text-amber-500">Bonkers 🚀</p>
            </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-300 mt-4 italic">
            "If you had taken your salary in Gold coins, you'd be smiling now."
        </p>
    </div>
);
