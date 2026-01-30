
import React, { useState } from 'react';
import { PROJECTED_INFLATION_RATE } from '../constants';

interface FutureInputProps {
  onCalculate: (currentAmount: number, growthRate: number, inflationRate: number, years: number) => void;
  isCalculating: boolean;
}

const FutureInput: React.FC<FutureInputProps> = ({ onCalculate, isCalculating }) => {
  const [amount, setAmount] = useState<string>('100000');
  const [growthRate, setGrowthRate] = useState<string>('10');
  const [inflationRate, setInflationRate] = useState<string>(PROJECTED_INFLATION_RATE.toString());
  const [years, setYears] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    const numGrowth = parseFloat(growthRate);
    const numInflation = parseFloat(inflationRate);
    
    if (!isNaN(numAmount) && !isNaN(numGrowth) && !isNaN(numInflation)) {
      onCalculate(numAmount, numGrowth, numInflation, years);
    }
  };

  return (
    <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="current-amount" className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            How much money do you have in your piggy bank right now?
            <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">Current Monthly Income (INR)</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-zinc-500 font-semibold text-lg">₹</span>
            </div>
            <input
              type="number"
              id="current-amount"
              min="1000"
              step="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full bg-[#252527] border border-transparent text-white text-lg py-4 pl-10 pr-4 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 focus:outline-none placeholder-zinc-600 transition-all hover:bg-[#2c2c2e]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <label htmlFor="growth-rate" className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Growth (%)
              <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">How much more money will you get next year?</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="growth-rate"
                min="0"
                max="100"
                step="0.5"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                className="block w-full bg-[#252527] border border-transparent text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 focus:outline-none placeholder-zinc-600 transition-all hover:bg-[#2c2c2e]"
                required
              />
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <span className="font-semibold text-lg">%</span>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="inflation-rate" className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Inflation (%)
              <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">How much more will toys cost next year?</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="inflation-rate"
                min="0"
                max="100"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="block w-full bg-[#252527] border border-transparent text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 focus:outline-none placeholder-zinc-600 transition-all hover:bg-[#2c2c2e]"
                required
              />
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                <span className="font-semibold text-lg">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Projection Period: <span className="text-white text-base inline ml-2">{years} Years</span>
            <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">How far into the future do you want to see?</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2.5 bg-[#252527] rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-2">
            <span>1 Year</span>
            <span>30 Years</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCalculating}
          className={`w-full mt-6 flex items-center justify-center py-4 px-6 rounded-full shadow-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 transition-all transform active:scale-[0.98] ${
            isCalculating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isCalculating ? 'Predicting...' : 'Predict Real Wealth'}
        </button>
      </form>
    </div>
  );
};

export default FutureInput;
