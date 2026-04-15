-- ============================================================
-- QuizGenius — Supabase Database Import Script
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================


-- =====================
-- SECTION 1: DROP & RECREATE (idempotent)
-- =====================
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS decks CASCADE;


-- =====================
-- SECTION 2: CREATE TABLES
-- =====================

CREATE TABLE decks (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
    user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    title       TEXT        NOT NULL,
    description TEXT
);

COMMENT ON TABLE  decks               IS 'Stores flashcard deck metadata created by the user.';
COMMENT ON COLUMN decks.id            IS 'Primary key — auto-generated UUID.';
COMMENT ON COLUMN decks.user_id       IS 'Optional reference to the owning Supabase auth user.';
COMMENT ON COLUMN decks.title         IS 'Human-readable title of the deck.';
COMMENT ON COLUMN decks.description   IS 'Optional summary of the deck content.';


CREATE TABLE flashcards (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL    DEFAULT now(),
    deck_id     UUID        NOT NULL    REFERENCES decks(id) ON DELETE CASCADE,
    question    TEXT        NOT NULL,
    answer      TEXT        NOT NULL,
    difficulty  TEXT        NOT NULL    CHECK (difficulty IN ('Easy', 'Medium', 'Hard'))
);

COMMENT ON TABLE  flashcards              IS 'Individual flashcard items belonging to a deck.';
COMMENT ON COLUMN flashcards.deck_id      IS 'FK to decks. Deleting a deck cascades to its cards.';
COMMENT ON COLUMN flashcards.difficulty   IS 'User-rated or AI-rated difficulty: Easy | Medium | Hard.';


-- =====================
-- SECTION 3: INDEXES
-- =====================

-- Speed up the common query: "get all cards for a deck"
CREATE INDEX idx_flashcards_deck_id ON flashcards(deck_id);

-- Speed up ordering decks by creation date (used in getDecks)
CREATE INDEX idx_decks_created_at ON decks(created_at DESC);


-- =====================
-- SECTION 4: ROW LEVEL SECURITY
-- =====================

ALTER TABLE decks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards  ENABLE ROW LEVEL SECURITY;

-- ⚠️  MVP / Public Access Policies
-- These allow anyone (anon key) to read & write.
-- Replace with user-scoped policies before going to production!

CREATE POLICY "Public: full access to decks"
    ON decks FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Public: full access to flashcards"
    ON flashcards FOR ALL
    USING (true)
    WITH CHECK (true);

-- =====================
-- SECTION 5: SEED DATA
-- =====================

DO $$
DECLARE
    rome_id     UUID;
    js_id       UUID;
    bio_id      UUID;
BEGIN

    -- ── Deck 1: History of Rome ──────────────────────────────
    INSERT INTO decks (title, description)
    VALUES (
        'History of Rome',
        'Key facts about the Roman Empire — society, politics, engineering, and legacy.'
    )
    RETURNING id INTO rome_id;

    INSERT INTO flashcards (deck_id, question, answer, difficulty) VALUES
    (rome_id,
     'What was the "Pax Romana," and why was it significant?',
     'A roughly 200-year period of relative peace and stability across the Roman Empire beginning with Augustus. It enabled the widespread spread of Roman law, infrastructure, and culture.',
     'Medium'),

    (rome_id,
     'Who were the Patricians and the Plebeians in Roman society?',
     'Patricians were wealthy, land-owning aristocrats with hereditary political power. Plebeians were common citizens (farmers, artisans, merchants) who historically had limited political representation.',
     'Easy'),

    (rome_id,
     'Why is the Pantheon so well-preserved compared to other ancient Roman buildings?',
     'It was consecrated as a Christian church (Santa Maria ad Martyres) in 609 AD, which protected it from the looting and material-stripping that destroyed many other structures.',
     'Medium'),

    (rome_id,
     'What were the Punic Wars, and who was the general that famously crossed the Alps?',
     'Three conflicts (264–146 BC) between Rome and Carthage for control of the western Mediterranean. Hannibal Barca was the Carthaginian general who crossed the Alps with war elephants to invade Italy.',
     'Hard'),

    (rome_id,
     'What was the main purpose of Roman aqueducts?',
     'Engineering systems that transported fresh water from distant springs and rivers into cities, supplying public baths, fountains, and private households — a key pillar of Roman public health.',
     'Easy'),

    (rome_id,
     'What event is traditionally used to mark the fall of the Western Roman Empire?',
     'The deposition of the last Western Roman Emperor, Romulus Augustulus, by the Germanic chieftain Odoacer in 476 AD.',
     'Medium'),

    (rome_id,
     'What is the significance of the 12 Tables in Roman history?',
     'The Twelve Tables (c. 450 BC) were Rome''s first written legal code, inscribed on bronze tablets in the Forum. They formed the foundation of Roman law and established the principle that laws should be public and apply to all citizens.',
     'Hard');


    -- ── Deck 2: JavaScript Fundamentals ─────────────────────
    INSERT INTO decks (title, description)
    VALUES (
        'JavaScript Fundamentals',
        'Core concepts every JavaScript developer should know — closures, async, prototypes, and more.'
    )
    RETURNING id INTO js_id;

    INSERT INTO flashcards (deck_id, question, answer, difficulty) VALUES
    (js_id,
     'What is a closure in JavaScript?',
     'A closure is a function that retains access to its outer (lexical) scope even after the outer function has finished executing. This allows inner functions to "remember" variables from their enclosing scope.',
     'Medium'),

    (js_id,
     'What is the difference between `==` and `===` in JavaScript?',
     '`==` performs type coercion before comparison (loose equality), while `===` compares both value and type without coercion (strict equality). Best practice is to always use `===`.',
     'Easy'),

    (js_id,
     'What does the event loop do in JavaScript?',
     'The event loop continuously checks the call stack and the task queue. When the call stack is empty, it pushes the next task from the queue onto the stack, enabling non-blocking asynchronous behavior in a single-threaded runtime.',
     'Hard'),

    (js_id,
     'What is the difference between `null` and `undefined`?',
     '`undefined` means a variable has been declared but not yet assigned a value. `null` is an intentional assignment representing "no value." Both are falsy, but `typeof null` is "object" (a known JavaScript quirk).',
     'Easy'),

    (js_id,
     'What is Promise chaining and how does it work?',
     'Promise chaining allows you to sequence async operations by returning a new promise from each `.then()` handler. Each `.then()` receives the resolved value of the previous promise, and `.catch()` at the end handles any rejection in the chain.',
     'Medium');


    -- ── Deck 3: Biology — Cell Structure ────────────────────
    INSERT INTO decks (title, description)
    VALUES (
        'Biology: Cell Structure',
        'Essential facts about eukaryotic and prokaryotic cell organelles and their functions.'
    )
    RETURNING id INTO bio_id;

    INSERT INTO flashcards (deck_id, question, answer, difficulty) VALUES
    (bio_id,
     'What is the primary function of the mitochondria?',
     'Often called the "powerhouse of the cell," mitochondria produce ATP (adenosine triphosphate) through cellular respiration (specifically oxidative phosphorylation), supplying energy for cellular processes.',
     'Easy'),

    (bio_id,
     'What is the difference between a eukaryotic and a prokaryotic cell?',
     'Eukaryotic cells have a membrane-bound nucleus and organelles (e.g., animals, plants, fungi). Prokaryotic cells (bacteria, archaea) lack a nucleus; their DNA floats freely in the cytoplasm.',
     'Medium'),

    (bio_id,
     'What is the role of the endoplasmic reticulum (ER)?',
     'The rough ER (studded with ribosomes) synthesizes and folds proteins for secretion or membrane use. The smooth ER is involved in lipid synthesis, detoxification, and calcium ion storage.',
     'Medium'),

    (bio_id,
     'What is the function of the Golgi apparatus?',
     'The Golgi apparatus (or Golgi body) processes, packages, and sorts proteins and lipids received from the rough ER, then ships them to their final destinations inside or outside the cell.',
     'Easy'),

    (bio_id,
     'Why do plant cells have a rigid cell wall while animal cells do not?',
     'Plant cell walls, made primarily of cellulose, provide structural rigidity, protection against osmotic pressure, and support for the plant body. Animal cells rely on a flexible plasma membrane and the cytoskeleton for shape.',
     'Hard');

END $$;

-- =====================
-- SECTION 6: VERIFY
-- =====================
SELECT
    d.title                                          AS deck,
    COUNT(f.id)                                      AS total_cards,
    COUNT(f.id) FILTER (WHERE f.difficulty = 'Easy')   AS easy,
    COUNT(f.id) FILTER (WHERE f.difficulty = 'Medium') AS medium,
    COUNT(f.id) FILTER (WHERE f.difficulty = 'Hard')   AS hard
FROM decks d
LEFT JOIN flashcards f ON f.deck_id = d.id
GROUP BY d.id, d.title
ORDER BY d.created_at;
