
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality } from '@google/genai';

// Safely retrieve API Key avoiding 'process is not defined' errors
// Now checks LocalStorage (Admin Config) if Env Var is missing
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

// Lazy initialization of the AI client for standard calls
let aiInstance: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiInstance) {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn("Gemini API Key is missing. Please add it in the Admin Console.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const connectToLiveSession = async (
  onOpen: () => void,
  onMessage: (message: LiveServerMessage) => void,
  onClose: (event: CloseEvent) => void,
  onError: (event: ErrorEvent) => void,
  systemInstruction?: string
): Promise<LiveSession> => {
  
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please configure it in the Admin Console.");
  }

  const ai = getAiClient();

  // Updated instruction for a more grounded tone
  const defaultInstruction = `You are DeepGetty, an elite, technical, and grounded fitness coach. 
      You are currently observing the user through their camera and listening to them.
      Your goal is to provide real-time feedback on their form and answer questions about the 12 disciplines.
      
      TONE GUIDELINES:
      - Be calm, authoritative, and professional. 
      - Do not be overly perky, "bubbly", or high-pitched.
      - Speak with a steady, encouraging confidence.
      - Be concise.
      
      If you see them standing still, calmly ask if they are ready to start the 'Routine'.
      Refer to classes as 'Routines' only.`;

  return await ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: onOpen,
      onmessage: onMessage,
      onclose: onClose,
      onerror: onError,
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        // Switched from 'Kore' (Bright) to 'Aoede' (Calm/Deep Female)
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
      },
      systemInstruction: systemInstruction || defaultInstruction,
    },
  });
};

// --- Video Generation (Veo) ---

export const generateMarketingVideo = async (prompt: string): Promise<string | null> => {
  // 1. Check if key is selected (Mandatory for Veo)
  // Using type assertion to avoid TypeScript conflicts with global declarations
  const aiStudio = (window as any).aistudio;
  
  if (typeof window !== 'undefined' && aiStudio) {
    const hasKey = await aiStudio.hasSelectedApiKey();
    if (!hasKey) {
      console.log("No API Key selected for Veo. Opening selector...");
      await aiStudio.openSelectKey();
    }
  }

  // 2. Always create a FRESH client for Veo calls to capture the potentially newly selected key
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");
  
  // Do not use getAiClient() here, strictly new instance
  const ai = new GoogleGenAI({ apiKey });

  console.log("Starting Video Generation with Prompt:", prompt);

  try {
    // 3. Initiate Video Generation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    console.log("Video Operation Initiated:", operation);

    // 4. Poll for completion
    while (!operation.done) {
      console.log("Polling video status...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    // 5. Extract URI
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      // Append API Key to fetch the actual bytes/stream
      return `${videoUri}&key=${apiKey}`;
    }

    return null;

  } catch (error: any) {
    console.error("Video Generation Error:", error);

    const errorStr = error.toString();
    const errorMsg = error.message || "";

    // Specific handling for 404 / Entity Not Found (API Key Issue)
    if (
      errorStr.includes("Requested entity was not found") || 
      errorMsg.includes("Requested entity was not found") ||
      (error.status === 404) ||
      (error.error && error.error.code === 404)
    ) {
       console.warn("Veo Model not found with current key. Triggering re-selection.");
       const aiStudio = (window as any).aistudio;
       if (typeof window !== 'undefined' && aiStudio) {
         await aiStudio.openSelectKey();
         throw new Error("API Key rejected or Veo not enabled. Please select a valid API Key.");
       }
    }

    throw error;
  }
};

// --- Audio Helpers (from Google GenAI SDK examples) ---

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalize Int16 to Float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createAudioBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp and convert Float32 to Int16
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: arrayBufferToBase64(int16.buffer),
    mimeType: 'audio/pcm;rate=16000',
  };
}
