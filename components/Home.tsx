
import React, { useState, useEffect } from 'react';
import { getDailyTip } from '../services/geminiService';
import { LoadingSpinner, PlanIcon, TutorIcon, WritingIcon, SimulatorIcon } from './icons';
import { View } from '../types';

interface HomeProps {
    setView: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  const [dailyTip, setDailyTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(true);
  const [todayFocus, setTodayFocus] = useState<{ disciplina: string; topico: string } | null>(null);
  const [studiedDays, setStudiedDays] = useState(0);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const tip = await getDailyTip();
        setDailyTip(tip);
      } catch (error) {
        console.error("Failed to fetch daily tip:", error);
        setDailyTip("Não foi possível carregar a dica de hoje. Tente novamente mais tarde.");
      } finally {
        setIsLoadingTip(false);
      }
    };
    fetchTip();

    // Load data from localStorage
    const savedPlan = localStorage.getItem('studyPlan');
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      const dayOfWeek = new Date().toLocaleString('pt-BR', { weekday: 'long' });
      const todayPlan = plan.find((d: any) => d.Dia.toLowerCase() === dayOfWeek.toLowerCase());
      if (todayPlan) {
        setTodayFocus({ disciplina: todayPlan.Disciplina, topico: todayPlan.Tópico });
      } else {
        setTodayFocus({ disciplina: "Dia de descanso", topico: "Aproveite!" });
      }
    }

    const savedCalendar = localStorage.getItem('motivationalCalendar');
    if(savedCalendar) {
        const calendarData = JSON.parse(savedCalendar);
        const currentMonthKey = `${new Date().getFullYear()}-${new Date().getMonth()}`;
        if(calendarData[currentMonthKey]?.studiedDays) {
            setStudiedDays(Object.keys(calendarData[currentMonthKey].studiedDays).length);
        }
    }

  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#f9fafb]">Olá, Estudante!</h1>
        <p className="text-[#9ca3af] mt-1">Pronto para mais um dia de conquistas?</p>
      </div>

      <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] shadow-lg">
        <h2 className="text-lg font-semibold text-[#f9fafb] mb-2">Dica do Dia</h2>
        <div className="text-[#9ca3af] min-h-[40px] flex items-center">
            {isLoadingTip ? (
                <div className="flex items-center">
                    <LoadingSpinner />
                    <span>Gerando uma dica para você...</span>
                </div>
            ) : (
                <p>"{dailyTip}"</p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] shadow-lg">
          <h3 className="font-semibold text-[#f9fafb]">Foco de Hoje</h3>
          {todayFocus ? (
            <>
              <p className="text-2xl font-bold text-[#3b82f6] mt-2">{todayFocus.disciplina}</p>
              <p className="text-[#9ca3af]">{todayFocus.topico}</p>
            </>
          ) : (
            <p className="text-[#9ca3af] mt-2">Nenhum plano de estudos encontrado. Crie um agora!</p>
          )}
        </div>
        <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] shadow-lg">
          <h3 className="font-semibold text-[#f9fafb]">Dias Estudados no Mês</h3>
          <p className="text-4xl font-bold text-[#3b82f6] mt-2">{studiedDays}</p>
        </div>
      </div>
        
      <div>
        <h2 className="text-xl font-semibold text-[#f9fafb] mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAccessButton icon={<PlanIcon />} label="Plano de Estudos" onClick={() => setView('plan')} />
            <QuickAccessButton icon={<TutorIcon />} label="Tutor IA" onClick={() => setView('tutor')} />
            <QuickAccessButton icon={<WritingIcon />} label="Redação" onClick={() => setView('writing')} />
            <QuickAccessButton icon={<SimulatorIcon />} label="Simulado" onClick={() => setView('simulator')} />
        </div>
      </div>
    </div>
  );
};

// FIX: Changed icon prop type to React.ReactElement to allow cloning with new props.
const QuickAccessButton: React.FC<{icon: React.ReactElement, label: string, onClick: () => void}> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="bg-[#1f2937] hover:bg-[#374151] p-4 rounded-lg border border-[#374151] text-center transition-all duration-200 ease-in-out transform hover:-translate-y-1">
        <div className="mx-auto text-[#3b82f6] w-10 h-10 flex items-center justify-center">{React.cloneElement(icon, { className: "w-8 h-8" })}</div>
        <p className="mt-2 font-semibold text-[#f9fafb] text-sm">{label}</p>
    </button>
);


export default Home;
