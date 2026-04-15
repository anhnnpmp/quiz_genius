import React from 'react';
import Flashcard from './Flashcard';

/**
 * MasonryGrid Component
 * Displays a list of flashcards in a masonry-style layout using CSS columns.
 * 
 * @param {Object} props
 * @param {Array} props.cards - Array of card objects { question, answer, difficulty }
 */
const MasonryGrid = ({ cards }) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="text-lg font-medium">No cards found. Start by generating some!</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [column-fill:balance]">
        {cards.map((card, index) => (
          <div 
            key={card.id || index} 
            className="break-inside-avoid mb-8 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Flashcard 
              question={card.question}
              answer={card.answer}
              difficulty={card.difficulty}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;
