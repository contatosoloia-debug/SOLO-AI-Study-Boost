
import React, { useState, useEffect } from 'react';
import { generateCalendarMotivation } from '../services/geminiService';
import { LoadingSpinner } from './icons';

interface CalendarData {
    [key: string]: {
        messages: Record<string, string>;
        studiedDays: Record<string, boolean>;
    };
}

const MotivationalCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<CalendarData>({});
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

    useEffect(() => {
        const savedData = localStorage.getItem('motivationalCalendar');
        if (savedData) {
            setCalendarData(JSON.parse(savedData));
        }
    }, []);
    
    useEffect(() => {
        const loadMonthData = async () => {
            if (!calendarData[monthKey]?.messages) {
                setIsLoading(true);
                try {
                    const messages = await generateCalendarMotivation(currentDate.getMonth(), currentDate.getFullYear());
                    if (messages) {
                        const newData = { ...calendarData, [monthKey]: { messages, studiedDays: calendarData[monthKey]?.studiedDays || {} } };
                        setCalendarData(newData);
                        localStorage.setItem('motivationalCalendar', JSON.stringify(newData));
                    }
                } catch (error) {
                    console.error("Failed to load motivational messages:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadMonthData();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthKey]);

    const handleDayClick = (day: number) => {
        setSelectedDay(day);
    };

    const toggleStudiedDay = (day: number) => {
        const currentStudiedDays = calendarData[monthKey]?.studiedDays || {};
        const newStudiedDays = { ...currentStudiedDays, [day]: !currentStudiedDays[day] };
        if (!currentStudiedDays[day] === false) {
             delete newStudiedDays[day];
        }
        const newData = { ...calendarData, [monthKey]: { ...calendarData[monthKey], studiedDays: newStudiedDays } };
        setCalendarData(newData);
        localStorage.setItem('motivationalCalendar', JSON.stringify(newData));
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
        setSelectedDay(null);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 border-r border-b border-[#374151]"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isStudied = calendarData[monthKey]?.studiedDays?.[day];
            days.push(
                <div key={day} onClick={() => handleDayClick(day)} className="p-2 border-r border-b border-[#374151] cursor-pointer hover:bg-[#374151] relative">
                    <span className={`${selectedDay === day ? 'bg-[#3b82f6] text-white rounded-full px-2' : ''}`}>{day}</span>
                    {isStudied && <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#22c55e] rounded-full"></div>}
                </div>
            );
        }
        return days;
    };

    const currentMessage = selectedDay && calendarData[monthKey]?.messages?.[selectedDay];
    const isDayStudied = selectedDay && calendarData[monthKey]?.studiedDays?.[selectedDay];

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#f9fafb]">Calendário Motivacional</h1>
            <p className="text-[#9ca3af] mt-1 mb-6">Receba uma dose diária de motivação e marque seus dias de estudo.</p>
            <div className="lg:flex gap-6">
                <div className="flex-grow bg-[#1f2937] border border-[#374151] rounded-lg">
                    <div className="flex justify-between items-center p-4 border-b border-[#374151]">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-[#374151]">&lt;</button>
                        <h2 className="text-xl font-semibold capitalize">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-[#374151]">&gt;</button>
                    </div>
                     <div className="grid grid-cols-7 text-center font-semibold text-[#9ca3af] border-b border-[#374151]">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day} className="p-2 border-r border-[#374151]">{day}</div>)}
                    </div>
                    {isLoading ? <div className="h-64 flex items-center justify-center"><LoadingSpinner/></div> : <div className="grid grid-cols-7">{renderCalendar()}</div>}
                </div>
                <div className="lg:w-80 mt-6 lg:mt-0 bg-[#1f2937] border border-[#374151] rounded-lg p-6">
                    {selectedDay ? (
                        <div>
                            <h3 className="text-lg font-semibold">Dia {selectedDay}</h3>
                            <p className="text-[#9ca3af] my-4 min-h-[50px]">{currentMessage || "Nenhuma mensagem para este dia."}</p>
                            <button onClick={() => toggleStudiedDay(selectedDay)} className={`w-full py-2 rounded-lg font-semibold ${isDayStudied ? 'bg-[#22c55e] hover:bg-[#16a34a]' : 'bg-[#374151] hover:bg-[#4b5563]'}`}>
                                {isDayStudied ? 'Dia de Estudo ✔' : 'Marcar como Estudado'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-[#9ca3af]">Selecione um dia para ver a mensagem.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MotivationalCalendar;
