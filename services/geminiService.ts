import { GoogleGenAI } from "@google/genai";
import { Patient } from "../types";

const apiKey = process.env.API_KEY; 

export const analyzePatientData = async (patient: Patient): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a prompt based on patient data
    const logsSummary = patient.logs.slice(0, 20).map(log => 
      `- ${new Date(log.timestamp).toLocaleString()}: ${log.type} ${log.note ? `(${log.note})` : ''}`
    ).join('\n');

    const prompt = `
      You are a medical assistant analyzing data from a smart medication dispenser for a patient named ${patient.name}.
      Condition: ${patient.condition}.
      
      Current Prescription:
      - Max daily dose: ${patient.config.dailyLimit}
      - Min interval: ${patient.config.intervalMinutes} minutes
      - Allowed window: ${patient.config.allowedStartTime} to ${patient.config.allowedEndTime}

      Recent Usage Logs (Last 20 events):
      ${logsSummary}

      Please provide a brief, professional medical summary (max 3 sentences) identifying if the patient is compliant, adhering to the schedule, or showing signs of addictive behavior (frequent blocked attempts). Address the doctor directly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis could be generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate analysis. Please try again later.";
  }
};