
import { CIIDataPoint, InflationDomain, Commodity, EconomicEvent, AssetBenchmark, CityInfo, InvestmentAsset } from './types';

// Data Source: Income Tax Department of India Cost Inflation Index (CII)
// Base year shifted to 2001-02 = 100
export const INDIA_CII_DATA: CIIDataPoint[] = [
  { year: 2001, financialYear: '2001-02', cii: 100 },
  { year: 2002, financialYear: '2002-03', cii: 105 },
  { year: 2003, financialYear: '2003-04', cii: 109 },
  { year: 2004, financialYear: '2004-05', cii: 113 },
  { year: 2005, financialYear: '2005-06', cii: 117 },
  { year: 2006, financialYear: '2006-07', cii: 122 },
  { year: 2007, financialYear: '2007-08', cii: 129 },
  { year: 2008, financialYear: '2008-09', cii: 137 },
  { year: 2009, financialYear: '2009-10', cii: 148 },
  { year: 2010, financialYear: '2010-11', cii: 167 },
  { year: 2011, financialYear: '2011-12', cii: 184 },
  { year: 2012, financialYear: '2012-13', cii: 200 },
  { year: 2013, financialYear: '2013-14', cii: 220 },
  { year: 2014, financialYear: '2014-15', cii: 240 },
  { year: 2015, financialYear: '2015-16', cii: 254 },
  { year: 2016, financialYear: '2016-17', cii: 264 },
  { year: 2017, financialYear: '2017-18', cii: 272 },
  { year: 2018, financialYear: '2018-19', cii: 280 },
  { year: 2019, financialYear: '2019-20', cii: 289 },
  { year: 2020, financialYear: '2020-21', cii: 301 },
  { year: 2021, financialYear: '2021-22', cii: 317 },
  { year: 2022, financialYear: '2022-23', cii: 331 },
  { year: 2023, financialYear: '2023-24', cii: 348 },
  { year: 2024, financialYear: '2024-25', cii: 363 },
  { year: 2025, financialYear: '2025-26', cii: 381 }, // Projected (~5%)
  { year: 2026, financialYear: '2026-27', cii: 400 }, // Projected (~5%)
];

// Approximate Average Annual Price of 24K Gold per 10g in INR
export const INDIA_GOLD_DATA = [
  { year: 2001, price: 4300 }, { year: 2002, price: 4990 }, { year: 2003, price: 5600 },
  { year: 2004, price: 6000 }, { year: 2005, price: 7000 }, { year: 2006, price: 8400 },
  { year: 2007, price: 10800 }, { year: 2008, price: 12500 }, { year: 2009, price: 14500 },
  { year: 2010, price: 18500 }, { year: 2011, price: 26400 }, { year: 2012, price: 31050 },
  { year: 2013, price: 29600 }, { year: 2014, price: 28000 }, { year: 2015, price: 26343 },
  { year: 2016, price: 28623 }, { year: 2017, price: 29667 }, { year: 2018, price: 31438 },
  { year: 2019, price: 35220 }, { year: 2020, price: 48651 }, { year: 2021, price: 48720 },
  { year: 2022, price: 52670 }, { year: 2023, price: 61200 }, { year: 2024, price: 72500 },
  { year: 2025, price: 85000 }, { year: 2026, price: 92000 },
];

// Approximate Average Price of Silver per 1kg in INR
export const INDIA_SILVER_DATA = [
    { year: 2001, price: 7200 }, { year: 2005, price: 10500 }, { year: 2010, price: 27000 },
    { year: 2011, price: 56900 }, { year: 2013, price: 45000 }, { year: 2015, price: 37000 },
    { year: 2018, price: 41000 }, { year: 2020, price: 63000 }, { year: 2022, price: 66000 },
    { year: 2023, price: 74000 }, { year: 2024, price: 88000 }, { year: 2026, price: 95000 }
];

// Approximate Average Price of Copper per kg in INR (MCX/Market Avg)
export const INDIA_COPPER_DATA = [
    { year: 2001, price: 90 }, { year: 2005, price: 200 }, { year: 2010, price: 350 },
    { year: 2011, price: 440 }, { year: 2013, price: 450 }, { year: 2015, price: 380 },
    { year: 2018, price: 440 }, { year: 2020, price: 520 }, { year: 2022, price: 750 },
    { year: 2024, price: 850 }, { year: 2026, price: 900 }
];

