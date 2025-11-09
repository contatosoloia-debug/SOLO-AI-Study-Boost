
import React, { useState } from 'react';
import { generateFlashcards } from '../services/geminiService';
import { Flashcard } from '../types';
import { LoadingSpinner } from './icons';

type FlashcardState = 'setup' | 'review' | 'results';

const Flashcards: React.FC = () => {
    const [discipline, setDiscipline] = useState('');
    const [topic, setTopic] = useState('');
    const [numFlashcards, setNumFlashcards] = useState(10);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [results, setResults] = useState({ correct: 0, incorrect: 0 });
    
    const [viewState, setViewState] = useState<FlashcardState>('setup');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const startReview = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await generateFlashcards(topic, discipline, numFlashcards);
            if (result && result.length > 0) {
                setFlashcards(result);
                setViewState('review');
            } else {
                setError('Não foi possível gerar os flashcards. Tente um tópico diferente.');
            }
        } catch (err) {
            setError('Erro ao comunicar com a IA. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleEvaluation = (correct: boolean) => {
        if (correct) {
            setResults(prev => ({...prev, correct: prev.correct + 1}));
        } else {
            setResults(prev => ({...prev, incorrect: prev.incorrect + 1}));
        }
        
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            setViewState('results');
        }
    };

    const exportToCsv = () => {
        let csvContent = "data:text/csv;charset=utf-8,Pergunta;Resposta\n";
        flashcards.forEach(card => {
            csvContent += `"${card.pergunta}";"${card.resposta}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "flashcards_anki.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const restart = () => {
        setDiscipline('');
        setTopic('');
        setNumFlashcards(10);
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
        setResults({ correct: 0, incorrect: 0 });
        setViewState('setup');
    };

    if (viewState === 'setup') {
        return (
            <div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#f9fafb]">Flashcards com IA</h1>
                    <p className="text-[#9ca3af] mt-1 mb-6">Crie flashcards sobre qualquer assunto para otimizar sua revisão.</p>
                </div>
                <div className="max-w-lg mx-auto bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                     <div className="space-y-6">
                        <div>
                            <label htmlFor="discipline" className="block text-sm font-medium text-[#9ca3af]">Disciplina</label>
                            <input type="text" id="discipline" value={discipline} onChange={e => setDiscipline(e.target.value)} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]" placeholder="Ex: Biologia" required />
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-[#9ca3af]">Tópico</label>
                            <input type="text" id="topic" value={topic} onChange={e => setTopic(e.target.value)} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]" placeholder="Ex: Ciclo de Krebs" required />
                        </div>
                        <div>
                            <label htmlFor="numFlashcards" className="block text-sm font-medium text-[#9ca3af]">Número de Flashcards: {numFlashcards}</label>
                            <input type="range" id="numFlashcards" min="5" max="25" value={numFlashcards} onChange={e => setNumFlashcards(Number(e.target.value))} className="w-full h-2 bg-[#374151] rounded-lg appearance-none cursor-pointer" />
                        </div>
                        {error && <p className="text-sm text-[#ef4444]">{error}</p>}
                        <button onClick={startReview} disabled={isLoading || !discipline || !topic} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] disabled:bg-[#374151] disabled:cursor-not-allowed">
                            {isLoading ? <LoadingSpinner /> : 'Criar Flashcards'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (viewState === 'review') {
        const card = flashcards[currentIndex];
        return (
            <div className="flex flex-col items-center">
                <p className="text-[#9ca3af] mb-4">Card {currentIndex + 1} de {flashcards.length}</p>
                <div className="w-full max-w-xl h-80 perspective-1000">
                    <div
                        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className="absolute w-full h-full backface-hidden bg-[#374151] rounded-lg flex items-center justify-center p-6 text-center text-xl font-semibold">
                            {card.pergunta}
                        </div>
                        <div className="absolute w-full h-full backface-hidden bg-[#3b82f6] rounded-lg flex items-center justify-center p-6 text-center text-lg rotate-y-180">
                            {card.resposta}
                        </div>
                    </div>
                </div>
                {isFlipped && (
                    <div className="flex gap-4 mt-6 animate-fade-in">
                        <button onClick={() => handleEvaluation(false)} className="py-2 px-8 bg-[#ef4444] hover:bg-[#dc2626] rounded-lg">Errei</button>
                        <button onClick={() => handleEvaluation(true)} className="py-2 px-8 bg-[#22c55e] hover:bg-[#16a34a] rounded-lg">Acertei</button>
                    </div>
                )}
                 <style>{`
                    .perspective-1000 { perspective: 1000px; }
                    .transform-style-preserve-3d { transform-style: preserve-3d; }
                    .rotate-y-180 { transform: rotateY(180deg); }
                    .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                    .animate-fade-in { animation: fadeIn 0.5s; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                 `}</style>
            </div>
        );
    }

    if (viewState === 'results') {
        const total = results.correct + results.incorrect;
        const percentage = total > 0 ? Math.round((results.correct / total) * 100) : 0;
        return (
            <div className="text-center">
                 <h1 className="text-3xl font-bold text-[#f9fafb]">Revisão Concluída!</h1>
                 <div className="bg-[#1f2937] p-8 rounded-lg border border-[#374151] mt-6 max-w-md mx-auto">
                    <p className="text-xl">Você acertou</p>
                    <p className="text-6xl font-bold text-[#3b82f6] my-4">{percentage}%</p>
                    <p className="text-[#9ca3af]">({results.correct} de {total} cards)</p>
                    <div className="flex gap-4 mt-8 justify-center">
                        <button onClick={restart} className="py-2 px-6 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg">
                            Reiniciar
                        </button>
                         <button onClick={exportToCsv} className="py-2 px-6 bg-[#374151] hover:bg-[#4b5563] rounded-lg">
                            Exportar para CSV (Anki)
                        </button>
                    </div>
                 </div>
            </div>
        );
    }

    return null;
};

export default Flashcards;