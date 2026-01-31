
import React, { useState, useEffect } from 'react';
import { INDIA_CII_DATA, CURRENT_YEAR, INDIAN_CITIES, INDUSTRIES } from '../constants';
import { CityTierMove, CityInfo } from '../types';
import GuidePopup from './GuidePopup';

interface SalaryInputProps {
  onCalculate: (
    amount: number, 
    year: number, 
    increment: number, 
    includeLifestyle: boolean,
    cityTier: CityTierMove, 
    city: CityInfo,
    industryId: string
  ) => void;
  isCalculating: boolean;
  prefilledYear?: number | null;
  prefilledAmount?: number | null;
}

const SalaryInput: React.FC<SalaryInputProps> = ({ onCalculate, isCalculating, prefilledYear, prefilledAmount }) => {
  const [amount, setAmount] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [increment, setIncrement] = useState<number | ''>(''); // Changed to require input
  const [includeLifestyle, setIncludeLifestyle] = useState<boolean>(true);
  
  const [cityTier, setCityTier] = useState<CityTierMove>(CityTierMove.SAME_TIER);
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null); // Changed to require input
  const [selectedIndustry, setSelectedIndustry] = useState<string>(INDUSTRIES[0].id);

  // Validation States for Popups
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [showIncrementPopup, setShowIncrementPopup] = useState(false);
  
  // Specific Guide Popup State for Workflow
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  // Initial Guide
  const [showInitialGuide, setShowInitialGuide] = useState(false);

  // Auto-fill when wizard data comes in
  useEffect(() => {
      if (prefilledYear) setYear(prefilledYear);
      if (prefilledAmount) setAmount(prefilledAmount);
  }, [prefilledYear, prefilledAmount]);

  // 1. Initial Guide: "Start Here" if nothing entered yet
  useEffect(() => {
      const timer = setTimeout(() => {
          if (amount === '' && year === '') {
              setShowInitialGuide(true);
          }
      }, 1000);
      return () => clearTimeout(timer);
  }, []);

  // Dismiss initial guide if user interacts
  useEffect(() => {
      if (amount !== '' || year !== '') {
          setShowInitialGuide(false);
      }
  }, [amount, year]);

  // Trigger guide if amount is filled but City or Increment is missing
  useEffect(() => {
      if (amount && amount > 0 && (!selectedCity || increment === '')) {
          const timer = setTimeout(() => setShowWorkflowGuide(true), 2000); // 2s delay to let them type
          return () => clearTimeout(timer);
      } else {
          setShowWorkflowGuide(false);
      }
  }, [amount, selectedCity, increment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (year && amount && increment !== '' && selectedCity) {
        onCalculate(Number(amount), Number(year), Number(increment), includeLifestyle, cityTier, selectedCity, selectedIndustry);
    }
  };

  const isFormValid = !!year && !!amount && increment !== '' && !!selectedCity;

  // Validation Popup Component
  const ValidationBubble = ({ message, show }: { message: string, show: boolean }) => (
      <div className={`absolute left-0 -top-12 z-20 transition-all duration-300 transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <div className="bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg relative animate-bounce">
              {message}
              <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-red-500 transform rotate-45"></div>
          </div>
      </div>
  );

  return (
    <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl w-full max-w-4xl mx-auto transition-colors duration-300 relative">
      
      {showInitialGuide && (
          <GuidePopup 
            title="Start your Time Travel! ⏳" 
            message="Enter your past salary and year here to begin the magic!" 
            onDismiss={() => setShowInitialGuide(false)} 
          />
      )}

      {showWorkflowGuide && !showInitialGuide && (
          <GuidePopup 
            title="Almost there! 🦴" 
            message={<span>Don't forget to pick your <strong className="text-blue-500">City</strong> and <strong className="text-blue-500">Yearly Boost</strong>! It changes everything!</span>}
            onDismiss={() => setShowWorkflowGuide(false)} 
          />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            <div className="space-y-6">
                <div>
                  <label htmlFor="year" className="flex flex-col text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-3">
                    Pick Your Flashback Year 🕰️
                    <span className="text-xs text-zinc-500 dark:text-zinc-500 font-normal mt-1 normal-case">Choose the year you want to travel back to! We compare money from then to now.</span>
                  </label>
                  <div className="space-y-3">
                     <div className="relative">
                        <select
                          id="year"
                          value={year}
                          onChange={(e) => setYear(Number(e.target.value))}
                          className="block w-full bg-zinc-50 dark:bg-[#252527] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/30 focus:border-zinc-400 dark:focus:border-white/30 focus:outline-none appearance-none transition-all cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#2c2c2e]"
                        >
                          <option value="" disabled>Select Year</option>
                          {INDIA_CII_DATA.filter(d => d.year < CURRENT_YEAR).map((data) => (
                            <option key={data.year} value={data.year}>
                              {data.year}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                     </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="amount" className="flex flex-col text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-3">
                    Your Monthly Stash Back Then 💸
                    <span className="text-xs text-zinc-500 dark:text-zinc-500 font-normal mt-1 normal-case">How much money (salary, pocket money, etc.) did you have every month?</span>
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
                          className="block w-full bg-zinc-50 dark:bg-[#252527] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white text-lg py-4 pl-10 pr-4 rounded-xl focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/30 focus:border-zinc-400 dark:focus:border-white/30 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600 transition-all hover:bg-zinc-100 dark:hover:bg-[#2c2c2e] font-bold"
                          placeholder="e.g. 53000"
                          required
                        />
                     </div>
                  </div>
                </div>
            </div>

            <div className="space-y-6">
                 <div className="relative" onMouseEnter={() => !selectedCity && setShowCityPopup(true)} onMouseLeave={() => setShowCityPopup(false)}>
                    <ValidationBubble message="⚠️ Please select your city first!" show={showCityPopup && !selectedCity} />
                    
                    <label className="flex flex-col text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-3">
                        Your City 🏙️ <span className="text-red-500">*</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-500 font-normal mt-1 normal-case">Real estate prices vary wildly by city!</span>
                    </label>
                    <div className="relative">
                        <select
                            value={selectedCity?.name || ""}
                            onChange={(e) => {
                                const city = INDIAN_CITIES.find(c => c.name === e.target.value);
                                if (city) setSelectedCity(city);
                                setShowCityPopup(false);
                            }}
                            className={`block w-full bg-zinc-50 dark:bg-[#252527] border text-zinc-900 dark:text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/30 focus:outline-none appearance-none transition-all cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#2c2c2e] ${!selectedCity ? 'border-red-300 dark:border-red-500/50' : 'border-zinc-200 dark:border-transparent'}`}
                        >
                            <option value="" disabled>Select City</option>
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

                 <div>
                    <label className="flex flex-col text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-3">
                        Metro Mover (City Tier)
                        <span className="text-xs text-zinc-500 dark:text-zinc-500 font-normal mt-1 normal-case">Did you move from a small town to a big city?</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.values(CityTierMove).map((move) => (
                            <div 
                                key={move}
                                onClick={() => setCityTier(move)}
                                className={`cursor-pointer px-5 py-4 rounded-xl border text-base transition-all flex items-center justify-between ${
                                    cityTier === move 
                                    ? 'bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 text-blue-700 dark:text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                    : 'bg-zinc-50 dark:bg-[#252527] border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#2c2c2e]'
                                }`}
                            >
                                <span>{move}</span>
                                {cityTier === move && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4 py-2">
             <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
             <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Inflation Factors</span>
             <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
             <div className="space-y-6">
                <div className="relative" onMouseEnter={() => increment === '' && setShowIncrementPopup(true)} onMouseLeave={() => setShowIncrementPopup(false)}>
                  <ValidationBubble message="⚠️ Tell us your yearly hike %!" show={showIncrementPopup && increment === ''} />

                  <label htmlFor="increment" className="flex flex-col text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-3">
                    Yearly Income Boost (%) 🚀 <span className="text-red-500">*</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-500 font-normal mt-1 normal-case">How much did your income grow every year? (Max 10%)</span>
                  </label>
                  <div className="space-y-3">
                     <div className="relative">
                        <input
                          type="number"
                          id="increment"
                          min="0"
                          max="10"
                          step="0.5"
                          value={increment}
                          onChange={(e) => {
                              if (e.target.value === '') {
                                  setIncrement('');
                                  return;
                              }
                              let val = Number(e.target.value);
                              if (val > 10) val = 10;
                              if (val < 0) val = 0;
                              setIncrement(val);
                              setShowIncrementPopup(false);
                          }}
                          className={`block w-full bg-zinc-50 dark:bg-[#252527] border text-zinc-900 dark:text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/30 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600 transition-all hover:bg-zinc-100 dark:hover:bg-[#2c2c2e] font-bold ${increment === '' ? 'border-red-300 dark:border-red-500/50' : 'border-zinc-200 dark:border-transparent'}`}
                          placeholder="e.g. 5"
                          required
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                          <span className="font-semibold text-lg">%</span>
                        </div>
                     </div>
                     <input 
                       type="range" 
                       min="0" 
                       max="10" 
                       step="0.5"
                       value={increment || 0} 
                       onChange={(e) => setIncrement(Number(e.target.value))}
                       className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
                     />
                  </div>
                </div>

                <div>
                    <label className="flex flex-col text-sm font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider mb-3">
                        Industry Benchmark
                        <span className="text-xs text-zinc-500 dark:text-zinc-500 font-normal mt-1 normal-case">Compare your growth against your peers!</span>
                    </label>
                    <div className="relative">
                        <select
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            className="block w-full bg-zinc-50 dark:bg-[#252527] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white text-lg py-4 px-4 rounded-xl focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/30 focus:border-zinc-400 dark:focus:border-white/30 focus:outline-none appearance-none transition-all cursor-pointer hover:bg-zinc-100 dark:hover:bg-[#2c2c2e]"
                        >
                            {INDUSTRIES.map((ind) => (
                                <option key={ind.id} value={ind.id}>{ind.name} (Avg ~{ind.avgGrowth}%)</option>
                            ))}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                 </div>

                <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-[#252527]/50 rounded-xl border border-zinc-200 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="flex items-center text-base font-medium text-zinc-800 dark:text-zinc-200">
                        Include Lifestyle Creep
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">As you get older, you buy fancier toys!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeLifestyle(!includeLifestyle)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black ${
                      includeLifestyle ? 'bg-purple-600' : 'bg-zinc-300 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`${
                        includeLifestyle ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md`}
                    />
                  </button>
                </div>
             </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isCalculating}
          onMouseEnter={() => {
              if (!selectedCity) setShowCityPopup(true);
              if (increment === '') setShowIncrementPopup(true);
          }}
          onMouseLeave={() => {
              setShowCityPopup(false);
              setShowIncrementPopup(false);
          }}
          className={`w-full mt-6 flex items-center justify-center py-4 px-6 rounded-full shadow-lg text-base font-bold text-white dark:text-black bg-zinc-900 dark:bg-white transition-all transform ${
            !isFormValid || isCalculating 
            ? 'opacity-30 cursor-not-allowed grayscale' 
            : 'hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98]'
          }`}
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
