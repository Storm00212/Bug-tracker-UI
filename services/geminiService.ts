import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateIssueDescription = async (title: string): Promise<string> => {
  try {
    const prompt = `
      Based on the bug title "${title}", generate a detailed, professional bug report description for a project management system like Jira.
      The description should be clear, concise, and structured. Include sections for:
      - **Summary:** A brief overview of the issue.
      - **Steps to Reproduce:** A numbered list of steps to trigger the bug.
      - **Expected Result:** What should have happened.
      - **Actual Result:** What actually happened.
      Format the output using markdown. Do not include the title in the description itself.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating issue description:", error);
    return "There was an error generating the description with AI. Please try again or write it manually.";
  }
};