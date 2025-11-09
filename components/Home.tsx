
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getDailyTip } from '../services/geminiService';
import { View } from '../types';
import { PlanIcon, TutorIcon, SimulatorIcon, FlashcardIcon, CalendarIcon, WritingIcon, MindmapIcon, ProgressIcon } from './icons';

interface HomeProps {
    setView: (view: View) => void;
}

// Fix: Add 'as const' to infer literal types for view property, satisfying the 'View' type.
const featureCards = [
    { view: 'plan', title: 'Plano de Estudos', description: 'Crie um plano de estudos personalizado.', icon: PlanIcon, pro: false },
    { view: 'tutor', title: 'Tutor IA', description: 'Tire suas dúvidas com um tutor IA.', icon: TutorIcon, pro: false },
    { view: 'simulator', title: 'Simulado de Questões', description: 'Teste seus conhecimentos com simulados.', icon: SimulatorIcon, pro: false },
    { view: 'flashcards', title: 'Flashcards', description: 'Crie flashcards para memorização.', icon: FlashcardIcon, pro: false },
    { view: 'calendar', title: 'Calendário Motivacional', description: 'Organize seus estudos e mantenha-se motivado.', icon: CalendarIcon, pro: false },
    { view: 'progress', title: 'Progresso Geral', description: 'Acompanhe seu desempenho geral.', icon: ProgressIcon, pro: false },
    { view: 'writing', title: 'Corretor de Redação', description: 'Receba feedback sobre suas redações.', icon: WritingIcon, pro: true },
    { view: 'mindmap', title: 'Mapas Mentais', description: 'Gere mapas mentais para organizar ideias.', icon: MindmapIcon, pro: true },
] as const;

const Home: React.FC<HomeProps> = ({ setView }) => {
    const { auth } = useAuth();
    const [dailyTip, setDailyTip] = useState<string>('');
    const [isLoadingTip, setIsLoadingTip] = useState(true);

    useEffect(() => {
        const fetchTip = async () => {
            try {
                const tip = await getDailyTip();
                setDailyTip(tip);
            } catch (error) {
                console.error("Failed to fetch daily tip:", error);
                setDailyTip("Estudar é o caminho para um futuro brilhante. Continue firme!");
            } finally {
                setIsLoadingTip(false);
            }
        };
        fetchTip();
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#f9fafb]">Bem-vindo(a) de volta, {auth.user?.name}!</h1>
                <p className="text-[#9ca3af] mt-1">Sua central de estudos inteligente está pronta para começar.</p>
            </div>

            <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] p-6 rounded-lg text-white">
                <h2 className="font-bold">Dica do Dia</h2>
                <p className="mt-2 italic">{isLoadingTip ? "Carregando dica..." : `"${dailyTip}"`}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featureCards.map((card) => (
                    <button
                        key={card.view}
                        onClick={() => setView(card.view)}
                        className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] text-left hover:border-[#3b82f6] hover:bg-[#374151] transition-all transform hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start">
                           <div className="w-10 h-10 bg-[#374151] rounded-lg flex items-center justify-center">
                                <card.icon className="w-6 h-6 text-[#3b82f6]" />
                           </div>
                           {card.pro && <span className="text-xs font-bold bg-[#f59e0b] text-[#111827] px-2 py-0.5 rounded-full">PRO</span>}
                        </div>
                        <h3 className="text-lg font-bold mt-4 text-[#f9fafb]">{card.title}</h3>
                        <p className="text-sm text-[#9ca3af] mt-1">{card.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;