export const PROPERTY_PRICES = [
    { year: 2001, price: 1800 }, { year: 2002, price: 1950 }, { year: 2003, price: 2100 },
    { year: 2004, price: 2400 }, { year: 2005, price: 2900 }, { year: 2006, price: 3800 },
    { year: 2007, price: 4800 }, { year: 2008, price: 5200 }, { year: 2009, price: 5000 },
    { year: 2010, price: 5800 }, { year: 2011, price: 6800 }, { year: 2012, price: 7500 },
    { year: 2013, price: 8200 }, { year: 2014, price: 8600 }, { year: 2015, price: 9000 },
    { year: 2016, price: 9200 }, { year: 2017, price: 9300 }, { year: 2018, price: 9500 },
    { year: 2019, price: 9800 }, { year: 2020, price: 10000 }, { year: 2021, price: 11500 },
    { year: 2022, price: 13500 }, { year: 2023, price: 16500 }, { year: 2024, price: 19000 },
    { year: 2025, price: 22000 }, { year: 2026, price: 25000 },
];

export const INDIAN_CITIES: CityInfo[] = [
    { name: 'National Average', tier: 2, realEstateMultiplier: 1.0 },
    { name: 'Mumbai', tier: 1, realEstateMultiplier: 3.5 },
    { name: 'Bangalore', tier: 1, realEstateMultiplier: 1.8 },
    { name: 'Delhi NCR', tier: 1, realEstateMultiplier: 1.6 },
    { name: 'Hyderabad', tier: 1, realEstateMultiplier: 1.5 },
    { name: 'Chennai', tier: 1, realEstateMultiplier: 1.4 },
    { name: 'Pune', tier: 1, realEstateMultiplier: 1.3 },
    { name: 'Kolkata', tier: 1, realEstateMultiplier: 1.1 },
    { name: 'Ahmedabad', tier: 2, realEstateMultiplier: 0.9 },
    { name: 'Jaipur', tier: 2, realEstateMultiplier: 0.8 },
    { name: 'Chandigarh', tier: 2, realEstateMultiplier: 1.2 },
];

export const INFLATION_DOMAINS: InflationDomain[] = [
  { id: 'general', label: 'Overall Inflation', offset: 0, description: 'Standard CPI (Default)' },
  { id: 'education', label: 'Education', offset: 4.5, description: 'School & College Fees' },
  { id: 'healthcare', label: 'Healthcare', offset: 5.0, description: 'Medical & Hospitalization' },
  { id: 'housing', label: 'Real Estate', offset: 3.0, description: 'Property & Rent' },
  { id: 'wedding', label: 'Weddings', offset: 6.0, description: 'Events & Luxury' },
];

// 2. Time Machine Investor Data
export const TIME_MACHINE_ASSETS: InvestmentAsset[] = [
    {
        id: 'bitcoin',
        name: 'Bitcoin',
        ticker: 'BTC',
        type: 'CRYPTO',
        color: '#f7931a',
        prices: {
            2010: 5, 2011: 150, 2012: 300, 2013: 8000, 2014: 35000, 2015: 18000,
            2016: 30000, 2017: 65000, 2018: 450000, 2019: 250000, 2020: 700000,
            2021: 3500000, 2022: 1800000, 2023: 2500000, 2024: 6000000, 2025: 8500000, 2026: 10000000
        }
    },
    {
        id: 'ethereum',
        name: 'Ethereum',
        ticker: 'ETH',
        type: 'CRYPTO',
        color: '#627eea',
        prices: {
            2015: 100, 2016: 600, 2017: 20000, 2018: 50000, 2019: 15000,
            2020: 30000, 2021: 250000, 2022: 120000, 2023: 180000, 2024: 300000, 2025: 450000, 2026: 550000
        }
    },
    {
        id: 'nifty',
        name: 'Nifty 50 Index',
        ticker: 'NIFTY',
        type: 'INDEX',
        color: '#10b981',
        prices: {
            2001: 1059, 2002: 1093, 2003: 1879, 2004: 2080, 2005: 2836,
            2006: 3966, 2007: 6138, 2008: 2959, 2009: 5201, 2010: 6134,
            2011: 4624, 2012: 5905, 2013: 6304, 2014: 8282, 2015: 7946,
            2016: 8185, 2017: 10530, 2018: 10862, 2019: 12168, 2020: 13981,
            2021: 17354, 2022: 18105, 2023: 21731, 2024: 24500, 2025: 27000, 2026: 30000
        }
    },
    {
        id: 'reliance',
        name: 'Reliance Ind.',
        ticker: 'RELIANCE',
        type: 'STOCK',
        color: '#0057e7',
        prices: {
            2001: 50, 2005: 150, 2010: 500, 2013: 400, 2015: 450,
            2017: 600, 2018: 900, 2019: 1200, 2020: 2000, 2021: 2400,
            2022: 2500, 2023: 2600, 2024: 3000, 2025: 3500, 2026: 3800
        }
    },
    {
        id: 'apple',
        name: 'Apple Inc.',
        ticker: 'AAPL',
        type: 'STOCK',
        color: '#A2AAAD',
        prices: {
            2001: 15, 2005: 50, 2010: 300, 2013: 900, 2015: 1800,
            2017: 2500, 2019: 3500, 2020: 8000, 2021: 11000, 2022: 13000,
            2023: 15000, 2024: 16500, 2025: 19000, 2026: 21750
        }
    },
    {
        id: 'tesla',
        name: 'Tesla',
        ticker: 'TSLA',
        type: 'STOCK',
        color: '#E31937',
        prices: {
            2010: 100, 2012: 150, 2013: 600, 2015: 1500,
            2017: 2000, 2019: 2500, 2020: 15000, 2021: 25000, 2022: 18000,
            2023: 21000, 2024: 20000, 2025: 25000, 2026: 30450
        }
    }
];

