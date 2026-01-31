
import React, { useState, useCallback, useEffect, useRef } from 'react';
import SalaryInput from './components/SalaryInput';
import FutureInput from './components/FutureInput';
import ResultView from './components/ResultView';
import FutureResultView from './components/FutureResultView';
import Onboarding from './components/Onboarding';
import AboutModal from './components/AboutModal';
import GuidePopup from './components/GuidePopup';
import Logo from './components/Logo';
import TypewriterHeader from './components/TypewriterHeader'; 
import { INDIA_GOLD_DATA, INDIA_SILVER_DATA, INDIA_COPPER_DATA, MUTUAL_FUND_DATA, PROPERTY_PRICES, CURRENT_YEAR, ZAZZY_WISDOM, INDUSTRIES, INFLATION_DOMAINS, COMMODITIES } from './constants';
import { 
    CalculationResult, 
    FuturePredictionResult, 
    CalculationState, 
    ChartDataPoint, 
    AIAnalysisState, 
    AppMode,
    CityTierMove,
    CityInfo
} from './types';
import { getEconomicInsight, getFutureInsight, getLatestInflationRate, getLiveGoldPrice } from './services/geminiService';

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

// Helper to get closest price from data array
const getClosestPrice = (data: {year: number, price: number}[], targetYear: number) => {
    const found = data.find(d => d.year === targetYear);
    if (found) return found.price;
    // Simple closest find
    const sorted = [...data].sort((a,b) => Math.abs(targetYear - a.year) - Math.abs(targetYear - b.year));
    return sorted[0] ? sorted[0].price : 1;
};

