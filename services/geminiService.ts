
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, Flashcard, MindMapNode, QuizQuestion, StudyPlan, WritingAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// FIX: Removed unused and deprecated generationConfig object.

// Helper to extract JSON from Gemini's markdown-formatted response
const extractJson = <T,>(text: string): T | null => {
    try {
        const match = text.match(/```json\n([\s\S]*?)\n```/);
        if (match && match[1]) {
            return JSON.parse(match[1]) as T;
        }
        // Fallback for non-fenced JSON
        return JSON.parse(text) as T;
    } catch (error) {
        console.error("Failed to parse JSON from Gemini response:", error);
        console.error("Original text:", text);
        return null;
    }
};

export const getDailyTip = async (): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Gere uma dica de estudo curta e inspiradora ou uma frase motivacional para um estudante brasileiro se preparando para concursos. Seja breve e direto.",
    });
    return response.text;
};

export const generateStudyPlan = async (prompt: string): Promise<StudyPlan | null> => {
    const fullPrompt = `${prompt}. A resposta DEVE ser um JSON array. Cada objeto no array deve ter as seguintes chaves: "Dia", "Disciplina", "Tópico" e "Atividade Sugerida". Não inclua nenhum texto ou formatação fora do JSON.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        "Dia": { type: Type.STRING },
                        "Disciplina": { type: Type.STRING },
                        "Tópico": { type: Type.STRING },
                        "Atividade Sugerida": { type: Type.STRING },
                    },
                    required: ["Dia", "Disciplina", "Tópico", "Atividade Sugerida"]
                }
            }
        }
    });

    try {
        return JSON.parse(response.text) as StudyPlan;
    } catch(e) {
        console.error("Error parsing study plan JSON", e);
        return null;
    }
};

export const createChatSession = (history: ChatMessage[]): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history,
        config: {
            systemInstruction: 'Você é um tutor IA para estudantes brasileiros. Seja amigável, didático e ajude a explicar conceitos complexos de forma simples.',
        },
    });
};


export const generateQuestions = async (topic: string, subject: string, count: number): Promise<QuizQuestion[] | null> => {
    const prompt = `Gere ${count} questões de múltipla escolha sobre o tópico "${topic}" na disciplina de "${subject}". Formate a resposta como um JSON array. Cada objeto deve ter: 'pergunta' (string), 'opcoes' (array de 4 strings), e 'respostaCorreta' (índice da resposta correta, de 0 a 3).`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return extractJson<QuizQuestion[]>(response.text);
};


export const generateFlashcards = async (topic: string, subject: string, count: number): Promise<Flashcard[] | null> => {
    const prompt = `Crie ${count} flashcards sobre "${topic}" em "${subject}". A resposta deve ser um JSON array onde cada objeto tem 'pergunta' e 'resposta'.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return extractJson<Flashcard[]>(response.text);
};

export const generateCalendarMotivation = async (month: number, year: number): Promise<Record<string, string> | null> => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prompt = `Gere ${daysInMonth} mensagens motivacionais ou dicas de estudo curtas para um estudante, uma para cada dia do mês. A resposta deve ser um objeto JSON onde a chave é o dia (1, 2, 3...) e o valor é a mensagem.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return extractJson<Record<string, string>>(response.text);
};

export const analyzeWriting = async (text: string, type: string): Promise<WritingAnalysis | null> => {
    const prompt = `Analise a seguinte redação do tipo "${type}":\n\n"${text}"\n\nForneça uma análise estruturada como um objeto JSON com as chaves: 'notaGeral' (0-1000), 'pontosFortes' (array de strings), 'areasParaMelhorar' (array de strings), e 'paragrafoRevisado' (uma versão melhorada de um parágrafo).`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return extractJson<WritingAnalysis>(response.text);
};

export const generateMindMap = async (topic: string): Promise<MindMapNode | null> => {
    const prompt = `Crie uma estrutura de mapa mental para o tópico central "${topic}". A resposta deve ser um objeto JSON aninhado. O objeto raiz deve ter 'id' (string), 'topic' (string), e 'children' (um array de objetos com a mesma estrutura). Crie 2 a 3 níveis de profundidade.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return extractJson<MindMapNode>(response.text);
};
