import {GoogleGenerativeAI} from '@google/generative-ai';

const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = gemini.getGenerativeModel({
    model: 'gemini-1.5-flash',
})

export async function generateResponse(prompt){
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Generated response:", text);
        return text;
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
}