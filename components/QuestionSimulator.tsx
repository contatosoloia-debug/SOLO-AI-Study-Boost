
import React, { useState } from 'react';
import { generateQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { LoadingSpinner } from './icons';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type QuizState = 'setup' | 'quiz' | 'results';

const QuestionSimulator: React.FC = () => {
    const [discipline, setDiscipline] = useState('');
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(10);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [score, setScore] =useState(0);
    
    const [quizState, setQuizState] = useState<QuizState>('setup');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const startQuiz = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await generateQuestions(topic, discipline, numQuestions);
            if (result && result.length > 0) {
                setQuestions(result);
                setQuizState('quiz');
            } else {
                setError('Não foi possível gerar as questões. Tente um tópico diferente.');
            }
        } catch (err) {
            setError('Erro ao comunicar com a IA. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        if(isConfirmed) return;
        setSelectedAnswer(answerIndex);
    };

    const confirmAnswer = () => {
        if(selectedAnswer === null) return;
        setIsConfirmed(true);
        const isCorrect = selectedAnswer === questions[currentQuestionIndex].respostaCorreta;
        if(isCorrect) setScore(s => s + 1);
        setAnswers([...answers, selectedAnswer]);
    };
    
    const nextQuestion = () => {
        setSelectedAnswer(null);
        setIsConfirmed(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz is finished, save results
            const newResult = {
                discipline: discipline,
                topic: topic,
                score: score,
                totalQuestions: questions.length,
                timestamp: Date.now(),
            };
            const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
            history.push(newResult);
            localStorage.setItem('quizHistory', JSON.stringify(history));

            setQuizState('results');
        }
    };

    const restartQuiz = () => {
        setDiscipline('');
        setTopic('');
        setNumQuestions(10);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setAnswers([]);
        setIsConfirmed(false);
        setScore(0);
        setQuizState('setup');
    };
    
    if (quizState === 'setup') {
        return (
            <div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#f9fafb]">Simulado de Questões</h1>
                    <p className="text-[#9ca3af] mt-1 mb-6">Teste seus conhecimentos com questões geradas por IA.</p>
                </div>
                <div className="max-w-lg mx-auto bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="discipline" className="block text-sm font-medium text-[#9ca3af]">Disciplina</label>
                            <input type="text" id="discipline" value={discipline} onChange={e => setDiscipline(e.target.value)} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]" placeholder="Ex: Matemática" required />
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-[#9ca3af]">Tópico</label>
                            <input type="text" id="topic" value={topic} onChange={e => setTopic(e.target.value)} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]" placeholder="Ex: Análise Combinatória" required />
                        </div>
                        <div>
                            <label htmlFor="numQuestions" className="block text-sm font-medium text-[#9ca3af]">Número de Questões: {numQuestions}</label>
                            <input type="range" id="numQuestions" min="5" max="20" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full h-2 bg-[#374151] rounded-lg appearance-none cursor-pointer" />
                        </div>
                        {error && <p className="text-sm text-[#ef4444]">{error}</p>}
                        <button onClick={startQuiz} disabled={isLoading || !discipline || !topic} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] disabled:bg-[#374151] disabled:cursor-not-allowed">
                            {isLoading ? <LoadingSpinner /> : 'Iniciar Simulado'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (quizState === 'quiz' && questions.length > 0) {
        const currentQuestion = questions[currentQuestionIndex];
        return (
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-4">
                    <p className="text-[#9ca3af]">Questão {currentQuestionIndex + 1} de {questions.length}</p>
                    <div className="w-full bg-[#374151] rounded-full h-2.5 mt-2">
                        <div className="bg-[#3b82f6] h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                    </div>
                </div>
                <div className="bg-[#1f2937] p-8 rounded-lg border border-[#374151]">
                    <h2 className="text-xl font-semibold mb-6">{currentQuestion.pergunta}</h2>
                    <div className="space-y-4">
                        {currentQuestion.opcoes.map((option, index) => {
                            let optionClass = "border-[#4b5563] hover:bg-[#374151]";
                            if (isConfirmed) {
                                if(index === currentQuestion.respostaCorreta) {
                                    optionClass = "bg-[#166534] border-[#22c55e] text-white"; // Correct
                                } else if(index === selectedAnswer) {
                                    optionClass = "bg-[#991b1b] border-[#ef4444] text-white"; // Incorrect selected
                                } else {
                                    optionClass = "border-[#4b5563] opacity-50"; // Not selected
                                }
                            } else if (selectedAnswer === index) {
                                optionClass = "bg-[#3b82f6] border-[#3b82f6] text-white"; // Selected
                            }
                            return (
                                <button key={index} onClick={() => handleAnswer(index)} className={`w-full text-left p-4 border-2 rounded-lg transition-colors ${optionClass}`}>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-6 flex justify-end">
                        {!isConfirmed ? (
                            <button onClick={confirmAnswer} disabled={selectedAnswer === null} className="py-2 px-6 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg disabled:bg-[#374151] disabled:cursor-not-allowed">
                                Confirmar
                            </button>
                        ) : (
                            <button onClick={nextQuestion} className="py-2 px-6 bg-[#22c55e] hover:bg-[#16a34a] rounded-lg">
                                {currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultados'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    if (quizState === 'results') {
        const percentage = Math.round((score / questions.length) * 100);
        const data = [{ name: 'Acertos', value: score }, { name: 'Erros', value: questions.length - score }];
        const COLORS = ['#22c55e', '#ef4444'];

        return (
            <div className="text-center">
                 <h1 className="text-3xl font-bold text-[#f9fafb]">Resultados do Simulado</h1>
                 <div className="bg-[#1f2937] p-8 rounded-lg border border-[#374151] mt-6 max-w-lg mx-auto">
                    <div className="w-full h-64">
                         <ResponsiveContainer>
                            <PieChart>
                                <Pie data={data} cx="50%" cy="50%" labelLine={false} innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" stroke="none">
                                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-5xl font-bold -mt-24">{percentage}%</p>
                    <p className="text-[#9ca3af] mt-2">de acertos</p>
                    <p className="text-xl mt-8">Você acertou {score} de {questions.length} questões.</p>
                     <button onClick={restartQuiz} className="mt-8 py-2 px-6 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg">
                        Fazer Novo Simulado
                    </button>
                 </div>
            </div>
        )
    }

    return null;
};

export default QuestionSimulator;