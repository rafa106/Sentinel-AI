import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeThreat(content: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following content for cybersecurity threats (phishing, malware, social engineering, etc.). 
      Return a JSON object with:
      - riskLevel: "Low", "Medium", "High", or "Critical"
      - threatType: string (e.g., "Phishing", "Malware", "Safe")
      - explanation: string (brief explanation of the risk)
      - recommendations: string[] (list of actions to take)
      
      Content to analyze: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            threatType: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["riskLevel", "threatType", "explanation", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      riskLevel: "Unknown",
      threatType: "Error",
      explanation: "Failed to analyze content.",
      recommendations: ["Check your connection and try again."]
    };
  }
}

export async function generateSecurityReport(answers: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the following security audit answers, generate a professional cybersecurity report.
      Answers: ${JSON.stringify(answers)}
      
      Return a JSON object with:
      - overallScore: number (0-100)
      - summary: string
      - criticalFindings: string[]
      - actionPlan: string[]`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            criticalFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["overallScore", "summary", "criticalFindings", "actionPlan"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return null;
  }
}
