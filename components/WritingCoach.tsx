
import React, { useState } from 'react';
import { analyzeWriting } from '../services/geminiService';
import { WritingAnalysis } from '../types';
import { LoadingSpinner } from './icons';

const WritingCoach: React.FC = () => {
    const [writingType, setWritingType] = useState('ENEM');
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!text.trim()) {
            setError('Por favor, insira o texto da redação.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis(null);
        try {
            const result = await analyzeWriting(text, writingType);
            if (result) {
                setAnalysis(result);
            } else {
                setError('A IA não conseguiu analisar sua redação. Tente novamente.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao processar a análise. Tente novamente mais tarde.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (analysis) {
        return (
             <div className="space-y-6">
                 <h1 className="text-3xl font-bold text-[#f9fafb]">Análise da sua Redação</h1>
                 <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                    <div className="text-center mb-8">
                        <p className="text-[#9ca3af]">Nota Geral</p>
                        <p className="text-6xl font-bold text-[#3b82f6]">{analysis.notaGeral}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#374151] p-4 rounded-lg">
                            <h3 className="font-semibold text-[#22c55e] mb-2">Pontos Fortes</h3>
                            <ul className="list-disc list-inside space-y-1 text-[#9ca3af]">
                                {analysis.pontosFortes.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                         <div className="bg-[#374151] p-4 rounded-lg">
                            <h3 className="font-semibold text-[#f59e0b] mb-2">Áreas para Melhorar</h3>
                            <ul className="list-disc list-inside space-y-1 text-[#9ca3af]">
                                {analysis.areasParaMelhorar.map((point, i) => <li key={i}>{point}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-6 bg-[#374151] p-4 rounded-lg">
                        <h3 className="font-semibold text-[#f9fafb] mb-2">Exemplo Revisado</h3>
                        <p className="text-[#9ca3af] italic">"{analysis.paragrafoRevisado}"</p>
                    </div>
                     <button onClick={() => setAnalysis(null)} className="mt-8 py-2 px-6 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg">
                        Analisar Outra Redação
                    </button>
                 </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#f9fafb]">Corretor de Redação (PRO)</h1>
            <p className="text-[#9ca3af] mt-1 mb-6">Receba uma análise detalhada da sua redação para aprimorar sua escrita.</p>
            <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] space-y-4">
                <div>
                    <label htmlFor="writingType" className="block text-sm font-medium text-[#9ca3af]">Tipo de Redação</label>
                    <select id="writingType" value={writingType} onChange={e => setWritingType(e.target.value)} className="mt-1 block w-full md:w-1/3 bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]">
                        <option>ENEM</option>
                        <option>Dissertação Argumentativa</option>
                        <option>Artigo de Opinião</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="text" className="block text-sm font-medium text-[#9ca3af]">Cole sua redação abaixo</label>
                    <textarea 
                        id="text" 
                        rows={15} 
                        value={text} 
                        onChange={e => setText(e.target.value)}
                        className="mt-1 block w-full bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                        placeholder="Escreva ou cole seu texto aqui..."
                    />
                </div>
                 {error && <p className="text-sm text-[#ef4444]">{error}</p>}
                <div>
                    <button onClick={handleSubmit} disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] disabled:bg-[#374151] disabled:cursor-not-allowed">
                        {isLoading ? <LoadingSpinner /> : 'Analisar Redação'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WritingCoach;
