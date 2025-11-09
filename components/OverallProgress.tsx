import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface QuizHistoryEntry {
    discipline: string;
    score: number;
    totalQuestions: number;
    timestamp: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111827] p-4 border border-[#374151] rounded-lg shadow-lg">
          <p className="font-bold text-[#f9fafb]">{label}</p>
          <p className="text-[#3b82f6]">{`Precisão: ${payload[0].value}%`}</p>
          <p className="text-[#9ca3af]">{`Questões respondidas: ${payload[0].payload.total}`}</p>
        </div>
      );
    }
    return null;
};

const OverallProgress: React.FC = () => {
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [overallAccuracy, setOverallAccuracy] = useState(0);
    const [subjectPerformance, setSubjectPerformance] = useState<{ name: string; acertos: number; total: number; precisao: number }[]>([]);

    useEffect(() => {
        const history: QuizHistoryEntry[] = JSON.parse(localStorage.getItem('quizHistory') || '[]');
        if (history.length === 0) {
            return;
        }

        const totalQs = history.reduce((acc, curr) => acc + curr.totalQuestions, 0);
        const totalCorrect = history.reduce((acc, curr) => acc + curr.score, 0);
        setTotalQuestions(totalQs);
        setOverallAccuracy(totalQs > 0 ? Math.round((totalCorrect / totalQs) * 100) : 0);

        const performanceMap = new Map<string, { score: number, totalQuestions: number }>();
        history.forEach(item => {
            const normalizedDiscipline = item.discipline.charAt(0).toUpperCase() + item.discipline.slice(1).toLowerCase();
            const existing = performanceMap.get(normalizedDiscipline) || { score: 0, totalQuestions: 0 };
            performanceMap.set(normalizedDiscipline, {
                score: existing.score + item.score,
                totalQuestions: existing.totalQuestions + item.totalQuestions,
            });
        });

        const performanceData = Array.from(performanceMap.entries()).map(([name, data]) => ({
            name,
            acertos: data.score,
            total: data.totalQuestions,
            precisao: data.totalQuestions > 0 ? Math.round((data.score / data.totalQuestions) * 100) : 0,
        })).sort((a,b) => b.precisao - a.precisao);
        
        setSubjectPerformance(performanceData);
    }, []);

    if (totalQuestions === 0) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-[#f9fafb]">Progresso Geral</h1>
                <div className="mt-6 bg-[#1f2937] p-8 rounded-lg border border-[#374151] text-center">
                    <h2 className="text-xl font-semibold">Nenhum dado encontrado</h2>
                    <p className="text-[#9ca3af] mt-2">
                        Parece que você ainda não completou nenhum simulado. Vá para o "Simulado de Questões" para começar a acompanhar seu progresso!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#f9fafb]">Progresso Geral</h1>
                <p className="text-[#9ca3af] mt-1">Acompanhe seu desempenho nos estudos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] shadow-lg">
                    <h3 className="font-semibold text-[#f9fafb]">Total de Questões</h3>
                    <p className="text-4xl font-bold text-[#3b82f6] mt-2">{totalQuestions}</p>
                    <p className="text-[#9ca3af]">respondidas em todos os simulados.</p>
                </div>
                <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] shadow-lg">
                    <h3 className="font-semibold text-[#f9fafb]">Precisão Geral</h3>
                    <p className="text-4xl font-bold text-[#3b82f6] mt-2">{overallAccuracy}%</p>
                    <p className="text-[#9ca3af]">de acertos em todas as disciplinas.</p>
                </div>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] shadow-lg">
                <h2 className="text-xl font-semibold text-[#f9fafb] mb-4">Desempenho por Disciplina</h2>
                <div className="w-full h-80">
                    <ResponsiveContainer>
                        <BarChart data={subjectPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" unit="%" />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: '#374151'}} />
                            <Legend wrapperStyle={{ color: '#9ca3af' }}/>
                            <Bar dataKey="precisao" name="Precisão" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OverallProgress;