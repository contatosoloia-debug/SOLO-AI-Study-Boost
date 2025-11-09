
import React from 'react';

const UpgradeNotice: React.FC = () => {
    return (
        <div className="bg-[#1f2937] p-6 rounded-lg border border-[#374151] text-center">
            <h2 className="text-xl font-bold text-[#f9fafb]">Desbloqueie todo o seu potencial!</h2>
            <p className="text-[#9ca3af] mt-2">
                Faça o upgrade para a versão PRO e tenha acesso ilimitado a todas as ferramentas, incluindo o Corretor de Redação e o Gerador de Mapas Mentais.
            </p>
            <button className="mt-4 w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Ver Planos PRO
            </button>
        </div>
    );
};

export default UpgradeNotice;
