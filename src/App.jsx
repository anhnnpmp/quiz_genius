import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InputSection from './components/InputSection';
import MasonryGrid from './components/MasonryGrid';
import StudyView from './components/StudyView';
import { generateFlashcards } from './lib/gemini';
import { saveDeck, getDecks, getDeckCards } from './lib/db';
import { Loader2, Sparkles, AlertCircle, GraduationCap, ArrowLeft } from 'lucide-react';

function App() {
  // ─── View state ────────────────────────────────────────────────────────────
  // "dashboard" | "create" | "grid" | "study"
  const [viewMode, setViewMode] = useState('dashboard');

  // ─── Deck state ─────────────────────────────────────────────────────────────
  const [decks, setDecks] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);   // deck metadata object
  const [currentCards, setCurrentCards] = useState([]);   // cards for the current deck

  // ─── UI state ───────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Load all decks on mount ────────────────────────────────────────────────
  const fetchDecks = useCallback(async () => {
    setIsDashboardLoading(true);
    const data = await getDecks();
    setDecks(data);
    setIsDashboardLoading(false);
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // ─── Select a deck and load its cards ───────────────────────────────────────
  const handleSelectDeck = async (deck) => {
    setCurrentDeck(deck);
    setIsLoadingCards(true);
    setViewMode('grid');
    const cards = await getDeckCards(deck.id);
    setCurrentCards(cards);
    setIsLoadingCards(false);
  };

  // ─── Generate a new deck via Gemini, then save and open it ──────────────────
  const handleGenerate = async (text, title) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateFlashcards(text);
      if (data) {
        // Use the user-supplied title if provided, otherwise fall back to AI title
        const deckTitle = title || data.title || 'Generated Deck';
        const deckDescription = data.description || 'AI-generated study material';

        // Save to Supabase
        const savedDeck = await saveDeck({
          title: deckTitle,
          description: deckDescription,
          flashcards: data.flashcards || [],
        });

        // Build the enriched deck object for local state
        const newDeck = {
          ...savedDeck,
          totalCards: (data.flashcards || []).length,
          masteredCards: 0,
        };

        // Update dashboard decks list (prepend the new deck)
        setDecks(prev => [newDeck, ...prev]);

        // Set as current and switch to grid
        setCurrentDeck(newDeck);
        setCurrentCards(data.flashcards || []);
        setViewMode('grid');
      }
    } catch (err) {
      console.error('Flashcard generation error:', err);
      setError('Failed to generate cards. The AI might be busy or the input was invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Navigation helpers ──────────────────────────────────────────────────────
  const goToDashboard = () => {
    setViewMode('dashboard');
    setCurrentDeck(null);
    setCurrentCards([]);
    // Refresh deck stats in case difficulty changed during study
    fetchDecks();
  };

  const goToStudy = () => setViewMode('study');
  const exitStudy = () => setViewMode('grid');

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        hasDeck={currentCards.length > 0}
      />

      <main>
        {/* ── DASHBOARD ─────────────────────────────────────────────────── */}
        {viewMode === 'dashboard' && (
          <Dashboard
            decks={decks}
            isLoading={isDashboardLoading}
            onSelectDeck={handleSelectDeck}
            onCreateNew={() => setViewMode('create')}
          />
        )}

        {/* ── CREATE (Input) ─────────────────────────────────────────────── */}
        {viewMode === 'create' && (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <InputSection
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onBack={() => setViewMode('dashboard')}
            />

            {/* Loading overlay */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Analyzing Content</h3>
                  <p className="text-slate-400 animate-pulse">Our AI is distilling your text into key concepts...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* ── GRID VIEW ─────────────────────────────────────────────────── */}
        {viewMode === 'grid' && currentDeck && (
          <div className="animate-fade-in pb-20">
            {/* Deck header bar */}
            <div className="container mx-auto px-6 py-8 border-b border-white/5 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={goToDashboard}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Dashboard
                </button>
                <div className="w-px h-4 bg-white/10" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentDeck.title}</h2>
                  {currentDeck.description && (
                    <p className="text-slate-400 text-sm mt-0.5">{currentDeck.description}</p>
                  )}
                </div>
              </div>

              <button
                onClick={goToStudy}
                disabled={currentCards.length === 0}
                className="primary-button flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <GraduationCap className="w-4 h-4" />
                Start Studying
              </button>
            </div>

            {/* Cards loading */}
            {isLoadingCards ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                <p className="text-slate-400 animate-pulse">Loading cards...</p>
              </div>
            ) : (
              <MasonryGrid cards={currentCards} />
            )}
          </div>
        )}

        {/* ── STUDY MODE ────────────────────────────────────────────────── */}
        {viewMode === 'study' && currentCards.length > 0 && (
          <StudyView cards={currentCards} onExit={exitStudy} />
        )}
      </main>
    </div>
  );
}

export default App;
