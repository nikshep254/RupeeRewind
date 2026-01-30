
import React, { useState, useCallback, useEffect, useRef } from 'react';
import SalaryInput from './components/SalaryInput';
import FutureInput from './components/FutureInput';
import ResultView from './components/ResultView';
import FutureResultView from './components/FutureResultView';
import Onboarding from './components/Onboarding';
import AboutModal from './components/AboutModal';
import Logo from './components/Logo';
import { INDIA_GOLD_DATA, PROPERTY_PRICES, CURRENT_YEAR, ZAZZY_WISDOM } from './constants';
import { 
    CalculationResult, 
    FuturePredictionResult, 
    CalculationState, 
    ChartDataPoint, 
    AIAnalysisState, 
    AppMode,
    CityTierMove,
    InflationDomain,
    CityInfo
} from './types';
import { getEconomicInsight, getFutureInsight, getLatestInflationRate, getLiveGoldPrice } from './services/geminiService';

// Simplified Tax Calculation
const calculateTax = (annualIncome: number, year: number): number => {
    let tax = 0;
    if (year < 2014) {
        if (annualIncome > 1000000) tax += (annualIncome - 1000000) * 0.30 + 100000 + 30000;
        else if (annualIncome > 500000) tax += (annualIncome - 500000) * 0.20 + 30000;
        else if (annualIncome > 200000) tax += (annualIncome - 200000) * 0.10;
    } else {
        if (annualIncome > 1500000) tax += (annualIncome - 1500000) * 0.30 + 150000;
        else if (annualIncome > 1200000) tax += (annualIncome - 1200000) * 0.20 + 90000;
        else if (annualIncome > 900000) tax += (annualIncome - 900000) * 0.15 + 45000;
        else if (annualIncome > 600000) tax += (annualIncome - 600000) * 0.10 + 15000;
        else if (annualIncome > 300000) tax += (annualIncome - 300000) * 0.05;
    }
    return tax;
};

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.HISTORY);
  const [calcState, setCalcState] = useState<CalculationState>(CalculationState.IDLE);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [footerQuote, setFooterQuote] = useState<string>('');
  
  const [baseInflationRate, setBaseInflationRate] = useState<number>(6.0);
  const [liveGoldPrice, setLiveGoldPrice] = useState<number | null>(null);
  
  const [historyResult, setHistoryResult] = useState<CalculationResult | null>(null);
  const [historyChartData, setHistoryChartData] = useState<ChartDataPoint[]>([]);
  
  const [futureResult, setFutureResult] = useState<FuturePredictionResult | null>(null);
  const [futureChartData, setFutureChartData] = useState<ChartDataPoint[]>([]);

  const [aiState, setAiState] = useState<AIAnalysisState>(AIAnalysisState.IDLE);
  const [aiText, setAiText] = useState<string>('');

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('rupeeRewindOnboardingSeen');
    const storedName = localStorage.getItem('rupeeRewindUserName');
    
    if (storedName) {
        setUserName(storedName);
    }

    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Set Random Quote
    setFooterQuote(ZAZZY_WISDOM[Math.floor(Math.random() * ZAZZY_WISDOM.length)]);
  }, []);

  // Auto-scroll to results when calculation succeeds
  useEffect(() => {
    if (calcState === CalculationState.SUCCESS && resultRef.current) {
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [calcState]);

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem('rupeeRewindOnboardingSeen', 'true');
    if (name) {
        localStorage.setItem('rupeeRewindUserName', name);
        setUserName(name);
    }
    setShowOnboarding(false);
  };

  // Fetch live data on mount
  useEffect(() => {
    const fetchData = async () => {
      const rate = await getLatestInflationRate();
      if (rate && !isNaN(rate)) setBaseInflationRate(rate);

      const gold = await getLiveGoldPrice();
      if (gold && !isNaN(gold)) setLiveGoldPrice(gold);
    };
    fetchData();
  }, []);

  const calculateInflation = useCallback((
      amount: number, 
      year: number, 
      increment: number, 
      includeLifestyle: boolean, 
      cityTier: CityTierMove, 
      domain: InflationDomain, 
      city: CityInfo
  ) => {
    setCalcState(CalculationState.CALCULATING);
    setAiState(AIAnalysisState.IDLE);
    setAiText('');

    setTimeout(() => {
      const yearsDiff = CURRENT_YEAR - year;
      
      // Calculate effective inflation rate
      let inflationModifier = 0;
      if (includeLifestyle) inflationModifier += 2.0;
      // Add domain specific offset
      inflationModifier += domain.offset;

      const adjustedInflationRate = baseInflationRate + inflationModifier;
      
      let cityMultiplier = 1.0;
      if (cityTier === CityTierMove.TIER_2_TO_1) cityMultiplier = 1.25; 
      if (cityTier === CityTierMove.TIER_1_TO_2) cityMultiplier = 0.85; 

      const inflationMultiplier = Math.pow(1 + adjustedInflationRate / 100, yearsDiff);
      
      const adjustedAmount = Math.round((amount * inflationMultiplier) * cityMultiplier); 
      const inflationPercentage = ((adjustedAmount - amount) / amount) * 100;

      const growthMultiplier = Math.pow(1 + increment / 100, yearsDiff);
      const salaryWithIncrement = Math.round(amount * growthMultiplier);

      // New: Calculate Erosion of Original Amount
      const erodedOriginalAmount = Math.round(amount / Math.pow(1 + baseInflationRate / 100, yearsDiff));
      const purchasingPower1000 = Math.round(1000 * Math.pow(1 + baseInflationRate / 100, yearsDiff));

      // Gold Calculation with Live Data
      const startGold = INDIA_GOLD_DATA.find(d => d.year === year)?.price || 5000;
      const endGold = liveGoldPrice || (INDIA_GOLD_DATA.find(d => d.year === CURRENT_YEAR)?.price || 92000);
      const goldGramsThen = amount / (startGold / 10); 
      const goldAdjustedAmount = Math.round(goldGramsThen * (endGold / 10));

      const monthlyInv = amount * 0.20;
      const months = yearsDiff * 12;
      const monthlyRate = 13 / 12 / 100; // 13% CAGR
      const sipMissedFortune = Math.round(monthlyInv * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

      const taxOriginal = calculateTax(amount * 12, year) / 12; 
      const netIncomeOriginal = amount - taxOriginal;
      
      const taxNow = calculateTax(salaryWithIncrement * 12, CURRENT_YEAR) / 12;
      const netIncomeNow = salaryWithIncrement - taxNow;

      const priceSqftThen = (PROPERTY_PRICES.find(d => d.year === year)?.price || 6000) * city.realEstateMultiplier;
      const priceSqftNow = (PROPERTY_PRICES.find(d => d.year === CURRENT_YEAR)?.price || 14000) * city.realEstateMultiplier;
      const sqftAffordabilityOriginal = (amount * 12) / priceSqftThen; 
      const sqftAffordabilityNow = (salaryWithIncrement * 12) / priceSqftNow;

      const newChartData: ChartDataPoint[] = [];
      for (let i = 0; i <= yearsDiff; i++) {
        const currentY = year + i;
        const projectedVal = Math.round(amount * Math.pow(1 + increment / 100, i));
        const requiredVal = Math.round((amount * Math.pow(1 + adjustedInflationRate / 100, i)) * (i === yearsDiff ? cityMultiplier : 1.0));
        
        const yearGoldData = INDIA_GOLD_DATA.find(d => d.year === currentY);
        const yearGoldPrice = yearGoldData ? yearGoldData.price : endGold; 
        const goldTrendVal = Math.round(amount * (yearGoldPrice / startGold));

        newChartData.push({
          year: currentY,
          value: projectedVal,
          value2: requiredVal,
          value3: goldTrendVal
        });
      }

      setHistoryResult({
        originalAmount: amount,
        originalYear: year,
        targetYear: CURRENT_YEAR,
        adjustedAmount,
        salaryWithIncrement,
        erodedOriginalAmount,
        purchasingPower1000,
        inflationPercentage,
        customInflationRate: adjustedInflationRate,
        includeLifestyleBuffer: includeLifestyle,
        goldAdjustedAmount,
        goldPriceThen: startGold,
        goldPriceNow: endGold,
        isGoldPriceLive: !!liveGoldPrice,
        sipMissedFortune,
        netIncomeOriginal,
        netIncomeNow,
        taxOriginal,
        taxNow,
        sqftAffordabilityOriginal,
        sqftAffordabilityNow,
        cityTier,
        selectedDomain: domain,
        selectedCity: city
      });
      setHistoryChartData(newChartData);
      setCalcState(CalculationState.SUCCESS);
    }, 600);
  }, [baseInflationRate, liveGoldPrice]);

  const calculateFutureProjection = useCallback((currentAmount: number, growthRate: number, inflationRate: number, years: number) => {
    setCalcState(CalculationState.CALCULATING);
    setAiState(AIAnalysisState.IDLE);
    setAiText('');

    setTimeout(() => {
      const futureNominalAmount = Math.round(currentAmount * Math.pow(1 + growthRate / 100, years));
      const futureRealAmount = Math.round(futureNominalAmount / Math.pow(1 + inflationRate / 100, years));

      const newChartData: ChartDataPoint[] = [];
      const currentYear = new Date().getFullYear();

      // 1. Tax Calculation (Simplified)
      const futureAnnual = futureNominalAmount * 12;
      const futureTax = calculateTax(futureAnnual, currentYear + years) / 12; 

      // 2. Wealth Accumulation (Lazy vs Smart)
      let accumulatedLazy = 0; // FD @ 6%
      let accumulatedSmart = 0; // Nifty @ 12%
      let iterSalary = currentAmount;
      
      for(let i=0; i<years; i++) {
        const annualSavings = iterSalary * 12 * 0.20;
        accumulatedLazy = (accumulatedLazy + annualSavings) * 1.06;
        accumulatedSmart = (accumulatedSmart + annualSavings) * 1.12;
        iterSalary = iterSalary * (1 + growthRate/100);
      }

      // 3. Dream Goal (Home Cost)
      const goalToday = 10000000; // 1 Cr Home
      const goalFuture = goalToday * Math.pow(1 + inflationRate/100, years);

      // 4. Future Item Prices
      const baseItems = [
        { name: 'Petrol (1L)', price: 100, emoji: '⛽️' },
        { name: 'Movie Ticket', price: 350, emoji: '🎟️' },
        { name: 'Coffee', price: 250, emoji: '☕️' },
        { name: 'LPG', price: 900, emoji: '🔥' },
      ];
      const futureItemPrices = baseItems.map(item => ({
          ...item,
          price: Math.round(item.price * Math.pow(1 + inflationRate/100, years))
      }));

      for (let i = 0; i <= years; i++) {
        const year = currentYear + i;
        const nominal = Math.round(currentAmount * Math.pow(1 + growthRate / 100, i));
        const real = Math.round(nominal / Math.pow(1 + inflationRate / 100, i));
        
        newChartData.push({
          year,
          value: nominal,
          value2: real
        });
      }

      setFutureResult({
        currentAmount,
        growthRate,
        years,
        futureNominalAmount,
        futureRealAmount,
        projectedInflationRate: inflationRate,
        futureTax,
        wealthLazy: Math.round(accumulatedLazy),
        wealthSmart: Math.round(accumulatedSmart),
        futureItemPrices,
        goalComparison: {
            label: "Dream Home (3BHK)",
            costToday: goalToday,
            costFuture: Math.round(goalFuture)
        }
      });
      setFutureChartData(newChartData);
      setCalcState(CalculationState.SUCCESS);
    }, 600);
  }, []);

  const handleGenerateInsight = async () => {
    setAiState(AIAnalysisState.LOADING);
    let text = '';
    
    if (appMode === AppMode.HISTORY && historyResult) {
      text = await getEconomicInsight(historyResult);
    } else if (appMode === AppMode.FUTURE && futureResult) {
      text = await getFutureInsight(futureResult);
    }
    
    setAiText(text);
    setAiState(AIAnalysisState.SUCCESS);
  };

  const switchMode = (mode: AppMode) => {
    setAppMode(mode);
    setCalcState(CalculationState.IDLE);
    setAiState(AIAnalysisState.IDLE);
    setAiText('');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 pb-20 flex flex-col relative overflow-hidden">
      
      {/* Background Floating Puppy Animation */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
          <div className="animate-[bounce_6s_infinite]">
             <Logo className="w-[500px] h-[500px]" disableAnimation={false} />
          </div>
      </div>

      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      
      <div className="flex-grow max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
               <Logo className="w-12 h-12" />
               <div className="text-2xl font-black tracking-tighter text-white">RupeeRewind</div>
            </div>
            <button 
                onClick={() => setShowAbout(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
            >
                <span className="text-sm font-medium text-zinc-300 group-hover:text-white">About</span>
                <svg className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
           <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-5 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            RupeeRewind
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-xl font-medium">
             {userName ? `Welcome back, ${userName}. ` : ''}Decode the true value of your money.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center mb-14">
          <div className="bg-[#151516] p-2 rounded-full border border-white/10 inline-flex shadow-xl">
            <button
              onClick={() => switchMode(AppMode.HISTORY)}
              className={`px-8 py-3.5 rounded-full text-base font-bold transition-all duration-300 ${
                appMode === AppMode.HISTORY 
                ? 'bg-white text-black scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Past to Present
            </button>
            <button
              onClick={() => switchMode(AppMode.FUTURE)}
              className={`px-8 py-3.5 rounded-full text-base font-bold transition-all duration-300 ${
                appMode === AppMode.FUTURE 
                ? 'bg-blue-600 text-white scale-105 shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Future Projection
            </button>
          </div>
        </div>

        {/* Main Content Vertical Stack */}
        <div className="flex flex-col items-center gap-12 max-w-5xl mx-auto">
          {/* Input Section */}
          <div className="w-full">
               {appMode === AppMode.HISTORY ? (
                 <SalaryInput onCalculate={calculateInflation} isCalculating={calcState === CalculationState.CALCULATING} />
               ) : (
                 <FutureInput onCalculate={calculateFutureProjection} isCalculating={calcState === CalculationState.CALCULATING} />
               )}
          </div>

          {/* Results Section */}
          <div className="w-full" ref={resultRef}>
             {calcState === CalculationState.IDLE && (
               <div className="h-[200px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800 rounded-3xl bg-[#151516]/50">
                 <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 grayscale opacity-50">
                    <Logo className="w-10 h-10" disableAnimation />
                 </div>
                 <p className="text-zinc-500 text-base font-medium">Ready to calculate</p>
                 <p className="text-zinc-600 text-xs mt-1">Enter your details above to begin</p>
               </div>
             )}

             {calcState === CalculationState.SUCCESS && (
               <div className="space-y-8 animate-fadeIn">
                 {appMode === AppMode.HISTORY && historyResult && (
                   <ResultView 
                     result={historyResult} 
                     chartData={historyChartData} 
                     aiState={aiState}
                     aiText={aiText}
                     onGenerateAI={handleGenerateInsight}
                     onSwitchMode={switchMode}
                   />
                 )}
                 {appMode === AppMode.FUTURE && futureResult && (
                   <FutureResultView 
                     result={futureResult} 
                     chartData={futureChartData} 
                     aiState={aiState}
                     aiText={aiText}
                     onGenerateAI={handleGenerateInsight}
                    />
                 )}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-10 border-t border-white/5 bg-[#050505] text-center relative z-10">
          <p className="text-zinc-500 text-sm font-medium italic mb-2">"{footerQuote}"</p>
          <p className="text-zinc-700 text-xs">
            © {new Date().getFullYear()} RupeeRewind. Data sources: Income Tax Dept India, NSE India.
          </p>
      </footer>
    </div>
  );
};

export default App;
