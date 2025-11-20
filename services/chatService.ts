
import { GoogleGenAI } from '@google/genai';

// Safely retrieve API Key avoiding 'process is not defined' errors
const getApiKey = () => {
  try {
    // 1. Check Environment Variable (Priority)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // 2. Check LocalStorage (Admin Config)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedKey = window.localStorage.getItem('dg_key_gemini');
      if (storedKey) return storedKey;
    }
    return '';
  } catch (e) {
    return '';
  }
};

let aiInstance: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiInstance) {
    const apiKey = getApiKey();
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const streamChatResponse = async (
  messages: ChatMessage[],
  systemInstruction: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getAiClient();
    
    // We use gemini-2.5-flash for quick text responses
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessageStream({ message: lastMessage });

    for await (const chunk of result) {
        // The SDK returns chunks, we extract text
        const text = chunk.text;
        if (text) {
            onChunk(text);
        }
    }
  } catch (error) {
    console.error("Chat Error:", error);
    onChunk("I apologize, but I am having trouble connecting to the Deep Getty network right now. Please check your connection or API configuration.");
  }
};
