import React from 'react';
import FlashcardItem from './FlashcardItem';

const FlashcardGrid = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="container mx-auto px-6 py-12 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <FlashcardItem key={index} card={card} />
        ))}
      </div>
    </div>
  );
};

export default FlashcardGrid;