// Helper to get closest price from dictionary/map
const getClosestPriceFromMap = (data: { [year: number]: number }, targetYear: number) => {
    if (data[targetYear]) return data[targetYear];
    const years = Object.keys(data).map(Number).sort((a, b) => Math.abs(targetYear - a) - Math.abs(targetYear - b));
    return years[0] ? data[years[0]] : 1;
};

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.HISTORY);
  const [calcState, setCalcState] = useState<CalculationState>(CalculationState.IDLE);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true); // Always show initially for flow
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showScrollGuide, setShowScrollGuide] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [footerQuote, setFooterQuote] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
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
    const storedName = localStorage.getItem('rupeeRewindUserName');
    if (storedName) {
        setUserName(storedName);
        setShowOnboarding(false);
    }
    
    setFooterQuote(ZAZZY_WISDOM[Math.floor(Math.random() * ZAZZY_WISDOM.length)]);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (calcState === CalculationState.SUCCESS && resultRef.current) {
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Show scroll guide shortly after calculating
            setTimeout(() => setShowScrollGuide(true), 800);
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
      city: CityInfo, 
      industryId: string
  ) => {
    setShowScrollGuide(false);
    setCalcState(CalculationState.CALCULATING);
    setAiState(AIAnalysisState.IDLE);
    setAiText('');

    const defaultDomain = INFLATION_DOMAINS[0]; 

    setTimeout(() => {
      const yearsDiff = CURRENT_YEAR - year;
      let inflationModifier = 0;
      if (includeLifestyle) inflationModifier += 2.0;
      inflationModifier += defaultDomain.offset;

      const adjustedInflationRate = baseInflationRate + inflationModifier;
      let cityMultiplier = 1.0;
      if (cityTier === CityTierMove.TIER_2_TO_1) cityMultiplier = 1.25; 
      if (cityTier === CityTierMove.TIER_1_TO_2) cityMultiplier = 0.85; 

      const inflationMultiplier = Math.pow(1 + adjustedInflationRate / 100, yearsDiff);
      const adjustedAmount = Math.round((amount * inflationMultiplier) * cityMultiplier); 
      const inflationPercentage = ((adjustedAmount - amount) / amount) * 100;

      const growthMultiplier = Math.pow(1 + increment / 100, yearsDiff);
      const salaryWithIncrement = Math.round(amount * growthMultiplier);

      const erodedOriginalAmount = Math.round(amount / Math.pow(1 + baseInflationRate / 100, yearsDiff));
      const purchasingPower1000 = Math.round(1000 * Math.pow(1 + baseInflationRate / 100, yearsDiff));

      // Gold
      const startGold = getClosestPrice(INDIA_GOLD_DATA, year);
      const endGold = liveGoldPrice || getClosestPrice(INDIA_GOLD_DATA, CURRENT_YEAR);
      const goldGramsThen = amount / (startGold / 10); 
      const goldAdjustedAmount = Math.round(goldGramsThen * (endGold / 10));

      // Silver
      const startSilver = getClosestPrice(INDIA_SILVER_DATA, year);
      const endSilver = getClosestPrice(INDIA_SILVER_DATA, CURRENT_YEAR);
      const silverKgThen = amount / startSilver;
      const silverAdjustedAmount = Math.round(silverKgThen * endSilver);

      // Copper
      const startCopper = getClosestPrice(INDIA_COPPER_DATA, year);
      const endCopper = getClosestPrice(INDIA_COPPER_DATA, CURRENT_YEAR);
      const copperKgThen = amount / startCopper;
      const copperAdjustedAmount = Math.round(copperKgThen * endCopper);

      // SIP & Mutual Funds
      const monthlyInv = amount * 0.20;
      const months = yearsDiff * 12;
      const monthlyRate = 13 / 12 / 100; // Nifty Benchmark ~13%
      const sipMissedFortune = Math.round(monthlyInv * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

      const mutualFundReturns = MUTUAL_FUND_DATA.map(mf => {
        const mfMonthlyRate = mf.cagr / 12 / 100;
        const val = Math.round(monthlyInv * ((Math.pow(1 + mfMonthlyRate, months) - 1) / mfMonthlyRate) * (1 + mfMonthlyRate));
        return { name: mf.name, value: val, cagr: mf.cagr, emoji: mf.emoji };
      });

      // Taxes (Annualized)
      const annualIncomeOriginal = amount * 12;
      const annualIncomeNow = salaryWithIncrement * 12;
      const taxOriginal = calculateTax(annualIncomeOriginal, year);
      const taxNow = calculateTax(annualIncomeNow, CURRENT_YEAR);
      const netIncomeOriginal = annualIncomeOriginal - taxOriginal;
      const netIncomeNow = annualIncomeNow - taxNow;
      
      const effectiveTaxRateNow = (taxNow / annualIncomeNow) * 100;
      const daysWorkedForTax = Math.round((taxNow / annualIncomeNow) * 30); // Days per month working for tax

      // Real Estate
      const avgPropPriceThen = getClosestPrice(PROPERTY_PRICES, year) * city.realEstateMultiplier;
      const avgPropPriceNow = getClosestPrice(PROPERTY_PRICES, CURRENT_YEAR) * city.realEstateMultiplier;
      
      const sqftAffordabilityOriginal = annualIncomeOriginal / avgPropPriceThen;
      const sqftAffordabilityNow = annualIncomeNow / avgPropPriceNow;

      // Industry Benchmark
      const industry = INDUSTRIES.find(i => i.id === industryId) || INDUSTRIES[0];
      const industryGrowthDiff = Math.round(increment - industry.avgGrowth);

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
        silverAdjustedAmount,
        copperAdjustedAmount,
        sipMissedFortune,
        mutualFundReturns,
        netIncomeOriginal,
        netIncomeNow,
        taxOriginal,
        taxNow,
        effectiveTaxRateNow,
        daysWorkedForTax,
        sqftAffordabilityOriginal,
        sqftAffordabilityNow,
        selectedCity: city,
        cityTier,
        selectedDomain: defaultDomain,
        selectedIndustry: industry.name,
        industryGrowthDiff
      });

      // Chart Data Generation
      const dataPoints: ChartDataPoint[] = [];
      for (let y = year; y <= CURRENT_YEAR; y++) {
          const yDiff = y - year;
          const val = Math.round(amount * Math.pow(1 + increment / 100, yDiff));
          const req = Math.round(amount * Math.pow(1 + adjustedInflationRate / 100, yDiff));
          // Approximate Gold Growth Curve
          const goldVal = Math.round(amount * (getClosestPrice(INDIA_GOLD_DATA, y)/startGold * 10/10)); 

          dataPoints.push({
              year: y,
              value: val,
              value2: req,
              value3: goldVal
          });
      }
      setHistoryChartData(dataPoints);

      setCalcState(CalculationState.SUCCESS);
    }, 1500); // Cinematic Delay
  }, [baseInflationRate, liveGoldPrice]);


  const calculateFutureProjection = useCallback((currentAmount: number, growthRate: number, inflationRate: number, years: number) => {
    setShowScrollGuide(false);
    setCalcState(CalculationState.CALCULATING);
    setAiState(AIAnalysisState.IDLE);
    setAiText('');

    setTimeout(() => {
      const futureNominalAmount = Math.round(currentAmount * Math.pow(1 + growthRate / 100, years));
      const futureRealAmount = Math.round(futureNominalAmount / Math.pow(1 + inflationRate / 100, years));
      const currentYear = new Date().getFullYear();
      const futureAnnual = futureNominalAmount * 12;
      const futureTax = calculateTax(futureAnnual, currentYear + years); // Fixed annual tax

      let accumulatedLazy = 0; 
      let accumulatedSmart = 0; 
      let iterSalary = currentAmount;
      for(let i=0; i<years; i++) {
        const annualSavings = iterSalary * 12 * 0.20;
        accumulatedLazy = (accumulatedLazy + annualSavings) * 1.06;
        accumulatedSmart = (accumulatedSmart + annualSavings) * 1.12;
        iterSalary = iterSalary * (1 + growthRate/100);
      }

      // Feature 6: FIRE Corpus & Feature 7: Loan Interest
      const monthlyExpenseToday = currentAmount * 0.5; // Assume 50% needs
      const targetMonthlyExpense = monthlyExpenseToday * Math.pow(1 + inflationRate/100, years);
      const fireCorpus = targetMonthlyExpense * 12 * 25; // 25x Rule
      
      // Years to freedom calculation (rough estimate based on savings rate)
      const annualSavingsCurrent = (currentAmount * 12) * 0.3; // 30% savings
      const yearsToFreedom = Math.ceil(Math.log(fireCorpus / annualSavingsCurrent) / Math.log(1.12)); // Assuming 12% returns

      // Loan Interest Simulation (Home Loan)
      const loanAmount = 5000000; // 50L
      const interestRate = 8.5;
      const tenure = 20;
      const totalInterestPaid = Math.round((loanAmount * interestRate * tenure) / 100); // Simplified Simple Interest for visual impact

      const goalToday = 10000000;
      const goalFuture = goalToday * Math.pow(1 + inflationRate/100, years);
      
      const baseItems = COMMODITIES.slice(0, 3); // Use constants
      const futureItemPrices = baseItems.map(item => ({ 
          name: item.name, 
          emoji: item.emoji,
          price: Math.round(getClosestPriceFromMap(item.prices, currentYear) * Math.pow(1 + inflationRate/100, years)) 
      }));

      const newChartData: ChartDataPoint[] = [];
      for (let i = 0; i <= years; i++) {
        const year = currentYear + i;
        const nominal = Math.round(currentAmount * Math.pow(1 + growthRate / 100, i));
        const real = Math.round(nominal / Math.pow(1 + inflationRate / 100, i));
        newChartData.push({ year, value: nominal, value2: real });
      }

      setFutureResult({
        currentAmount, growthRate, years, futureNominalAmount, futureRealAmount, projectedInflationRate: inflationRate,
        futureTax: Math.round(futureTax / 12), // Monthly tax
        wealthLazy: Math.round(accumulatedLazy), wealthSmart: Math.round(accumulatedSmart),
        futureItemPrices, goalComparison: { label: "Dream Home (3BHK)", costToday: goalToday, costFuture: Math.round(goalFuture) },
        fireCorpus, yearsToFreedom, totalInterestPaid
      });
      setFutureChartData(newChartData);
      setCalcState(CalculationState.SUCCESS);
    }, 600);
  }, []);

  const handleGenerateInsight = async () => {
    setAiState(AIAnalysisState.LOADING);
    let text = '';
    if (appMode === AppMode.HISTORY && historyResult) text = await getEconomicInsight(historyResult);
    // Future mode AI removed
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
    <div className="min-h-screen bg-gray-50 dark:bg-black text-zinc-900 dark:text-white font-sans selection:bg-purple-500/30 pb-20 flex flex-col relative overflow-hidden transition-colors duration-300">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
          <div className="animate-[bounce_6s_infinite]">
             <Logo className="w-[500px] h-[500px]" disableAnimation={false} />
          </div>
      </div>

      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      {showScrollGuide && (
          <GuidePopup 
            title="Don't stop here! 👇" 
            message="Scroll down to see all the shocking reality cards below!" 
            onDismiss={() => setShowScrollGuide(false)} 
          />
      )}
      
      <div className="flex-grow max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
               <Logo className="w-12 h-12" />
               <div className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">RupeeRewind</div>
            </div>
            <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-white/5 hover:bg-zinc-300 dark:hover:bg-white/10 border border-zinc-300 dark:border-white/5 transition-all text-lg"
                  title="Toggle Theme"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
                <button 
                  onClick={() => setShowAbout(true)} 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-200 dark:bg-white/5 hover:bg-zinc-300 dark:hover:bg-white/10 border border-zinc-300 dark:border-white/5 transition-all group shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-[pulse_3s_infinite]"
                >
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white">About</span>
                </button>
            </div>
        </div>

        <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-5 bg-gradient-to-b from-zinc-800 to-zinc-500 dark:from-white dark:to-white/60 bg-clip-text text-transparent min-h-[1.2em]">
             <TypewriterHeader words={["RupeeRewind", "Inflation Calculator", "Wealth Predictor", "Reality Check"]} />
           </h1>
           <p className="text-zinc-500 dark:text-zinc-300 max-w-2xl mx-auto text-xl font-medium">{userName ? `Welcome, ${userName}. ` : ''}Decode the true value of your money.</p>
        </div>

        <div className="flex justify-center mb-14">
          <div className="bg-white dark:bg-[#151516] p-2 rounded-full border border-zinc-200 dark:border-white/10 inline-flex shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <button
              onClick={() => switchMode(AppMode.HISTORY)}
              className={`px-6 py-3.5 rounded-full text-sm sm:text-base font-bold transition-all duration-300 ${
                appMode === AppMode.HISTORY 
                ? 'bg-blue-600 text-white scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]' 
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              Past to Present
            </button>
            <button
              onClick={() => switchMode(AppMode.FUTURE)}
              className={`px-6 py-3.5 rounded-full text-sm sm:text-base font-bold transition-all duration-300 ${
                appMode === AppMode.FUTURE 
                ? 'bg-blue-600 text-white scale-105 shadow-md' 
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              Future Projection
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-12 max-w-5xl mx-auto">
          <div className="w-full">
               {appMode === AppMode.HISTORY && (
                 <SalaryInput 
                    onCalculate={calculateInflation} 
                    isCalculating={calcState === CalculationState.CALCULATING}
                    prefilledAmount={historyResult?.originalAmount}
                    prefilledYear={historyResult?.originalYear}
                 />
               )}
               {appMode === AppMode.FUTURE && (
                 <FutureInput onCalculate={calculateFutureProjection} isCalculating={calcState === CalculationState.CALCULATING} />
               )}
          </div>
          
          {(appMode === AppMode.HISTORY || appMode === AppMode.FUTURE) && (
              <div className="w-full" ref={resultRef}>
                {calcState === CalculationState.SUCCESS && (
                <div className="space-y-8 animate-fadeIn">
                    {appMode === AppMode.HISTORY && historyResult && (
                    <ResultView result={historyResult} chartData={historyChartData} aiState={aiState} aiText={aiText} onGenerateAI={handleGenerateInsight} onSwitchMode={switchMode} />
                    )}
                    {appMode === AppMode.FUTURE && futureResult && (
                    <FutureResultView result={futureResult} chartData={futureChartData} />
                    )}
                </div>
                )}
              </div>
          )}
        </div>
      </div>

      <footer className="mt-16 py-10 border-t border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-[#050505] text-center relative z-10 transition-colors duration-300">
          <p className="text-zinc-600 dark:text-zinc-500 text-sm font-medium italic mb-2">"{footerQuote}"</p>
          <p className="text-zinc-500 dark:text-zinc-700 text-xs">© {new Date().getFullYear()} RupeeRewind.</p>
      </footer>
    </div>
  );
};

export default App;
