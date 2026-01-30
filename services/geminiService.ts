
import { GoogleGenAI } from "@google/genai";
import { CalculationResult, FuturePredictionResult } from '../types';

const getClient = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getLatestInflationRate = async (): Promise<number> => {
  return 6.0; 
};

export const getLiveGoldPrice = async (): Promise<number> => {
  return 92000;
};

// Fallback logic generator to avoid showing errors to users
const generateFallbackEconomicInsight = (result: CalculationResult): string => {
    const isBeating = result.salaryWithIncrement >= result.adjustedAmount;
    const lossPct = ((result.adjustedAmount - result.salaryWithIncrement) / result.adjustedAmount * 100).toFixed(0);
    const gainPct = ((result.salaryWithIncrement - result.adjustedAmount) / result.adjustedAmount * 100).toFixed(0);

    let insight = "";
    if (isBeating) {
        insight = `Great news! You are currently beating lifestyle inflation by about ${gainPct}%. Your salary growth has successfully outpaced the rising cost of living in ${result.selectedCity.name}. \n\nHowever, note that your original ₹${result.originalAmount} only has the purchasing power of ₹${result.erodedOriginalAmount} today. Investing in assets like Gold (which would be worth ₹${result.goldAdjustedAmount}) or SIPs (₹${result.sipMissedFortune}) would have accelerated your wealth significantly beyond just salary hikes.`;
    } else {
        insight = `Reality Check: You are currently trailing behind lifestyle inflation by ${lossPct}%. To maintain the exact same standard of living you had in ${result.originalYear}, you technically need to earn ₹${result.adjustedAmount}. \n\nThe starkest data point is that your original ₹${result.originalAmount} is now effectively worth only ₹${result.erodedOriginalAmount}. This erosion helps explain why big ticket purchases like Real Estate feel significantly harder now compared to ${result.originalYear}.`;
    }
    return insight;
};

const generateFallbackFutureInsight = (result: FuturePredictionResult): string => {
    const realGrowth = result.futureRealAmount > result.currentAmount;
    const multiplier = (result.wealthSmart / result.wealthLazy).toFixed(1);

    if (realGrowth) {
        return `Your trajectory looks positive. By growing at ${result.growthRate}% against ${result.projectedInflationRate}% inflation, you are increasing your real purchasing power. \n\nKey Strategy: The difference between 'Lazy' and 'Smart' wealth in your chart is massive (${multiplier}x). Ensure you are aggressive with equity investments early on, as your tax burden will rise significantly to ₹${result.futureTax} by year ${result.years}.`;
    } else {
        return `Warning: Your current growth rate of ${result.growthRate}% is barely fighting off inflation (${result.projectedInflationRate}%). In real terms, your purchasing power is stagnating. \n\nAdvice: You need to break linearity. Upskilling to jump brackets or aggressive investing (targeting 12%+) is mandatory. Relying on standard increments will likely lead to a lifestyle downgrade over the next ${result.years} years.`;
    }
};

export const getProductPriceHistory = async (productName: string, year: number): Promise<{ priceThen: number, priceNow: number, name: string }> => {
    const ai = getClient();
    
    // Fallback immediately if no key or simple logic needed to save quota
    if (!ai) {
        return {
            name: productName,
            priceThen: 1000,
            priceNow: 1000 * Math.pow(1.06, 2026 - year)
        };
    }

    const prompt = `
      Find the approximate price of "${productName}" in India in the year ${year} and in 2026.
      Return ONLY a JSON object: {"name": "Product", "priceThen": number, "priceNow": number}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "application/json"
            }
        });
        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text);
    } catch (e) {
        console.warn("Product Search Quota/Error, using fallback math");
        // Fallback: 6% inflation calculation
        return {
            name: productName,
            priceThen: 5000,
            priceNow: 5000 * Math.pow(1.065, 2026 - year)
        };
    }
}

export const getRealEstateInsight = async (city: string): Promise<number | null> => {
    const ai = getClient();
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Avg property price per sqft in ${city} India 2025. Return only number.`,
            config: {
                tools: [{googleSearch: {}}],
                responseMimeType: "text/plain" 
            }
        });
        const text = response.text;
        if (!text) return null;
        const price = parseInt(text.replace(/[^0-9]/g, ''));
        return isNaN(price) ? null : price;

    } catch (error) {
        // Silent fail for real estate
        return null; 
    }
};

export const getEconomicInsight = async (result: CalculationResult): Promise<string> => {
  const ai = getClient();
  if (!ai) return generateFallbackEconomicInsight(result);

  try {
    const modelId = 'gemini-3-flash-preview';
    const prompt = `
      Context: User salary ₹${result.originalAmount} (${result.originalYear}) vs ₹${result.salaryWithIncrement} (Now).
      Required for lifestyle: ₹${result.adjustedAmount}.
      Inflation Erosion: ₹${result.originalAmount} then = ₹${Math.round(result.erodedOriginalAmount)} purchasing power today.
      City: ${result.selectedCity.name}.
      
      Provide brief financial analysis (max 100 words). Be professional but direct.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });

    return response.text || generateFallbackEconomicInsight(result);
  } catch (error: any) {
    // Graceful fallback on any error (Quota, Network, etc)
    console.log("AI Error (Handled):", error.message);
    return generateFallbackEconomicInsight(result);
  }
};

export const getFutureInsight = async (result: FuturePredictionResult): Promise<string> => {
  const ai = getClient();
  if (!ai) return generateFallbackFutureInsight(result);

  try {
    const modelId = 'gemini-3-flash-preview';
    const prompt = `
      Context: Current ₹${result.currentAmount}, Growth ${result.growthRate}%, Inflation ${result.projectedInflationRate}%.
      Future Nominal: ₹${result.futureNominalAmount}, Future Real: ₹${result.futureRealAmount}.
      Smart Wealth (SIP): ₹${result.wealthSmart} vs Lazy (FD): ₹${result.wealthLazy}.
      
      Provide career/wealth analysis (max 100 words).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });

    return response.text || generateFallbackFutureInsight(result);
  } catch (error: any) {
    console.log("AI Error (Handled):", error.message);
    return generateFallbackFutureInsight(result);
  }
};
