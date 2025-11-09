export type View = 'home' | 'plan' | 'tutor' | 'simulator' | 'flashcards' | 'calendar' | 'writing' | 'mindmap' | 'faq' | 'progress';

export type StudyPlan = {
  Dia: string;
  Disciplina: string;
  Tópico: string;
  'Atividade Sugerida': string;
}[];

export interface QuizQuestion {
  pergunta: string;
  opcoes: string[];
  respostaCorreta: number;
}

export interface Flashcard {
  pergunta: string;
  resposta: string;
}

export interface WritingAnalysis {
  notaGeral: number;
  pontosFortes: string[];
  areasParaMelhorar: string[];
  paragrafoRevisado: string;
}

export interface MindMapNode {
  id: string;
  topic: string;
  children?: MindMapNode[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ExamEvent {
  name: string;
  date: string; // "YYYY-MM-DD"
}
