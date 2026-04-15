import React, { useState } from 'react';

/**
 * Flashcard Component
 * @param {Object} props
 * @param {string} props.question - The question text
 * @param {string} props.answer - The answer text
 * @param {string} props.difficulty - Difficulty level (e.g., Easy, Medium, Hard)
 */
const Flashcard = ({ question, answer, difficulty }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Difficulty color mapping
  const difficultyColors = {
    Easy: 'text-emerald-500',
    Medium: 'text-amber-500',
    Hard: 'text-rose-500',
  };

  return (
    <div 
      className="group h-[250px] w-full [perspective:1000px] cursor-pointer mb-6"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full p-8 bg-white rounded-3xl shadow-soft border border-slate-100 [backface-visibility:hidden] flex flex-col items-center justify-center text-center">
          {difficulty && (
            <div className={`absolute top-5 right-6 text-[10px] font-bold uppercase tracking-widest ${difficultyColors[difficulty] || 'text-slate-400'}`}>
              {difficulty}
            </div>
          )}
          <p className="text-xl font-semibold text-slate-800 leading-snug">
            {question}
          </p>
          <div className="absolute bottom-5 text-[11px] font-medium text-slate-400 uppercase tracking-tighter">
            Click to flip
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full p-8 bg-white rounded-3xl shadow-soft border border-slate-100 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center text-center">
          <div className="absolute top-5 left-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
            Answer
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            {answer}
          </p>
          <div className="absolute bottom-5 text-[11px] font-medium text-slate-400 uppercase tracking-tighter">
            Click to return
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
