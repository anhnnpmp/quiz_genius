import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, XCircle, LogOut } from 'lucide-react';
import FlashcardItem from './FlashcardItem';
import { motion, AnimatePresence } from 'framer-motion';
import { updateCardDifficulty } from '../lib/db';

const StudyView = ({ cards: initialCards, onExit }) => {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const goTo = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const nextCard = () => {
    const next = (currentIndex + 1) % cards.length;
    setDirection(1);
    setCurrentIndex(next);
  };

  const prevCard = () => {
    const prev = (currentIndex - 1 + cards.length) % cards.length;
    setDirection(-1);
    setCurrentIndex(prev);
  };

  const handleDifficulty = async (difficulty) => {
    // Optimistically update local state
    const updated = cards.map((c, i) =>
      i === currentIndex ? { ...c, difficulty } : c
    );
    setCards(updated);

    // Persist to DB (non-blocking)
    if (currentCard.id) {
      updateCardDifficulty(currentCard.id, difficulty).catch(console.error);
    }

    // Advance to next card after a brief visual pause
    setTimeout(() => nextCard(), 300);
  };

  const masteredCount = cards.filter(c => c.difficulty === 'Easy').length;
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="container mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[80vh] animate-fade-in">

      {/* Top bar: progress text + exit */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <span className="text-slate-400 text-sm font-medium">
          Card <span className="text-white font-bold">{currentIndex + 1}</span> of {cards.length}
          <span className="ml-3 text-emerald-400 text-xs font-semibold">
            ✓ {masteredCount} mastered
          </span>
        </span>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 text-sm font-medium transition-colors group"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          Exit Study
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-10">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          />
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Card arena */}
      <div className="relative flex items-center justify-center w-full max-w-2xl">
        {/* Desktop side nav */}
        <button
          onClick={prevCard}
          className="absolute -left-16 p-4 rounded-full glass-card hover:bg-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-white group hidden lg:block"
        >
          <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <FlashcardItem card={currentCard} className="h-[400px]" />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={nextCard}
          className="absolute -right-16 p-4 rounded-full glass-card hover:bg-white/10 hover:border-white/20 transition-all text-slate-400 hover:text-white group hidden lg:block"
        >
          <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
        </button>
      </div>

      {/* Difficulty rating buttons */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => handleDifficulty('Hard')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 font-semibold text-sm transition-all group"
        >
          <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Hard
        </button>

        <button
          onClick={() => handleDifficulty('Easy')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 font-semibold text-sm transition-all group"
        >
          <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          I knew this
        </button>
      </div>

      {/* Mobile nav + restart */}
      <div className="mt-8 flex items-center gap-5">
        <button
          onClick={prevCard}
          className="p-4 rounded-full glass-card hover:bg-white/10 text-slate-400 hover:text-white lg:hidden"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => { setDirection(1); setCurrentIndex(0); }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
          <span className="font-semibold text-sm">Restart</span>
        </button>

        <button
          onClick={nextCard}
          className="p-4 rounded-full glass-card hover:bg-white/10 text-slate-400 hover:text-white lg:hidden"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default StudyView;
