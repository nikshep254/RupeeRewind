
import React, { useState, useEffect } from 'react';
import ZazzyPuppy from './NikiPuppy';

interface OnboardingProps {
  onComplete: (name: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    // Small delay for animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const steps = [
    {
      type: "input",
      title: "Woof! Hi there!",
      description: "I'm Zazzy! I'll be your guide today! RupeeRewind is the smartest way to see what your money is really worth. First, what should I call you?",
      icon: <ZazzyPuppy mood="excited" className="w-24 h-24" />
    },
    {
      type: "info",
      title: `Nice to meet you, ${name}!`,
      description: "Inflation is like when my treats get smaller but cost the same! I'll help you calculate the 'Real Value' of your past money/income in today's terms!",
      icon: <ZazzyPuppy mood="happy" className="w-24 h-24" />
    },
    {
      type: "info",
      title: "The 'Extra Treats' Rule!",
      description: "As you grow, your tastes get fancier! I automatically add a hidden buffer for 'Lifestyle Inflation' because you deserve better than just surviving!",
      icon: (
        <div className="relative">
             <div className="text-6xl animate-bounce">🍖</div>
        </div>
      )
    },
    {
      type: "info",
      title: "Big City Life!",
      description: "Moving from a small town to a metro? That costs way more bones! Use the 'Metro Mover' option to adjust for the higher cost of living in big cities!",
      icon: (
        <div className="relative">
             <div className="text-6xl animate-pulse">🏙️</div>
        </div>
      )
    },
    {
      type: "info",
      title: "Pick Your Poison!",
      description: "What drains your wallet? Weddings? Education? Hospitals? Select your 'Inflation Domain' to see how specific rising costs impact you!",
      icon: (
        <div className="relative">
             <div className="text-6xl animate-spin-slow">💊</div>
        </div>
      )
    },
    {
      type: "info",
      title: "Burying Bones (Gold)!",
      description: "Paper money loses value, but Gold stays shiny! I'll check if you would have been richer if you just hoarded gold bars instead of cash!",
      icon: (
        <div className="relative">
            <div className="text-6xl animate-pulse">⚱️</div>
        </div>
      )
    },
    {
      type: "info",
      title: "Future Predictions!",
      description: "I can peek into the future too! Switch to 'Future Projection' mode to see if your next raise will actually beat inflation or just match it!",
      icon: <ZazzyPuppy mood="curious" className="w-24 h-24" />
    },
    {
      type: "info",
      title: "AI Powered Wisdom!",
      description: "I'm cute, but the AI is smart! After calculating, tap 'Get AI Context' for a deep economic dive into your specific financial reality!",
      icon: (
         <div className="relative">
             <div className="text-6xl animate-bounce">🤖</div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step === 0 && !name.trim()) return; 
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsVisible(false);
      setTimeout(() => onComplete(name), 300); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNext();
  }

  const currentStep = steps[step];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-[#151516] border border-white/10 w-full max-w-lg rounded-[2rem] shadow-2xl p-8 relative overflow-hidden flex flex-col min-h-[550px]">
        {/* Playful Background Gradients */}
        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>

        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 animate-fadeIn w-full">
          <div className="mb-6 p-4 transform transition-transform hover:scale-110 duration-300">
            {currentStep.icon}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight leading-tight">{currentStep.title}</h2>
          
          {currentStep.type === 'input' ? (
             <div className="w-full max-w-xs animate-slideIn">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your name"
                  autoFocus
                  className="w-full bg-zinc-800 border border-zinc-600 text-white px-6 py-4 rounded-xl text-center focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-zinc-500 font-bold text-xl"
                />
                 <p className="text-zinc-400 text-sm mt-6 leading-relaxed">{currentStep.description}</p>
             </div>
          ) : (
             <p className="text-zinc-400 text-base leading-relaxed max-w-sm">{currentStep.description}</p>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between z-10">
          <div className="flex space-x-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-1.5 bg-zinc-800'}`}
              />
            ))}
          </div>
          <button 
            onClick={handleNext}
            disabled={step === 0 && !name.trim()}
            className={`px-8 py-3 text-sm font-bold rounded-full transition-all transform active:scale-95 ${
                step === 0 && !name.trim() 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
            }`}
          >
            {step === steps.length - 1 ? "Let's Go!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
