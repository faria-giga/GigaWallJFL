
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEducationalResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é o assistente educativo oficial do Giga Wall JFL. Você pode realizar pesquisas na web para trazer informações atualizadas sobre tecnologia, design e tendências. Sempre cite as fontes se usar busca. NÃO gere códigos nem imagens.",
        temperature: 0.7,
        topP: 0.95,
        tools: [{ googleSearch: {} }] // Ativa busca em tempo real
      },
    });
    return response.text || "Não foi possível gerar uma resposta educativa no momento.";
  } catch (error) {
    console.error("Gemini Educational Error:", error);
    return "Erro de conexão com o módulo educativo.";
  }
};

export const generateSmartTags = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere 5 tags curtas e relevantes para um conteúdo com o título "${title}" e a descrição "${description}". Retorne apenas as tags separadas por vírgula, sem explicações.`,
      config: {
        systemInstruction: "Você é um especialista em SEO e metadados para a plataforma Giga Wall JFL.",
        temperature: 0.5,
      },
    });
    return response.text?.split(',').map(tag => tag.trim().toLowerCase().replace('#', '')) || [];
  } catch (error) {
    console.error("Gemini Tagging Error:", error);
    return [];
  }
};

export const checkModeration = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise o seguinte texto para moderação na plataforma Giga Wall JFL: "${text}". Ele viola direitos autorais, contém discurso de ódio ou é excessivamente ofensivo? Responda em formato JSON com 'status' (SAFE ou VIOLATION) e 'reason'.`,
      config: {
        systemInstruction: "Você é o algoritmo de moderação inteligente do Giga Wall JFL. Seja rigoroso com as políticas da comunidade.",
        responseMimeType: "application/json"
      }
    });
    
    try {
      return JSON.parse(response.text);
    } catch {
      return { status: 'SAFE', reason: '' };
    }
  } catch (error) {
    console.error("Moderation Error:", error);
    return { status: 'SAFE', reason: 'Falha na verificação' };
  }
};
