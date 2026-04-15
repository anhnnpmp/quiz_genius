import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, BookOpen, ArrowLeft } from 'lucide-react';

const InputSection = ({ onGenerate, isLoading, onBack }) => {
  const [text, setText] = useState('');
  const [deckTitle, setDeckTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onGenerate(text, deckTitle.trim() || 'Untitled Deck');
    }
  };

  return (
    <section className="max-w-4xl mx-auto py-12 px-6 animate-fade-in">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      )}

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
          Create a New Deck
        </h2>
        <p className="text-slate-400 text-lg">
          Paste your notes, articles, or any text below and let QuizGenius do the heavy lifting.
        </p>
      </div>

      <div className="glass-card p-2 shadow-2xl shadow-primary-900/10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Deck Title Input */}
          <div className="px-4 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <label className="text-sm font-semibold text-slate-300">Deck Title</label>
            </div>
            <input
              type="text"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              placeholder="e.g. History of Rome, Biology Chapter 3..."
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm font-medium"
              disabled={isLoading}
            />
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-white/5" />

          {/* Content Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here..."
            className="w-full min-h-[250px] bg-transparent text-white p-6 rounded-xl focus:outline-none resize-none font-medium leading-relaxed"
            disabled={isLoading}
          />
          
          <div className="p-4 bg-slate-900/50 rounded-xl flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span>Gemini AI Engine</span>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="primary-button flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Generate Flashcards</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InputSection;
