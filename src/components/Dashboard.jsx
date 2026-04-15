import React from 'react';
import { BookOpen, Plus, Star, Layers, ChevronRight, Loader2 } from 'lucide-react';

const DeckCard = ({ deck, onClick }) => {
  const progress = deck.totalCards > 0
    ? Math.round((deck.masteredCards / deck.totalCards) * 100)
    : 0;

  const difficultyColor =
    progress >= 80 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    : progress >= 40 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    : 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';

  return (
    <button
      onClick={onClick}
      className="group relative glass-card p-6 text-left flex flex-col gap-4 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer w-full"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all mt-1" />
      </div>

      {/* Title & Description */}
      <div className="flex-1">
        <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-indigo-200 transition-colors">
          {deck.title}
        </h3>
        {deck.description && (
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {deck.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
        {/* Card count */}
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>{deck.totalCards} cards</span>
        </div>

        {/* Mastered badge */}
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${difficultyColor}`}>
          <Star className="w-3 h-3" />
          Mastered: {deck.masteredCards}/{deck.totalCards}
        </span>
      </div>

      {/* Progress bar */}
      {deck.totalCards > 0 && (
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
};

const Dashboard = ({ decks, isLoading, onSelectDeck, onCreateNew }) => {
  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">My Decks</h2>
          <p className="text-slate-400 mt-1">
            {isLoading ? 'Loading your decks...' : `${decks.length} deck${decks.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="primary-button flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Deck
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          <p className="text-slate-400 animate-pulse">Loading your decks...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && decks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 space-y-5 text-center">
          <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <BookOpen className="w-12 h-12 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">No decks yet</h3>
            <p className="text-slate-400 max-w-sm">
              Create your first deck by pasting any text and letting AI generate flashcards for you.
            </p>
          </div>
          <button onClick={onCreateNew} className="primary-button flex items-center gap-2 mt-2">
            <Plus className="w-4 h-4" />
            Create First Deck
          </button>
        </div>
      )}

      {/* Decks grid */}
      {!isLoading && decks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {decks.map(deck => (
            <DeckCard key={deck.id} deck={deck} onClick={() => onSelectDeck(deck)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
