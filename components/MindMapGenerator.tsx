
import React, { useState } from 'react';
import { generateMindMap } from '../services/geminiService';
import { MindMapNode } from '../types';
import { LoadingSpinner } from './icons';

const MindMapNodeComponent: React.FC<{ node: MindMapNode, level: number }> = ({ node, level }) => {
    return (
        <li className="relative pl-8 before:absolute before:left-2 before:top-4 before:h-full before:w-px before:bg-[#374151] last:before:h-0">
             <div className="relative mb-2">
                <span className="absolute -left-6 top-3 h-px w-4 bg-[#374151]"></span>
                <span className={`inline-block p-2 rounded-lg text-sm ${level === 0 ? 'bg-[#3b82f6]' : 'bg-[#374151]'}`}>
                    {node.topic}
                </span>
             </div>
            {node.children && node.children.length > 0 && (
                <ul className="list-none pl-4">
                    {node.children.map(child => <MindMapNodeComponent key={child.id} node={child} level={level + 1} />)}
                </ul>
            )}
        </li>
    );
};

const MindMapGenerator: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [mindMap, setMindMap] = useState<MindMapNode | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!topic.trim()) {
            setError('Por favor, insira um tópico.');
            return;
        }
        setIsLoading(true);
        setError('');
        setMindMap(null);
        try {
            const result = await generateMindMap(topic);
            if (result) {
                setMindMap(result);
            } else {
                setError('A IA não conseguiu gerar o mapa mental. Tente novamente.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao gerar o mapa mental. Tente novamente mais tarde.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#f9fafb]">Gerador de Mapa Mental (PRO)</h1>
                <p className="text-[#9ca3af] mt-1 mb-6">Visualize conceitos complexos de forma organizada e hierárquica.</p>
            </div>
            <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151]">
                {!mindMap && (
                     <div className="flex gap-4">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Digite o tópico central..."
                            className="flex-1 bg-[#374151] border border-[#4b5563] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                            disabled={isLoading}
                        />
                        <button onClick={handleSubmit} disabled={isLoading} className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#374151] disabled:cursor-not-allowed">
                            {isLoading ? <LoadingSpinner /> : 'Gerar Mapa'}
                        </button>
                    </div>
                )}
                 {error && <p className="mt-4 text-sm text-[#ef4444]">{error}</p>}
            </div>
            {(isLoading || mindMap) && (
                 <div className="mt-6 bg-[#1f2937] p-6 rounded-lg border border-[#374151] min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                             <LoadingSpinner />
                             <span className="ml-2">Gerando seu mapa mental...</span>
                        </div>
                    ) : mindMap ? (
                        <div>
                            <ul className="list-none">
                                <MindMapNodeComponent node={mindMap} level={0} />
                            </ul>
                            <button onClick={() => setMindMap(null)} className="mt-6 py-2 px-4 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg">
                                Gerar Novo Mapa
                            </button>
                        </div>
                    ) : null}
                 </div>
            )}
        </div>
    );
};

export default MindMapGenerator;