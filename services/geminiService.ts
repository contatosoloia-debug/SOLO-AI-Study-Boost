
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { StudyPlan, QuizQuestion, Flashcard, WritingAnalysis, MindMapNode, ExamEvent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper function to parse JSON from AI response
const parseJsonResponse = <T>(text: string | undefined): T | null => {
    if (!text) return null;
    try {
        // The API might return the JSON wrapped in markdown backticks.
        const jsonString = text.replace(/^```json\s*|```$/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Original text:", text);
        return null;
    }
};

export const getDailyTip = async (): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Gere uma dica de estudo curta e motivacional para um estudante brasileiro, com no máximo 25 palavras.",
    });
    return response.text;
};

export const generateStudyPlan = async (prompt: string): Promise<StudyPlan | null> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${prompt}\n\n Responda EXCLUSIVAMENTE com um array JSON de objetos, onde cada objeto representa um dia e tem as chaves: "Dia", "Disciplina", "Tópico", "Atividade Sugerida".`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        Dia: { type: Type.STRING },
                        Disciplina: { type: Type.STRING },
                        Tópico: { type: Type.STRING },
                        'Atividade Sugerida': { type: Type.STRING },
                    },
                    required: ["Dia", "Disciplina", "Tópico", "Atividade Sugerida"],
                },
            },
        },
    });
    return parseJsonResponse<StudyPlan>(response.text);
};

export const createChatSession = (): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'Você é um tutor de IA amigável e prestativo chamado Solo. Seu objetivo é ajudar estudantes a entenderem conceitos complexos de forma clara e concisa. Seja paciente, encorajador e use analogias simples sempre que possível. Você está conversando em português do Brasil.',
        },
    });
    return chat;
};

export const generateQuestions = async (topic: string, discipline: string, numQuestions: number): Promise<QuizQuestion[] | null> => {
    const prompt = `Gere ${numQuestions} questões de múltipla escolha sobre o tópico "${topic}" da disciplina "${discipline}".
    As questões devem ser no estilo de vestibulares brasileiros, com 4 opções de resposta.
    Responda EXCLUSIVAMENTE com um array JSON de objetos. Cada objeto deve ter as seguintes chaves:
    - "pergunta": a pergunta (string).
    - "opcoes": um array de 4 strings com as opções.
    - "respostaCorreta": o índice (0 a 3) da resposta correta no array de opções (number).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        pergunta: { type: Type.STRING },
                        opcoes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        respostaCorreta: { type: Type.INTEGER },
                    },
                    required: ["pergunta", "opcoes", "respostaCorreta"],
                },
            },
        },
    });

    return parseJsonResponse<QuizQuestion[]>(response.text);
};

export const generateFlashcards = async (topic: string, discipline: string, numFlashcards: number): Promise<Flashcard[] | null> => {
    const prompt = `Crie ${numFlashcards} flashcards sobre o tópico "${topic}" da disciplina "${discipline}".
    Cada flashcard deve ter uma pergunta e uma resposta curta e direta.
    Responda EXCLUSIVAMENTE com um array JSON de objetos. Cada objeto deve ter as seguintes chaves:
    - "pergunta": a frente do flashcard (string).
    - "resposta": o verso do flashcard (string).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        pergunta: { type: Type.STRING },
                        resposta: { type: Type.STRING },
                    },
                    required: ["pergunta", "resposta"],
                },
            },
        },
    });

    return parseJsonResponse<Flashcard[]>(response.text);
};

export const analyzeWriting = async (text: string, writingType: string): Promise<WritingAnalysis | null> => {
    const prompt = `Analise a seguinte redação para o tipo "${writingType}". O texto é: "${text}".
    Avalie a redação e forneça um feedback detalhado.
    Responda EXCLUSIVAMENTE com um objeto JSON com as seguintes chaves:
    - "notaGeral": uma nota de 0 a 1000 (number).
    - "pontosFortes": um array de strings com os principais acertos.
    - "areasParaMelhorar": um array de strings com sugestões de melhoria.
    - "paragrafoRevisado": reescreva um parágrafo do texto original, aplicando as melhorias sugeridas (string).`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using a more advanced model for a complex task
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    notaGeral: { type: Type.INTEGER },
                    pontosFortes: { type: Type.ARRAY, items: { type: Type.STRING } },
                    areasParaMelhorar: { type: Type.ARRAY, items: { type: Type.STRING } },
                    paragrafoRevisado: { type: Type.STRING },
                },
                required: ["notaGeral", "pontosFortes", "areasParaMelhorar", "paragrafoRevisado"],
            },
        },
    });

    return parseJsonResponse<WritingAnalysis>(response.text);
};


export const generateMindMap = async (topic: string): Promise<MindMapNode | null> => {
    const prompt = `Crie uma estrutura de dados para um mapa mental sobre o tópico "${topic}".
    A estrutura deve ser um objeto JSON aninhado. O objeto raiz e cada filho devem ter as seguintes chaves:
    - "id": uma string de identificação única (ex: "1", "1.1", "1.1.2").
    - "topic": o nome do tópico (string).
    - "children": um array de objetos filhos (pode ser um array vazio).
    A profundidade máxima deve ser de 3 níveis.
    Responda EXCLUSIVAMENTE com o objeto JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    children: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                topic: { type: Type.STRING },
                                children: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            id: { type: Type.STRING },
                                            topic: { type: Type.STRING },
                                            // Fix: Removed invalid recursive 'children' property to adhere to max depth and schema rules.
                                            // The 'children' property is optional for nested nodes, so omitting it here is valid.
                                        },
                                        required: ["id", "topic"]
                                    }
                                }
                            },
                            required: ["id", "topic"]
                        }
                    }
                },
                required: ["id", "topic", "children"],
            },
        },
    });

    return parseJsonResponse<MindMapNode>(response.text);
};

export const findExamDates = async (query: string): Promise<ExamEvent[] | null> => {
    const prompt = `Usando a busca na web, encontre as datas de provas para "${query}".
    Se uma prova tem múltiplas datas (ex: 1º e 2º dia), crie uma entrada para cada uma.
    Responda EXCLUSIVAMENTE com um array JSON de objetos. Cada objeto deve ter as chaves:
    - "name": o nome completo do evento/prova (string).
    - "date": a data no formato "YYYY-MM-DD" (string).
    Se nenhuma data for encontrada, retorne um array vazio.`;

    // Fix: Moved `tools` into `config` and removed `responseMimeType` and `responseSchema` as they are incompatible with the googleSearch tool.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    return parseJsonResponse<ExamEvent[]>(response.text);
};
