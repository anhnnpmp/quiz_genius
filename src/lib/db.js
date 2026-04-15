import { supabase } from './supabase';

/**
 * Saves a generated flashcard deck and its cards to Supabase.
 * @param {Object} deckData - The deck data containing title, description, and flashcards.
 * @returns {Promise<Object>} - The saved deck metadata.
 */
export const saveDeck = async (deckData) => {
  if (!supabase) {
    throw new Error("Supabase client not initialized. Check your environment variables.");
  }

  try {
    // 1. Insert the deck into the 'decks' table
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert([
        { 
          title: deckData.title, 
          description: deckData.description 
        }
      ])
      .select()
      .single();

    if (deckError) throw deckError;

    // 2. Prepare flashcards with the new deck_id
    const cardsToInsert = deckData.flashcards.map(card => ({
      deck_id: deck.id,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty
    }));

    // 3. Batch insert flashcards into the 'flashcards' table
    const { error: cardsError } = await supabase
      .from('flashcards')
      .insert(cardsToInsert);

    if (cardsError) throw cardsError;

    return deck;
  } catch (error) {
    console.error("Error saving deck to Supabase:", error);
    throw error;
  }
};

/**
 * Fetches all decks, each enriched with total card count and mastered (Easy) card count.
 * @returns {Promise<Array>} - List of deck objects with `totalCards` and `masteredCards`.
 */
export const getDecks = async () => {
  if (!supabase) return [];

  try {
    // Fetch all decks with their flashcards (only need difficulty for stats)
    const { data: decks, error } = await supabase
      .from('decks')
      .select('*, flashcards(difficulty)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Compute stats client-side from the joined flashcards data
    return (decks || []).map(deck => {
      const cards = deck.flashcards || [];
      return {
        ...deck,
        flashcards: undefined, // remove raw cards from deck object to keep it lean
        totalCards: cards.length,
        masteredCards: cards.filter(c => c.difficulty === 'Easy').length,
      };
    });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return [];
  }
};

/**
 * Fetches all flashcards belonging to a specific deck.
 * @param {string} deckId - The UUID of the deck.
 * @returns {Promise<Array>} - List of flashcard objects.
 */
export const getDeckCards = async (deckId) => {
  if (!supabase) return [];

  try {
    const { data: cards, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return cards || [];
  } catch (error) {
    console.error("Error fetching deck cards:", error);
    return [];
  }
};

/**
 * Updates the difficulty of a single flashcard.
 * @param {string} cardId - The UUID of the flashcard.
 * @param {'Easy'|'Medium'|'Hard'} difficulty - The new difficulty value.
 * @returns {Promise<void>}
 */
export const updateCardDifficulty = async (cardId, difficulty) => {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('flashcards')
      .update({ difficulty })
      .eq('id', cardId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating card difficulty:", error);
    throw error;
  }
};