// Top Performing Indian Mutual Funds (Hypothetical average CAGR proxies for the card)
export const MUTUAL_FUND_DATA = [
    { name: "Nippon India Small Cap", cagr: 26, risk: "High", emoji: "🚀" },
    { name: "SBI Small Cap Fund", cagr: 24, risk: "High", emoji: "📈" },
    { name: "Quant Small Cap Fund", cagr: 28, risk: "Very High", emoji: "🔥" },
    { name: "HDFC Mid-Cap Opportunities", cagr: 20, risk: "Med", emoji: "🛡️" },
    { name: "Parag Parikh Flexi Cap", cagr: 19, risk: "Low", emoji: "🐢" }
];

export const CATEGORY_INFLATION_RATES = {
    food: 7.5,
    rent: 5.0,
    travel: 6.0,
    medical: 10.0,
    lifestyle: 4.0
};

export const INDUSTRIES = [
    { id: 'it', name: 'IT & Software', avgGrowth: 12 },
    { id: 'finance', name: 'Banking & Finance', avgGrowth: 10 },
    { id: 'manufacturing', name: 'Manufacturing', avgGrowth: 8 },
    { id: 'sales', name: 'Sales & Marketing', avgGrowth: 11 },
    { id: 'govt', name: 'Government/PSU', avgGrowth: 6 }, // DA linked
    { id: 'startup', name: 'Startup (High Risk)', avgGrowth: 15 }
];

export const COMMODITIES: Commodity[] = [
  {
    id: 'petrol',
    name: 'Petrol',
    emoji: '⛽️',
    unit: 'Liters',
    prices: {
      2001: 28, 2005: 40, 2010: 50, 2013: 70, 2015: 60, 2018: 75, 2020: 80, 2024: 100, 2026: 105
    }
  },
  {
    id: 'movie',
    name: 'Movie Ticket',
    emoji: '🎟️',
    unit: 'Tickets',
    prices: {
      2001: 40, 2005: 80, 2010: 120, 2013: 150, 2018: 200, 2024: 350, 2026: 400
    }
  },
  {
    id: 'lpg',
    name: 'LPG Cylinder',
    emoji: '🔥',
    unit: 'Cylinders',
    prices: {
      2001: 200, 2005: 250, 2010: 350, 2013: 410, 2014: 900, 2018: 700, 2024: 900, 2026: 1100
    }
  },
  {
    id: 'milk',
    name: 'Milk',
    emoji: '🥛',
    unit: 'Liters',
    prices: {
      2001: 14, 2005: 18, 2010: 28, 2013: 35, 2018: 42, 2024: 60, 2026: 70
    }
  },
  {
    id: 'data',
    name: 'Mobile Data (1GB)',
    emoji: '📶',
    unit: 'GB',
    prices: {
      2001: 0, 2005: 0, 2010: 250, 2013: 250, 2016: 200, 2017: 5, 2020: 10, 2024: 15, 2026: 20
    }
  },
  {
    id: 'haircut',
    name: 'Men\'s Haircut',
    emoji: '💇‍♂️',
    unit: 'Service',
    prices: {
      2001: 20, 2005: 30, 2010: 50, 2013: 80, 2018: 150, 2024: 250, 2026: 300
    }
  },
  {
    id: 'banana',
    name: 'Banana (Dozen)',
    emoji: '🍌',
    unit: 'Dozen',
    prices: {
      2001: 10, 2005: 15, 2010: 30, 2013: 40, 2018: 60, 2024: 80, 2026: 90
    }
  }
];

export const ASSET_BENCHMARKS: AssetBenchmark[] = [
    {
      id: 'sneakers',
      name: 'Air Jordan 1s',
      example: 'Nike High OG',
      emoji: '👟',
      prices: { 
          2001: 4500, 
          2005: 6000, 
          2010: 7500, 
          2013: 9999,
          2018: 12999, 
          2024: 16995, 
          2025: 18995,
          2026: 19999 
      }
    },
    {
      id: 'hatchback',
      name: 'Entry Hatchback',
      example: 'Maruti Alto/Swift',
      emoji: '🚗',
      prices: { 2001: 200000, 2005: 250000, 2010: 300000, 2013: 450000, 2018: 550000, 2025: 700000, 2026: 750000 }
    },
    {
      id: 'suv',
      name: 'Mid-Range SUV',
      example: 'Scorpio/Creta',
      emoji: '🚙',
      prices: { 2001: 600000, 2005: 750000, 2010: 900000, 2013: 1100000, 2018: 1500000, 2025: 2000000, 2026: 2200000 }
    },
    {
      id: 'iphone',
      name: 'Flagship Phone',
      example: 'iPhone Pro Model',
      emoji: '📱',
      prices: { 2008: 31000, 2010: 45000, 2013: 55000, 2015: 65000, 2018: 100000, 2025: 145000, 2026: 159000 }
    },
    {
      id: 'mba',
      name: 'MBA Degree',
      example: 'Top B-School Fee',
      emoji: '🎓',
      prices: { 2001: 200000, 2005: 400000, 2010: 1200000, 2013: 1600000, 2018: 2000000, 2025: 2800000, 2026: 3200000 }
    },
    {
        id: 'wedding',
        name: 'Avg Indian Wedding',
        example: '300 Guests (Mid-tier)',
        emoji: '💒',
        prices: { 2001: 200000, 2005: 500000, 2010: 1000000, 2013: 1500000, 2018: 2500000, 2025: 4000000, 2026: 4500000 }
    }
];

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  { year: 2008, label: 'Global Crash', description: 'Financial Crisis' },
  { year: 2016, label: 'Demonetization', description: 'Currency Ban' },
  { year: 2020, label: 'COVID-19', description: 'Market Crash' },
  { year: 2022, label: 'War Impact', description: 'High Inflation' }
];

export const ZAZZY_WISDOM = [
  "Inflation is like a vacuum cleaner for your wallet. - Zazzy 🐾",
  "The best time to invest was yesterday. The second best time is now. Woof! 🐾",
  "Money can't buy happiness, but it buys treats, which is basically the same thing. 🦴",
  "Compound interest is the 8th wonder of the world. He's a good boy. 🐶",
  "Don't let your cash nap in a savings account. Wake it up! 🚀"
];

// --- NEW GAMIFIED DATA ---

export const SHRINKFLATION_ITEMS = [
  { name: 'Parle-G', oldWeight: '100g', newWeight: '55g', price: '₹5', emoji: '🍪' },
  { name: 'Dairy Milk', oldWeight: '160g', newWeight: '130g', price: '₹100', emoji: '🍫' },
  { name: 'Maggi', oldWeight: '100g', newWeight: '70g', price: '₹12', emoji: '🍜' },
  { name: 'Lays Chips', oldWeight: '60g', newWeight: '35g', price: '₹10', emoji: '🍟' },
];

export const GENZ_EXPENSES = [
  { name: 'Netflix', cost: 650 },
  { name: 'Spotify', cost: 120 },
  { name: 'Uber/Ola', cost: 3500 },
  { name: 'Starbucks/Cafe', cost: 2500 },
  { name: 'Swiggy/Zomato', cost: 4000 },
]; // Monthly total approx 10-11k

export const POLITICIAN_CAGR = 18.5; // Average asset growth of re-contesting MPs approx 18-20% CAGR

export const INFLUENCER_TIERS = [
  { name: 'Viral Gamer', platform: 'YouTube', income: 300000, emoji: '🎮', desc: '1 month of streaming' },
  { name: 'Reel Star', platform: 'Instagram', income: 50000, emoji: '🤳', desc: '1 Brand Deal Post' },
  { name: 'Tech Reviewer', platform: 'YouTube', income: 500000, emoji: '📱', desc: '1 Unboxing Video' },
];

export const BANGALORE_TRAFFIC_HOURS = 2; // Hours lost per day

export const CURRENT_YEAR = 2026;
export const MIN_YEAR = 2001;
export const PROJECTED_INFLATION_RATE = 6.0;
