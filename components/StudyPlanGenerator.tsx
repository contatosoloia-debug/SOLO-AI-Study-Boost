
import React, { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { StudyPlan } from '../types';
import { LoadingSpinner } from './icons';

const StudyPlanGenerator: React.FC = () => {
    const [formData, setFormData] = useState({
        objetivo: 'ENEM',
        meta: '',
        dias: [] as string[],
        periodos: [] as string[],
        pontosFortes: '',
        pontosFracos: ''
    });
    const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedPlan = localStorage.getItem('studyPlan');
        if (savedPlan) {
            setGeneratedPlan(JSON.parse(savedPlan));
        }
        const savedSettings = localStorage.getItem('studyPlanSettings');
        if (savedSettings) {
            setFormData(JSON.parse(savedSettings));
        }
    }, []);

    const handleCheckboxChange = (field: 'dias' | 'periodos', value: string) => {
        const currentValues = formData[field];
        const newValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];
        setFormData({ ...formData, [field]: newValues });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setGeneratedPlan(null);

        const prompt = `Crie um plano de estudos semanal para um estudante brasileiro.
        - Objetivo: ${formData.objetivo}
        - Meta Específica: ${formData.meta}
        - Dias disponíveis: ${formData.dias.join(', ')}
        - Períodos disponíveis: ${formData.periodos.join(', ')}
        - Pontos Fortes: ${formData.pontosFortes}
        - Pontos Fracos: ${formData.pontosFracos}
        Para cada dia disponível, sugira uma disciplina, um tópico específico e uma atividade (ex: "Resolver 20 exercícios", "Ler capítulo 5 e fazer resumo").`;

        try {
            const plan = await generateStudyPlan(prompt);
            if (plan) {
                setGeneratedPlan(plan);
                localStorage.setItem('studyPlan', JSON.stringify(plan));
                localStorage.setItem('studyPlanSettings', JSON.stringify(formData));
            } else {
                setError('A IA não conseguiu gerar um plano com os dados fornecidos. Tente ser mais específico.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao gerar o plano. Por favor, tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyPlan = () => {
        if (!generatedPlan) return;
        const text = generatedPlan.map(day => 
            `${day.Dia} - ${day.Disciplina}: ${day.Tópico} (${day['Atividade Sugerida']})`
        ).join('\n');
        navigator.clipboard.writeText(text);
        alert('Plano copiado para a área de transferência!');
    };

    const exportPlan = () => {
        if (!generatedPlan) return;
        const text = generatedPlan.map(day =>
            `Dia: ${day.Dia}\nDisciplina: ${day.Disciplina}\nTópico: ${day.Tópico}\nAtividade: ${day['Atividade Sugerida']}\n\n`
        ).join('');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plano_de_estudos.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (generatedPlan && !isLoading) {
        return (
            <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                <h2 className="text-2xl font-bold mb-4 text-center">Seu Plano de Estudos Personalizado</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#374151]">
                            <tr>
                                <th className="p-3">Dia</th>
                                <th className="p-3">Disciplina</th>
                                <th className="p-3">Tópico</th>
                                <th className="p-3">Atividade Sugerida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedPlan.map((day, index) => (
                                <tr key={index} className="border-b border-[#374151]">
                                    <td className="p-3 font-semibold">{day.Dia}</td>
                                    <td className="p-3">{day.Disciplina}</td>
                                    <td className="p-3">{day.Tópico}</td>
                                    <td className="p-3">{day['Atividade Sugerida']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap gap-4 mt-6">
                    <button onClick={copyPlan} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-lg">Copiar</button>
                    <button onClick={exportPlan} className="bg-[#374151] hover:bg-[#4b5563] text-white font-bold py-2 px-4 rounded-lg">Exportar (.txt)</button>
                    <button onClick={() => setGeneratedPlan(null)} className="bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-2 px-4 rounded-lg">Gerar Novo Plano</button>
                </div>
            </div>
        );
    }
    
    const renderCheckboxGroup = (title: string, options: string[], field: 'dias' | 'periodos') => (
        <div>
            <label className="block text-sm font-medium text-[#9ca3af] mb-2">{title}</label>
            <div className="flex flex-wrap gap-4">
                {options.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#3b82f6] focus:ring-[#2563eb]"
                            checked={formData[field].includes(option)}
                            onChange={() => handleCheckboxChange(field, option)}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#f9fafb]">Gerador de Plano de Estudos</h1>
                <p className="text-[#9ca3af] mt-1 mb-6">Preencha os campos abaixo para a IA criar um plano sob medida para você.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="objetivo" className="block text-sm font-medium text-[#9ca3af]">Objetivo Principal</label>
                        <select id="objetivo" value={formData.objetivo} onChange={e => setFormData({...formData, objetivo: e.target.value})} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]">
                            <option>ENEM</option>
                            <option>Concurso Público</option>
                            <option>Vestibular</option>
                            <option>Bolsa de Estudos</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="meta" className="block text-sm font-medium text-[#9ca3af]">Meta Específica (ex: Medicina na USP)</label>
                        <input type="text" id="meta" value={formData.meta} onChange={e => setFormData({...formData, meta: e.target.value})} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]" required />
                    </div>
                </div>
                {renderCheckboxGroup('Dias da Semana Disponíveis', ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'], 'dias')}
                {renderCheckboxGroup('Períodos do Dia', ['Manhã', 'Tarde', 'Noite'], 'periodos')}
                <div>
                    <label htmlFor="pontosFortes" className="block text-sm font-medium text-[#9ca3af]">Pontos Fortes (disciplinas, tópicos)</label>
                    <textarea id="pontosFortes" rows={3} value={formData.pontosFortes} onChange={e => setFormData({...formData, pontosFortes: e.target.value})} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]"></textarea>
                </div>
                <div>
                    <label htmlFor="pontosFracos" className="block text-sm font-medium text-[#9ca3af]">Pontos Fracos / Dificuldades</label>
                    <textarea id="pontosFracos" rows={3} value={formData.pontosFracos} onChange={e => setFormData({...formData, pontosFracos: e.target.value})} className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]"></textarea>
                </div>
                 {error && <p className="text-sm text-[#ef4444]">{error}</p>}
                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] disabled:bg-[#374151] disabled:cursor-not-allowed">
                        {isLoading ? <LoadingSpinner /> : 'Gerar Plano de Estudos'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudyPlanGenerator;