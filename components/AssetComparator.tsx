
import React, { useState, useEffect } from 'react';
import { ASSET_BENCHMARKS } from '../constants';
import InfoTooltip from './InfoTooltip';
import { getProductPriceHistory } from '../services/geminiService';

interface AssetComparatorProps {
  yearThen: number;
  yearNow: number;
}

const AssetComparator: React.FC<AssetComparatorProps> = ({ yearThen, yearNow }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('sneakers');
  const [isOpen, setIsOpen] = useState(false);
  
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customResult, setCustomResult] = useState<{name: string, priceThen: number, priceNow: number} | null>(null);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const getApproxPrice = (prices: { [year: number]: number }, targetYear: number) => {
    if (prices[targetYear]) return prices[targetYear];

    const years = Object.keys(prices).map(Number).sort((a, b) => a - b);
    
    if (targetYear <= years[0]) return prices[years[0]];
    if (targetYear >= years[years.length - 1]) return prices[years[years.length - 1]];

    for (let i = 0; i < years.length - 1; i++) {
        if (targetYear > years[i] && targetYear < years[i+1]) {
            const startYear = years[i];
            const endYear = years[i+1];
            const startPrice = prices[startYear];
            const endPrice = prices[endYear];
            const fraction = (targetYear - startYear) / (endYear - startYear);
            return startPrice + (endPrice - startPrice) * fraction;
        }
    }
    return 0;
  };

  const selectedAsset = selectedAssetId ? ASSET_BENCHMARKS.find(a => a.id === selectedAssetId) : null;
  const priceThen = isCustomMode ? customResult?.priceThen || 0 : (selectedAsset ? getApproxPrice(selectedAsset.prices, yearThen) : 0);
  const priceNow = isCustomMode ? customResult?.priceNow || 0 : (selectedAsset ? getApproxPrice(selectedAsset.prices, yearNow) : 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCustomSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!customQuery.trim()) return;
      
      setIsSearching(true);
      const result = await getProductPriceHistory(customQuery, yearThen);
      setCustomResult(result);
      setIsSearching(false);
  };

  return (
    <div className="bg-white dark:bg-[#151516] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 relative overflow-visible z-30 shadow-lg transition-colors duration-300">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-widest flex items-center">
                Asset Price Reality
                <InfoTooltip text="See how the price of cars, bikes, and gadgets has exploded!" />
            </h3>
            
            <div className="relative">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                >
                   {isCustomMode 
                     ? (customResult ? `🔍 ${customResult.name}` : '🔍 Custom Search')
                     : (selectedAsset ? `${selectedAsset.emoji} ${selectedAsset.name}` : '+ Compare Asset')
                   }
                   <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                </button>
                
                {isOpen && (
                    <>
                    <div className="fixed inset-0 z-40 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-72 max-h-[400px] bg-white dark:bg-[#1c1c1e] border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl z-50 flex flex-col">
                        
                        <div className="p-3 border-b border-zinc-100 dark:border-white/10">
                            <h4 className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 mb-2">Search Anything</h4>
                            <form onSubmit={(e) => { handleCustomSearch(e); setIsOpen(false); setIsCustomMode(true); setSelectedAssetId(null); }}>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Nike Jordan, Rolex" 
                                        value={customQuery}
                                        onChange={(e) => setCustomQuery(e.target.value)}
                                        className="w-full bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1.5 text-xs text-black dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button type="submit" className="bg-blue-600 px-2 py-1 rounded text-xs font-bold text-white">Go</button>
                                </div>
                            </form>
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {ASSET_BENCHMARKS.map((asset) => (
                                <button
                                    key={asset.id}
                                    onClick={() => {
                                        setSelectedAssetId(asset.id);
                                        setIsCustomMode(false);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border-b border-zinc-100 dark:border-white/5 last:border-0 flex items-center gap-3 transition-colors"
                                >
                                    <span className="text-xl">{asset.emoji}</span>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{asset.name}</span>
                                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{asset.example}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>

        {isSearching ? (
             <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                 <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
                 <span className="text-xs text-zinc-500 dark:text-zinc-300">Searching History...</span>
             </div>
        ) : (!selectedAsset && !isCustomMode) ? (
             <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 text-zinc-500 dark:text-zinc-400 text-sm">
                <span>Select an asset to check inflation</span>
                <span className="text-xs opacity-50 mt-1">(Cars, Bikes, Weddings, etc.)</span>
             </div>
        ) : (
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-white/5 flex flex-col justify-between h-full">
                    <div>
                         <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{yearThen} Price</div>
                         <div className="text-xl font-bold text-zinc-800 dark:text-zinc-200">{formatCurrency(priceThen)}</div>
                    </div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-2 pt-2 border-t border-zinc-200 dark:border-white/5">Then</div>
                </div>
                
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-white/5 relative flex flex-col justify-between h-full overflow-hidden">
                     <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl"></div>

                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 border border-zinc-300 dark:border-black text-zinc-500 dark:text-zinc-300 z-10">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>

                    <div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{yearNow} Price</div>
                        <div className="text-xl font-black text-zinc-900 dark:text-white">{formatCurrency(priceNow)}</div>
                    </div>
                     <div className="text-[10px] text-zinc-500 dark:text-zinc-500 mt-2 pt-2 border-t border-zinc-200 dark:border-white/5 flex justify-between items-center z-10 relative">
                        <span>Now</span>
                        <span className="text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded">
                            {priceThen > 0 ? (priceNow/priceThen).toFixed(1) : 0}x Rise
                        </span>
                    </div>
                </div>
             </div>
        )}
    </div>
  );
};

export default AssetComparator;
