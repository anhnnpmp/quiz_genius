-- Supabase Setup Script for QuizGenius

-- 1. Create Tables
-- Note: 'decks' is used as per SPEC.md (prompt mentioned 'desks', likely a typo)

CREATE TABLE IF NOT EXISTS decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Access Policies (MVP Mode)
-- These policies allow anyone (including anonymous users) to perform all operations.
-- WARNING: These should be tightened before production!

CREATE POLICY "Allow public access to decks" 
ON decks FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to flashcards" 
ON flashcards FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Insert Mock Data: History of Rome
DO $$
DECLARE
    rome_deck_id UUID;
BEGIN
    -- Create the deck
    INSERT INTO decks (title, description)
    VALUES ('History of Rome', 'A collection of key facts about the Roman Empire, its society, and achievements.')
    RETURNING id INTO rome_deck_id;

    -- Add 5 sample flashcards
    INSERT INTO flashcards (deck_id, question, answer, difficulty)
    VALUES 
    (rome_deck_id, 
     'What was the "Pax Romana," and why was it significant?', 
     'A roughly 200-year period of relative stability and prosperity across the Roman Empire, beginning with Augustus. it allowed for the spread of Roman law, infrastructure, and culture.', 
     'Medium'),
    
    (rome_deck_id, 
     'Who were the Patricians and the Plebeians in Roman society?', 
     'Patricians were the wealthy, land-owning aristocrats with political power. Plebeians were the common citizens (farmers, artisans) who struggled for representation.', 
     'Easy'),
    
    (rome_deck_id, 
     'Why is the Pantheon in Rome so well-preserved compared to other ancient buildings?', 
     'It was consecrated as a Christian church in 609 AD, protecting it from the looting and repurposing of materials that destroyed other structures.', 
     'Medium'),
    
    (rome_deck_id, 
     'What were the Punic Wars, and who was the famous general who famously crossed the Alps to fight Rome?', 
     'Conflicts between Rome and Carthage for Mediterranean dominance. Hannibal was the Carthaginian general who famously crossed the Alps with war elephants.', 
     'Hard'),
    
    (rome_deck_id, 
     'What was the main purpose of Roman aqueducts?', 
     'Complex engineering systems designed to transport fresh water from distant sources into cities for public baths, fountains, and private households.', 
     'Easy');
END $$;
