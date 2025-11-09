
import React, { useState } from 'react';

const faqData = [
    {
        question: 'O que é o Solo AI Study Boost?',
        answer: 'É uma plataforma de estudos inteligente que usa a API do Google Gemini para criar ferramentas personalizadas, como planos de estudo, tutoria por chat, simulados e muito mais, ajudando estudantes a se prepararem para seus objetivos acadêmicos.'
    },
    {
        question: 'Como o plano de estudos é gerado?',
        answer: 'Você fornece suas metas, disponibilidade e dificuldades. Nossa IA processa essas informações para criar um cronograma semanal otimizado, focado nos seus pontos fracos e alinhado com seus objetivos.'
    },
    {
        question: 'As funcionalidades PRO são pagas?',
        answer: 'Atualmente, a aplicação está em modo de demonstração com todas as funcionalidades, incluindo as PRO, liberadas para avaliação. Em uma versão futura, as funcionalidades PRO poderão exigir uma assinatura.'
    },
    {
        question: 'Meus dados são salvos?',
        answer: 'Algumas informações, como seu plano de estudos, configurações e anotações, são salvas localmente no seu navegador usando o LocalStorage. Nenhuma informação pessoal é enviada para servidores externos, exceto as solicitações para a API da IA.'
    }
];

const AccordionItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; }> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border-b border-[#374151]">
            <button onClick={onClick} className="w-full flex justify-between items-center text-left p-4 hover:bg-[#374151]">
                <span className="font-semibold">{question}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="p-4 pt-0 text-[#9ca3af]">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleClick = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-[#f9fafb]">Perguntas Frequentes (FAQ)</h1>
                <p className="text-[#9ca3af] mt-1 mb-6">Encontre respostas para as dúvidas mais comuns sobre a plataforma.</p>
            </div>
            <div className="bg-[#1f2937] rounded-lg border border-[#374151] max-w-3xl mx-auto">
                {faqData.map((item, index) => (
                    <AccordionItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === index}
                        onClick={() => handleClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ;