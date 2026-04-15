import React from 'react';
import { BrainCircuit, LayoutGrid, PlayCircle, LayoutDashboard } from 'lucide-react';

const Header = ({ viewMode, setViewMode, hasDeck }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-card rounded-none backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo — clicking it always goes back to dashboard */}
        <button
          onClick={() => setViewMode('dashboard')}
          className="flex items-center gap-3 group"
        >
          <div className="p-2 bg-primary-600 rounded-lg shadow-lg shadow-primary-900/40 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            QuizGenius
          </h1>
        </button>

        {/* Nav pills — shown when a deck is loaded */}
        {hasDeck && (
          <nav className="flex items-center bg-slate-900/50 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'dashboard'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid size={18} />
              <span className="text-sm font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('study')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'study'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <PlayCircle size={18} />
              <span className="text-sm font-medium">Study</span>
            </button>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
            v2.0.0
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
