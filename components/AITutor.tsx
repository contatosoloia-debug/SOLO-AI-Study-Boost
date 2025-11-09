
import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import type { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { SendIcon, LoadingSpinner } from './icons';

const AITutor: React.FC = () => {
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = createChatSession(history);
    setChatSession(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const sendMessage = async () => {
    if (!userInput.trim() || !chatSession || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
    setHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const stream = await chatSession.sendMessageStream({ message: userInput });

        let modelResponse = '';
        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }] };
        setHistory(prev => [...prev, modelMessage]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
                return newHistory;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: ChatMessage = { role: 'model', parts: [{ text: 'Desculpe, ocorreu um erro. Tente novamente.' }] };
        setHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const formatText = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    let formattedText = text.replace(boldRegex, '<strong>$1</strong>');
    formattedText = formattedText.replace(italicRegex, '<em>$1</em>');
    return <div dangerouslySetInnerHTML={{ __html: formattedText.replace(/\n/g, '<br />') }} />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-[#1f2937] rounded-lg border border-[#374151] shadow-lg">
      <div className="p-4 border-b border-[#374151]">
        <h1 className="text-xl font-bold">Tutor IA</h1>
        <p className="text-sm text-[#9ca3af]">Converse com a IA para tirar dúvidas e aprender.</p>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-[#3b82f6] text-white' : 'bg-[#374151] text-[#f9fafb]'}`}>
              {formatText(msg.parts[0].text)}
            </div>
          </div>
        ))}
        {isLoading && history[history.length - 1]?.role !== 'model' && (
             <div className="flex justify-start">
                <div className="max-w-xl p-3 rounded-lg bg-[#374151] text-[#f9fafb] flex items-center">
                    <LoadingSpinner /> <span>Pensando...</span>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-[#374151]">
        <div className="flex items-center bg-[#374151] rounded-lg">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 bg-transparent p-3 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !userInput.trim()}
            className="p-3 text-[#9ca3af] hover:text-white disabled:text-[#4b5563] disabled:cursor-not-allowed"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
