
import { CIIDataPoint, InflationDomain, Commodity, EconomicEvent, AssetBenchmark, CityInfo } from './types';

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
  { year: 2001, price: 4300 },
  { year: 2002, price: 4990 },
  { year: 2003, price: 5600 },
  { year: 2004, price: 6000 },
  { year: 2005, price: 7000 },
  { year: 2006, price: 8400 },
  { year: 2007, price: 10800 },
  { year: 2008, price: 12500 },
  { year: 2009, price: 14500 },
  { year: 2010, price: 18500 },
  { year: 2011, price: 26400 },
  { year: 2012, price: 31050 },
  { year: 2013, price: 29600 },
  { year: 2014, price: 28000 },
  { year: 2015, price: 26343 },
  { year: 2016, price: 28623 },
  { year: 2017, price: 29667 },
  { year: 2018, price: 31438 },
  { year: 2019, price: 35220 },
  { year: 2020, price: 48651 },
  { year: 2021, price: 48720 },
  { year: 2022, price: 52670 },
  { year: 2023, price: 61200 },
  { year: 2024, price: 72500 },
  { year: 2025, price: 85000 }, 
  { year: 2026, price: 92000 },
];

export const NIFTY_DATA = [
    { year: 2001, value: 1059 },
    { year: 2002, value: 1093 },
    { year: 2003, value: 1879 },
    { year: 2004, value: 2080 },
    { year: 2005, value: 2836 },
    { year: 2006, value: 3966 },
    { year: 2007, value: 6138 },
    { year: 2008, value: 2959 },
    { year: 2009, value: 5201 },
    { year: 2010, value: 6134 },
    { year: 2011, value: 4624 },
    { year: 2012, value: 5905 },
    { year: 2013, value: 6304 },
    { year: 2014, value: 8282 },
    { year: 2015, value: 7946 },
    { year: 2016, value: 8185 },
    { year: 2017, value: 10530 },
    { year: 2018, value: 10862 },
    { year: 2019, value: 12168 },
    { year: 2020, value: 13981 },
    { year: 2021, value: 17354 },
    { year: 2022, value: 18105 },
    { year: 2023, value: 21731 },
    { year: 2024, value: 24500 },
    { year: 2025, value: 27000 },
    { year: 2026, value: 30000 },
];

// CORRECTED PROPERTY PRICE REALITY (National Average / Tier 2 Benchmark)
// Updated to reflect the steep rise post-2020
export const PROPERTY_PRICES = [
    { year: 2001, price: 1800 },
    { year: 2002, price: 1950 },
    { year: 2003, price: 2100 },
    { year: 2004, price: 2400 },
    { year: 2005, price: 2900 },
    { year: 2006, price: 3800 },
    { year: 2007, price: 4800 },
    { year: 2008, price: 5200 },
    { year: 2009, price: 5000 },
    { year: 2010, price: 5800 },
    { year: 2011, price: 6800 },
    { year: 2012, price: 7500 },
    { year: 2013, price: 8200 },
    { year: 2014, price: 8600 },
    { year: 2015, price: 9000 },
    { year: 2016, price: 9200 },
    { year: 2017, price: 9300 },
    { year: 2018, price: 9500 },
    { year: 2019, price: 9800 },
    { year: 2020, price: 10000 },
    { year: 2021, price: 11500 }, // Start of recovery
    { year: 2022, price: 13500 }, // Post-COVID Boom
    { year: 2023, price: 16500 }, // Significant rise
    { year: 2024, price: 19000 }, // Current Reality
    { year: 2025, price: 22000 }, // Projected
    { year: 2026, price: 25000 },
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

// Feature: Commodity Reality
// Approx avg prices in India for visual comparison
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
          2013: 9999, // Approx retail for premium Nike then
          2018: 12999, 
          2024: 16995, 
          2025: 18995, // Approx current retail
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
      id: 'sedan',
      name: 'Executive Sedan',
      example: 'Honda City/Verna',
      emoji: '🚘',
      prices: { 2001: 650000, 2005: 750000, 2010: 950000, 2013: 1050000, 2018: 1300000, 2025: 1800000, 2026: 1950000 }
    },
    {
      id: 'bike',
      name: '150cc Bike',
      example: 'Pulsar/Apache',
      emoji: '🏍️',
      prices: { 2001: 45000, 2005: 55000, 2010: 65000, 2013: 75000, 2018: 95000, 2025: 140000, 2026: 155000 }
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
      id: 'trip',
      name: 'Europe Trip',
      example: '10 Days (Per Person)',
      emoji: '✈️',
      prices: { 2001: 50000, 2005: 80000, 2010: 100000, 2013: 150000, 2018: 200000, 2025: 350000, 2026: 380000 }
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
  "Don't let your cash nap in a savings account. Wake it up! 🚀",
  "Compound interest is the 8th wonder of the world. He's a good boy. 🐶",
  "A penny saved is... actually losing value due to inflation. Invest it! 📉",
  "Chase your dreams like I chase my tail. But have a plan! 🌀",
  "Inflation doesn't sleep, and neither does my appetite for treats. 🍗",
  "Your income is a bone. Inflation is another dog trying to steal it. 🐕"
];

export const CURRENT_YEAR = 2026;
export const MIN_YEAR = 2001;
export const PROJECTED_INFLATION_RATE = 6.0;
