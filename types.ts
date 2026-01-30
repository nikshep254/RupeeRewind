
export interface CIIDataPoint {
  year: number;
  financialYear: string;
  cii: number; // Cost Inflation Index
}

export interface InflationDomain {
  id: string;
  label: string;
  offset: number; // Percentage points added to base inflation
  description: string;
}

export interface Commodity {
  id: string;
  name: string;
  emoji: string;
  prices: { [year: number]: number }; // Year: Price
  unit: string;
}

export interface AssetBenchmark {
    id: string;
    name: string;
    example: string;
    emoji: string;
    prices: { [year: number]: number };
}

export interface EconomicEvent {
  year: number;
  label: string;
  description: string;
}

export interface CityInfo {
    name: string;
    tier: number;
    realEstateMultiplier: number; // Compared to national avg
}

export interface CalculationResult {
  originalAmount: number;
  originalYear: number;
  targetYear: number;
  // New metrics based on "Avg Inflation + 2%"
  adjustedAmount: number; // This is now the "Required Income" based on inflation+2%
  salaryWithIncrement: number; // This is based on user's avg increment (now Value)
  
  // Replaced purchasingPower1000 with user specific metric
  erodedOriginalAmount: number; // What the original amount is worth in PAST terms if held as cash today
  purchasingPower1000: number; // Value of ₹1000 from originalYear in today's terms

  inflationPercentage: number;
  customInflationRate: number; // The base rate fetched + 2%
  includeLifestyleBuffer: boolean;
  
  // Gold related
  goldAdjustedAmount: number;
  goldPriceThen: number;
  goldPriceNow: number;
  isGoldPriceLive: boolean; // UI indicator

  // Feature 1: Missed Fortune (SIP)
  sipMissedFortune: number;
  
  // Feature 2: Tax Reality
  netIncomeOriginal: number;
  netIncomeNow: number;
  taxOriginal: number;
  taxNow: number;

  // Feature 4: Real Estate
  sqftAffordabilityOriginal: number;
  sqftAffordabilityNow: number;
  selectedCity: CityInfo;

  // Context
  cityTier: CityTierMove;
  selectedDomain: InflationDomain;
}

export interface FuturePredictionResult {
  currentAmount: number;
  growthRate: number;
  years: number;
  futureNominalAmount: number; // The number on the paycheck
  futureRealAmount: number; // What it's worth in today's money
  projectedInflationRate: number;
  
  // New Features
  futureTax: number;
  wealthLazy: number; // FD/Bank (6%)
  wealthSmart: number; // Equity (12%)
  futureItemPrices: { name: string; price: number; emoji: string }[];
  goalComparison: {
      label: string;
      costToday: number;
      costFuture: number;
  };
}

export interface ChartDataPoint {
  year: number;
  value: number; // Projected Value
  value2?: number; // Required (Inflation)
  value3?: number; // Gold Equivalent
  event?: string; // Economic Event Label
}

export enum CalculationState {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING',
  SUCCESS = 'SUCCESS',
}

export enum AIAnalysisState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum AppMode {
  HISTORY = 'HISTORY',
  FUTURE = 'FUTURE',
}

// New Enums
export enum CityTierMove {
  SAME_TIER = 'Same Tier',
  TIER_2_TO_1 = 'Tier 2 → Tier 1',
  TIER_1_TO_2 = 'Tier 1 → Tier 2',
}

// Deprecated in favor of Domains, but kept for type safety if needed temporarily
export enum ExpenseCategory {
  EDUCATION = 'Education',
  HEALTHCARE = 'Healthcare',
  NONE = 'General',
}
