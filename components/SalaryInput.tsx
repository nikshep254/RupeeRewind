
import React, { useState } from 'react';
import { INDIA_CII_DATA, CURRENT_YEAR, INFLATION_DOMAINS, INDIAN_CITIES } from '../constants';
import { CityTierMove, InflationDomain, CityInfo } from '../types';

interface SalaryInputProps {
  onCalculate: (
    amount: number, 
    year: number, 
    increment: number, 
    includeLifestyle: boolean,
    cityTier: CityTierMove,
    domain: InflationDomain,
    city: CityInfo
  ) => void;
  isCalculating: boolean;
}

const SalaryInput: React.FC<SalaryInputProps> = ({ onCalculate, isCalculating }) => {
  const [amount, setAmount] = useState<number>(53000);
  const [year, setYear] = useState<number>(2013);
  const [increment, setIncrement] = useState<number>(10);
  const [includeLifestyle, setIncludeLifestyle] = useState<boolean>(true);
  
  const [cityTier, setCityTier] = useState<CityTierMove>(CityTierMove.SAME_TIER);
  const [selectedDomain, setSelectedDomain] = useState<InflationDomain>(INFLATION_DOMAINS[0]);
  const [selectedCity, setSelectedCity] = useState<CityInfo>(INDIAN_CITIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(amount, year, increment, includeLifestyle, cityTier, selectedDomain, selectedCity);
  };

  return (
    <div className="bg-[#151516] border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Top Grid: Basic Inputs (Left) and Reality Factors (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Left Column: Year & Money */}
            <div className="space-y-6">
                <div>
                  <label htmlFor="year" className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Pick Your Flashback Year 🕰️
                    <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">Choose the year you want to travel back to! We compare money from then to now.</span>
                  </label>
                  <div className="space-y-3">
                     <div className="relative">
                        <select
                          id="year"
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className="block w-full bg-[#252527] border border-transparent text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 focus:outline-none appearance-none transition-all cursor-pointer hover:bg-[#2c2c2e]"
                        >
                          {INDIA_CII_DATA.filter(d => d.year < CURRENT_YEAR).map((data) => (
                            <option key={data.year} value={data.year}>
                              {data.year}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                     </div>
                     <input 
                       type="range" 
                       min={INDIA_CII_DATA[0].year} 
                       max={CURRENT_YEAR - 1} 
                       value={year} 
                       onChange={(e) => setYear(Number(e.target.value))}
                       className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                     />
                  </div>
                </div>

                <div>
                  <label htmlFor="amount" className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Your Monthly Stash Back Then 💸
                    <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">How much money (salary, pocket money, etc.) did you have every month?</span>
                  </label>
                  <div className="space-y-3">
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-zinc-500 font-semibold text-lg">₹</span>
                        </div>
                        <input
                          type="number"
                          id="amount"
                          min="1000"
                          step="500"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="block w-full bg-[#252527] border border-transparent text-white text-lg py-4 pl-10 pr-4 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 focus:outline-none placeholder-zinc-600 transition-all hover:bg-[#2c2c2e] font-bold"
                          placeholder="e.g. 53000"
                          required
                        />
                     </div>
                     <input 
                       type="range" 
                       min="5000" 
                       max="500000" 
                       step="1000"
                       value={amount} 
                       onChange={(e) => setAmount(Number(e.target.value))}
                       className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                     />
                  </div>
                </div>
            </div>

            {/* Right Column: Reality Factors */}
            <div className="space-y-6">
                 {/* City Selector */}
                 <div>
                    <label className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                        Your City 🏙️
                        <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">Real estate prices vary wildly by city!</span>
                    </label>
                    <div className="relative">
                        <select
                            value={selectedCity.name}
                            onChange={(e) => {
                                const city = INDIAN_CITIES.find(c => c.name === e.target.value);
                                if (city) setSelectedCity(city);
                            }}
                            className="block w-full bg-[#252527] border border-transparent text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 focus:outline-none appearance-none transition-all cursor-pointer hover:bg-[#2c2c2e]"
                        >
                            {INDIAN_CITIES.map((city) => (
                                <option key={city.name} value={city.name}>{city.name}</option>
                            ))}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                 </div>

                 {/* Metro Mover */}
                 <div>
                    <label className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                        Metro Mover (City Tier)
                        <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">Did you move from a small town to a big city?</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(CityTierMove).map((move) => (
                            <div 
                                key={move}
                                onClick={() => setCityTier(move)}
                                className={`cursor-pointer px-5 py-4 rounded-xl border text-base transition-all flex items-center justify-between ${
                                    cityTier === move 
                                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                    : 'bg-[#252527] border-transparent text-zinc-400 hover:bg-[#2c2c2e]'
                                }`}
                            >
                                <span>{move}</span>
                                {cityTier === move && <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Divider for Inflation Factors */}
        <div className="flex items-center gap-4 py-2">
             <div className="h-px bg-zinc-800 flex-1"></div>
             <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Inflation Factors</span>
             <div className="h-px bg-zinc-800 flex-1"></div>
        </div>

        {/* Bottom Section: Increment, Lifestyle, Domain */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
             <div className="space-y-6">
                <div>
                  <label htmlFor="increment" className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Yearly Income Boost (%) 🚀
                    <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">How much did your income grow every year?</span>
                  </label>
                  <div className="space-y-3">
                     <div className="relative">
                        <input
                          type="number"
                          id="increment"
                          min="0"
                          max="100"
                          step="0.5"
                          value={increment}
                          onChange={(e) => setIncrement(Number(e.target.value))}
                          className="block w-full bg-[#252527] border border-transparent text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-white/30 focus:border-white/30 focus:outline-none placeholder-zinc-600 transition-all hover:bg-[#2c2c2e] font-bold"
                          placeholder="e.g. 10"
                          required
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                          <span className="font-semibold text-lg">%</span>
                        </div>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max="50" 
                       step="0.5"
                       value={increment} 
                       onChange={(e) => setIncrement(Number(e.target.value))}
                       className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                     />
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-[#252527]/50 rounded-xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="flex items-center text-base font-medium text-zinc-200">
                        Include Lifestyle Creep
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">As you get older, you buy fancier toys!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeLifestyle(!includeLifestyle)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black ${
                      includeLifestyle ? 'bg-purple-600' : 'bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`${
                        includeLifestyle ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
             </div>

             <div>
                <label className="flex flex-col text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Select Inflation Domain
                    <span className="text-xs text-zinc-600 font-normal mt-1 normal-case">What do you spend the most money on?</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {INFLATION_DOMAINS.map((domain) => (
                         <button
                            key={domain.id}
                            type="button"
                            onClick={() => setSelectedDomain(domain)}
                            className={`px-4 py-4 rounded-xl text-left border transition-all relative overflow-hidden group ${
                                selectedDomain.id === domain.id
                                ? 'bg-red-500/20 border-red-500/50 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                : 'bg-[#252527] border-transparent text-zinc-400 hover:bg-[#2c2c2e]'
                            }`}
                        >
                            <div className="text-sm font-bold">{domain.label}</div>
                            <div className={`text-[10px] mt-1.5 ${selectedDomain.id === domain.id ? 'text-red-300' : 'text-zinc-600'}`}>
                              {domain.description}
                            </div>
                        </button>
                    ))}
                </div>
             </div>
        </div>

        <button
          type="submit"
          disabled={isCalculating}
          className={`w-full mt-6 flex items-center justify-center py-4 px-6 rounded-full shadow-lg text-base font-bold text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all transform active:scale-[0.98] ${
            isCalculating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </span>
          ) : (
            'Calculate Value'
          )}
        </button>
      </form>
    </div>
  );
};

export default SalaryInput;
