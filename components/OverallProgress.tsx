
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface QuizHistoryItem {
    discipline: string;
    topic: string;
    score: number;
    totalQuestions: number;
    timestamp: number;
}

interface CalendarData {
    [monthKey: string]: {
        studiedDays: { [day: number]: boolean };
        quote: string;
    };
}

const OverallProgress: React.FC = () => {
    const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
    const [totalStudiedDays, setTotalStudiedDays] = useState(0);

    useEffect(() => {
        // Load quiz history
        const savedHistory = localStorage.getItem('quizHistory');
        if (savedHistory) {
            try {
                const parsedHistory: QuizHistoryItem[] = JSON.parse(savedHistory);
                // Sort by timestamp
                parsedHistory.sort((a, b) => a.timestamp - b.timestamp);
                setQuizHistory(parsedHistory);
            } catch (e) {
                console.error("Failed to parse quiz history", e);
                setQuizHistory([]);
            }
        }

        // Load calendar data
        const savedCalendar = localStorage.getItem('motivationalCalendar');
        if (savedCalendar) {
            try {
                const calendarData: CalendarData = JSON.parse(savedCalendar);
                let totalDays = 0;
                Object.values(calendarData).forEach(monthData => {
                    totalDays += Object.values(monthData.studiedDays).filter(Boolean).length;
                });
                setTotalStudiedDays(totalDays);
            } catch(e) {
                console.error("Failed to parse calendar data", e);
                setTotalStudiedDays(0);
            }
        }
    }, []);
    
    const overallScore = quizHistory.reduce((acc, item) => acc + item.score, 0);
    const totalQuestions = quizHistory.reduce((acc, item) => acc + item.totalQuestions, 0);
    const averagePercentage = totalQuestions > 0 ? Math.round((overallScore / totalQuestions) * 100) : 0;
    
    const chartData = quizHistory.map(item => ({
        name: new Date(item.timestamp).toLocaleDateString('pt-BR'),
        topic: item.topic,
        score: Math.round((item.score / item.totalQuestions) * 100)
    }));
    
    const performanceByDiscipline = quizHistory.reduce((acc, item) => {
        if (!acc[item.discipline]) {
            acc[item.discipline] = { totalScore: 0, totalQuestions: 0, count: 0 };
        }
        acc[item.discipline].totalScore += item.score;
        acc[item.discipline].totalQuestions += item.totalQuestions;
        acc[item.discipline].count += 1;
        return acc;
    }, {} as {[key: string]: { totalScore: number, totalQuestions: number, count: number }});

    const disciplineChartData = Object.entries(performanceByDiscipline).map(([discipline, data]) => ({
        discipline,
        average: data.totalQuestions > 0 ? Math.round((data.totalScore / data.totalQuestions) * 100) : 0,
        simulados: data.count,
    }));


    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#f9fafb]">Seu Progresso Geral</h1>
                <p className="text-[#9ca3af] mt-1">Acompanhe sua evolução e identifique pontos de melhoria.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                    <h3 className="font-semibold text-[#9ca3af]">Média Geral de Acertos</h3>
                    <p className="text-4xl font-bold text-[#3b82f6] mt-2">{averagePercentage}%</p>
                </div>
                <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                    <h3 className="font-semibold text-[#9ca3af]">Simulados Realizados</h3>
                    <p className="text-4xl font-bold text-[#3b82f6] mt-2">{quizHistory.length}</p>
                </div>
                <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                    <h3 className="font-semibold text-[#9ca3af]">Total de Dias Estudados</h3>
                    <p className="text-4xl font-bold text-[#3b82f6] mt-2">{totalStudiedDays}</p>
                </div>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                <h3 className="text-xl font-semibold mb-4 text-center">Evolução dos Simulados</h3>
                {chartData.length > 0 ? (
                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Legend />
                                <Line type="monotone" dataKey="score" name="Pontuação (%)" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center text-[#9ca3af]">Nenhum histórico de simulado encontrado. Faça um simulado para ver seu progresso!</p>
                )}
            </div>
            
            <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                <h3 className="text-xl font-semibold mb-4 text-center">Desempenho por Disciplina</h3>
                {disciplineChartData.length > 0 ? (
                    <div className="w-full h-80">
                         <ResponsiveContainer>
                            <BarChart data={disciplineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="discipline" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                                <Legend />
                                <Bar dataKey="average" name="Média de Acertos (%)" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center text-[#9ca3af]">Nenhum histórico de simulado encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default OverallProgress;