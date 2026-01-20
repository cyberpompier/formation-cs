import { GoogleGenAI } from "@google/genai";
import { User, TrainingType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const COACH_MODEL = "gemini-3-flash-preview";

export const getCareerAdvice = async (user: User): Promise<string> => {
  try {
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
  } catch (error) {
    console.error("Gemini Coach Error:", error);
    return "Service de coaching indisponible.";
  }
};

export const generateTrainingDescription = async (title: string, type: TrainingType): Promise<string> => {
  try {
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
  } catch (error) {
    console.error("Gemini Gen Error:", error);
    return "Erreur lors de la génération de la description.";
  }
};