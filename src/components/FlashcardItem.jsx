import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const difficultyStyles = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const FlashcardItem = ({ card, className }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={twMerge("group perspective h-[300px] cursor-pointer", className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={clsx(
        "card-inner relative w-full h-full duration-700 shadow-xl",
        isFlipped ? "card-flipped" : ""
      )}>
        {/* Front */}
        <div className="card-front glass-card absolute inset-0 w-full h-full p-8 flex flex-col items-center justify-center text-center">
          <div className={clsx(
            "absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
            difficultyStyles[card.difficulty]
          )}>
            {card.difficulty}
          </div>
          <p className="text-xl font-semibold leading-relaxed text-slate-100">
            {card.question}
          </p>
          <div className="absolute bottom-6 flex items-center gap-2 text-slate-500 text-xs font-medium group-hover:text-primary-400 transition-colors">
            <span>Click to flip</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Back */}
        <div className="card-back glass-card absolute inset-0 w-full h-full p-8 flex flex-col items-center justify-center text-center bg-slate-900/80 border-primary-500/20">
          <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 italic">
            Answer
          </div>
          <p className="text-lg text-slate-300 leading-relaxed">
            {card.answer}
          </p>
          <div className="absolute bottom-6 text-slate-500 text-xs font-medium">
            Click to return
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;
