
import React, { useState, useEffect } from 'react';
import { CATEGORY_INFLATION_RATES } from '../constants';

const PersonalInflationView: React.FC = () => {
  const [expenses, setExpenses] = useState({
    food: 30,
    rent: 30,
    travel: 15,
    medical: 5,
    lifestyle: 20
  });

  const [personalRate, setPersonalRate] = useState(0);

  const total = Object.values(expenses).reduce((a: number, b: number) => a + b, 0);

  useEffect(() => {
    // Weighted Average Calculation
    const weightedSum = 
      (expenses.food * CATEGORY_INFLATION_RATES.food) +
      (expenses.rent * CATEGORY_INFLATION_RATES.rent) +
      (expenses.travel * CATEGORY_INFLATION_RATES.travel) +
      (expenses.medical * CATEGORY_INFLATION_RATES.medical) +
      (expenses.lifestyle * CATEGORY_INFLATION_RATES.lifestyle);
    
    setPersonalRate(weightedSum / 100);
  }, [expenses]);

  const handleSliderChange = (key: keyof typeof expenses, value: number) => {
    setExpenses(prev => ({ ...prev, [key]: value }));
  };

  const nationalAvg = 6.0;
  const diff = personalRate - nationalAvg;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-xl transition-colors duration-300">
          <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Your Personal Inflation Rate</h2>
              <p className="text-zinc-500 dark:text-zinc-300">Government data is generic. Your lifestyle dictates your reality.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Score Circle */}
              <div className="relative w-64 h-64 flex-shrink-0">
                   <div className="absolute inset-0 rounded-full border-[12px] border-zinc-100 dark:border-white/5"></div>
                   <div 
                      className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-blue-500 border-r-blue-500 transition-all duration-1000"
                      style={{ transform: `rotate(${(personalRate / 15) * 360}deg)` }}
                   ></div>
                   
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter">
                           {personalRate.toFixed(1)}<span className="text-2xl">%</span>
                       </span>
                       <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-400 mt-2">Personal Rate</span>
                   </div>
              </div>

              {/* Comparison */}
              <div className="flex-1 w-full space-y-6">
                  <div className="bg-zinc-50 dark:bg-white/5 p-6 rounded-2xl border border-zinc-200 dark:border-white/5">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-300">National Average</span>
                          <span className="text-lg font-bold text-zinc-700 dark:text-zinc-200">{nationalAvg}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-300">Your Gap</span>
                          <span className={`text-xl font-black ${diff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                          </span>
                      </div>
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-4">
                          {diff > 0 
                            ? "Your lifestyle costs are rising faster than the average Indian's." 
                            : "You are relatively insulated from high inflation sectors."}
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* Sliders */}
      <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-xl transition-colors duration-300">
          <h3 className="text-lg font-bold mb-6 text-zinc-800 dark:text-zinc-200">Adjust Your Expense Basket (Total: {total}%)</h3>
          
          <div className="space-y-6">
              {[
                  { key: 'food', label: 'Food & Dining', emoji: '🍔', rate: CATEGORY_INFLATION_RATES.food },
                  { key: 'rent', label: 'Rent / EMI', emoji: '🏠', rate: CATEGORY_INFLATION_RATES.rent },
                  { key: 'travel', label: 'Travel & Fuel', emoji: '⛽️', rate: CATEGORY_INFLATION_RATES.travel },
                  { key: 'medical', label: 'Healthcare', emoji: '💊', rate: CATEGORY_INFLATION_RATES.medical },
                  { key: 'lifestyle', label: 'Lifestyle & Fun', emoji: '🎉', rate: CATEGORY_INFLATION_RATES.lifestyle },
              ].map((cat) => (
                  <div key={cat.key}>
                      <div className="flex justify-between mb-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                              <span>{cat.emoji}</span> {cat.label} 
                              <span className="text-xs bg-zinc-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-zinc-500 dark:text-zinc-400">Rate: {cat.rate}%</span>
                          </label>
                          <span className="font-bold text-zinc-900 dark:text-white">{(expenses as any)[cat.key]}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={(expenses as any)[cat.key]} 
                        onChange={(e) => handleSliderChange(cat.key as keyof typeof expenses, Number(e.target.value))}
                        className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                  </div>
              ))}
          </div>
          
          {total !== 100 && (
              <div className="mt-6 p-3 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold text-center rounded-xl animate-pulse">
                  Total must be 100% (Current: {total}%)
              </div>
          )}
      </div>

    </div>
  );
};

export default PersonalInflationView;
