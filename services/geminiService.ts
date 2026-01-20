
import { GoogleGenAI } from "@google/genai";
import { User, TrainingType } from "../types";

const COACH_MODEL = "gemini-3-flash-preview";

// Helper to create the AI instance just before the call, as per guidelines.
// Throws a specific error if API_KEY is not available.
const getGenAIInstance = () => {
  // Use process.env.API_KEY exclusively as per GenAI coding guidelines.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getCareerAdvice = async (user: User): Promise<string> => {
  try {
    const ai = getGenAIInstance(); // Create instance right before call
    const prompt = `
      Tu es un officier supérieur expérimenté chez les Sapeurs-Pompiers.
      Analyse le profil suivant :
      - Grade: ${user.rank}
      - Qualifications: ${user.qualifications.join(', ')}
      - FCES (Recyclage) à jour: ${user.fcesValid ? 'Oui' : 'Non'}

      Donne un conseil court, motivant et précis (max 3 phrases) pour sa progression de carrière.
      Si le FCES n'est pas à jour, dis-lui que c'est la priorité absolue.
      Adresse-toi directement à l'agent ("Tu...").
    `;

    const response = await ai.models.generateContent({
      model: COACH_MODEL,
      contents: prompt,
    });
    
    return response.text || "Impossible de générer un conseil pour le moment.";
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    // Propagate API_KEY_MISSING or check for other API key related errors from the SDK.
    // Error handling includes checking for "Requested entity was not found." as per guidelines.
    if (error.message?.includes("API_KEY_MISSING") || (error.message && error.message.includes("API Key must be set")) || (error.message && error.message.includes("Requested entity was not found."))) {
      throw new Error("API_KEY_ERROR");
    }
    return "Service de coaching indisponible.";
  }
};

export const generateTrainingDescription = async (title: string, type: TrainingType): Promise<string> => {
  try {
    const ai = getGenAIInstance(); // Create instance right before call
    const prompt = `
      Rédige une description professionnelle et engageante pour une formation de Sapeurs-Pompiers.
      Titre: ${title}
      Type: ${type}
      
      La description doit faire environ 30 à 40 mots. Mets en avant les compétences acquises et l'aspect opérationnel.
      Pas de markdown, juste du texte brut.
    `;

    const response = await ai.models.generateContent({
      model: COACH_MODEL,
      contents: prompt,
    });

    return response.text || "Description non disponible.";
  } catch (error: any) {
    console.error("Gemini Gen Error:", error);
    if (error.message?.includes("API_KEY_MISSING") || (error.message && error.message.includes("API Key must be set")) || (error.message && error.message.includes("Requested entity was not found."))) {
      throw new Error("API_KEY_ERROR");
    }
    return "Erreur lors de la génération de la description.";
  }
};
