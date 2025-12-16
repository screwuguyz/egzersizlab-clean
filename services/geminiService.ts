import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
} else {
  console.warn("API_KEY not found in environment variables. Gemini features will be disabled.");
}

export const getGeminiResponse = async (userPrompt: string): Promise<string> => {
  if (!ai) {
    return "API Anahtarı eksik. Lütfen yapılandırmayı kontrol edin.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: `Sen 'EgzersizLab' adlı egzersiz ve hareket eğitimi platformunun yapay zeka asistanısın. 
        Kullanıcılara egzersiz programları, hareket bilimi ve sağlıklı yaşam konularında yardımcı olmalısın.
        ÖNEMLİ: Asla tıbbi tanı koyma veya tedavi önerisi verme. "Bir sağlık profesyoneline danışmanızı öneririm" de.
        Tone: Profesyonel, cesaretlendirici ve eğitici.
        Cevapların kısa, öz ve Türkçe olmalı.`,
      },
    });

    return response.text || "Üzgünüm, şu an cevap veremiyorum.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }
};