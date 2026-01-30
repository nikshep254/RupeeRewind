
import React from 'react';
import { AIAnalysisState } from '../types';

interface AIAnalysisProps {
  state: AIAnalysisState;
  analysisText: string;
  onGenerate: () => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ state, analysisText, onGenerate }) => {
  
  if (state === AIAnalysisState.IDLE) {
    return (
      <div className="mt-8 text-center">
        <button
          onClick={onGenerate}
          className="group inline-flex items-center px-8 py-4 rounded-full border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 text-base font-medium transition-all"
        >
          <svg className="mr-2.5 h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Get AI Economic Context
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-[#151516] border border-white/10 rounded-3xl p-8 shadow-lg relative overflow-hidden">
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
           <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-zinc-100 uppercase tracking-wide">Analysis</h3>
      </div>

      {state === AIAnalysisState.LOADING ? (
         <div className="space-y-4 animate-pulse">
            <div className="h-2.5 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-2.5 bg-zinc-800 rounded w-full"></div>
            <div className="h-2.5 bg-zinc-800 rounded w-5/6"></div>
         </div>
      ) : (
        <div className="prose prose-base prose-invert max-w-none">
          {analysisText.split('\n').map((paragraph, idx) => (
             paragraph.trim() && <p key={idx} className="mb-4 text-zinc-400 leading-relaxed font-light">{paragraph}</p>
          ))}
        </div>
      )}
      
      {state === AIAnalysisState.ERROR && (
         <p className="text-red-400 text-sm mt-2">
           Failed to load insights.
         </p>
      )}
    </div>
  );
};

export default AIAnalysis;
