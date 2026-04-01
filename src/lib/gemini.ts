import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'mock-key';
export const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiChatResponse = async (prompt: string, contextData: string = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const fullPrompt = contextData 
      ? `Context (Household Data): ${contextData}\n\nUser Question: ${prompt}\n\nPlease answer based on the context provided about waste management and user's specific stats.`
      : prompt;
      
    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I am unable to process your request at the moment.";
  }
};

export const analyzeBinPhoto = async (photoBase64: string, mimeType: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = 'Analyze this image of a waste bin. Determine the fill percentage (0-100) and classify the primary waste type visible (e.g., Organic, Recyclable, Hazardous, Mixed). Return the result strictly as a valid JSON object without any backticks, markdown, or extra text. Example: {"fillPercentage": 85, "wasteType": "Mixed"}';
    
    // photoBase64 should be a base64 string without the 'data:image/x;base64,' prefix
    const imageParts = [
      {
        inlineData: {
          data: photoBase64,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    let responseText = result.response.text().trim();
    
    // Basic cleanup just in case Gemini wrap it in markdown block despite instructions
    if (responseText.startsWith("```json")) {
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return { fillPercentage: null, wasteType: 'Unknown' };
  }
};
