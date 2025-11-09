
import React, { useState, useEffect } from 'react';
import { findExamDates } from '../services/geminiService';
import { LoadingSpinner } from './icons';

const motivationalQuotes = [
    "Acredite em você. Estude. Conquiste.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Não estude para passar, estude para aprender.",
    "A persistência realiza o impossível.",
    "Sua dedicação de hoje é o seu sucesso de amanhã.",
    "Quanto mais você estuda, mais perto você fica dos seus sonhos.",
    "A educação é a arma mais poderosa que você pode usar para mudar o mundo.",
    "Não tenha medo de falhar. Tenha medo de não tentar.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    "Transforme o 'não consigo' em 'vou tentar até conseguir'."
];

interface CalendarData {
    [monthKey: string]: {
        studiedDays?: { [day: number]: boolean };
        events?: { [day: number]: { title: string }[] };
        quote: string;
    };
}

const MotivationalCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<CalendarData>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [searchError, setSearchError] = useState('');

    const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

    useEffect(() => {
        const savedData = localStorage.getItem('motivationalCalendar');
        if (savedData) {
            setCalendarData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        if (Object.keys(calendarData).length > 0) {
            localStorage.setItem('motivationalCalendar', JSON.stringify(calendarData));
        }
    }, [calendarData]);

    const getMonthData = () => {
        if (!calendarData[currentMonthKey]) {
            const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
            return { studiedDays: {}, events: {}, quote: randomQuote };
        }
        return calendarData[currentMonthKey];
    };
    
    const monthData = getMonthData();

    const toggleStudyDay = (day: number) => {
        const currentStudiedDays = monthData.studiedDays || {};
        const newStudiedDays = { ...currentStudiedDays };
        newStudiedDays[day] = !newStudiedDays[day];
        
        setCalendarData(prev => ({
            ...prev,
            [currentMonthKey]: { ...monthData, studiedDays: newStudiedDays }
        }));
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoadingSearch(true);
        setSearchError('');
        try {
            const results = await findExamDates(searchQuery);
            if (results && results.length > 0) {
                setCalendarData(prevData => {
                    const newData = JSON.parse(JSON.stringify(prevData));
                    results.forEach(event => {
                        const [year, month, day] = event.date.split('-').map(Number);
                        const monthKey = `${year}-${month - 1}`;
                        
                        if (!newData[monthKey]) {
                            newData[monthKey] = {
                                quote: motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
                                events: {},
                                studiedDays: {}
                            };
                        }
                        if (!newData[monthKey].events) newData[monthKey].events = {};
                        if (!newData[monthKey].events[day]) newData[monthKey].events[day] = [];
                        
                        if (!newData[monthKey].events[day].some((e: any) => e.title === event.name)) {
                            newData[monthKey].events[day].push({ title: event.name });
                        }
                    });
                    return newData;
                });
                alert(`${results.length} evento(s) encontrado(s) e adicionado(s) ao calendário!`);
            } else {
                setSearchError('Nenhuma data encontrada para sua busca.');
            }
        } catch (error) {
            setSearchError('Ocorreu um erro ao buscar as datas. Tente novamente.');
            console.error(error);
        } finally {
            setIsLoadingSearch(false);
        }
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const renderCalendar = () => {
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-12 h-12"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isStudied = monthData.studiedDays?.[day];
            const dayEvents = monthData.events?.[day] || [];
            const isExamDay = dayEvents.length > 0;
            
            days.push(
                <div key={day} className="relative flex justify-center items-center group">
                    <button
                        onClick={() => toggleStudyDay(day)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200
                            ${isStudied ? 'bg-[#3b82f6] text-white font-bold' : 'hover:bg-[#374151]'}
                            ${isExamDay ? 'ring-2 ring-offset-2 ring-offset-[#1f2937] ring-[#f59e0b]' : ''}
                        `}
                    >
                        {day}
                    </button>
                     {isExamDay && (
                        <div className="absolute bottom-full mb-2 w-max max-w-xs bg-[#111827] text-white text-xs rounded py-1 px-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                            <span className="font-bold">Prova(s):</span> {dayEvents.map(e => e.title).join(', ')}
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#f9fafb]">Calendário Motivacional</h1>
                <p className="text-[#9ca3af] mt-1 mb-6">Marque seus dias de estudo, acompanhe sua consistência e encontre datas de provas.</p>
            </div>
            
            <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-[#374151]">&lt;</button>
                    <h2 className="text-xl font-bold capitalize">{monthName} de {year}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-[#374151]">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="font-semibold text-sm text-[#9ca3af]">{day}</div>
                    ))}
                    {renderCalendar()}
                </div>
                <div className="mt-6 text-center bg-[#374151] p-4 rounded-lg">
                    <p className="italic">"{monthData.quote}"</p>
                </div>

                <div className="mt-6 pt-6 border-t border-[#374151]">
                     <h3 className="text-lg font-semibold text-center mb-4">Buscar Datas de Provas com IA</h3>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar provas (ex: ENEM 2024, Concurso X)"
                            className="flex-1 bg-[#374151] border border-[#4b5563] rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                        />
                        <button onClick={handleSearch} disabled={isLoadingSearch} className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#374151] disabled:cursor-not-allowed">
                            {isLoadingSearch ? <LoadingSpinner /> : 'Buscar'}
                        </button>
                     </div>
                     {searchError && <p className="text-sm text-center text-[#ef4444] mt-2">{searchError}</p>}
                </div>
            </div>
        </div>
    );
};

export default MotivationalCalendar;