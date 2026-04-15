import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key missing. Generation features will be disabled.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Generates flashcards from the provided text using Gemini AI.
 * @param {string} text - The input text to process.
 * @returns {Promise<Array>} - A promise that resolves to an array of flashcard objects.
 * @throws {Error} - Fails if the API call fails or the response is invalid JSON.
 */
export const generateFlashcards = async (text) => {
  if (!genAI) {
    throw new Error("Gemini API is not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash",
    // Ensure we get a structured JSON response
    generationConfig: { 
      responseMimeType: "application/json" 
    }
  });

  // The system prompt as requested by the user
  const prompt = `Extract 4 facts and return strictly as a JSON array: [{front: 'Question', back: 'Answer', difficulty: ''}]
  
  TEXT TO ANALYZE:
  ${text}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    try {
      const parsedData = JSON.parse(responseText);
      
      // Basic validation to ensure it's an array
      if (!Array.isArray(parsedData)) {
        throw new Error("API returned an object instead of an array.");
      }
      
      return parsedData;
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", responseText);
      throw new Error("Invalid response format from AI. Please try again.");
    }
  } catch (error) {
    console.error("Error in generateFlashcards:", error);
    throw error;
  }
};
