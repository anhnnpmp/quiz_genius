import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key missing. Generation features will be disabled.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const generateFlashcards = async (text) => {
  if (!genAI) return null;

  const model = genAI.getGenerativeModel({
    // model: "gemini-3-flash",
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Analyze the provided text and generate a structured JSON object containing a title for the deck and an array of flashcards. 
    Each flashcard must have a 'question', an 'answer', and a 'difficulty' rating (Easy, Medium, or Hard) based on the complexity of the concept.
    
    TEXT TO CONVERT:
    "${text}"

    RESPONSE SCHEMA:
    {
      "title": "Topic Name",
      "description": "Short summary",
      "flashcards": [
        {
          "question": "The question content",
          "answer": "The answer content",
          "difficulty": "Easy" | "Medium" | "Hard"
        }
      ]
    }
    
    Return ONLY the valid JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};
