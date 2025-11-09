import React from 'react';
import { View } from '../types';
import { HomeIcon, PlanIcon, TutorIcon, SimulatorIcon, FlashcardIcon, CalendarIcon, WritingIcon, MindmapIcon, FaqIcon, ProgressIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

// FIX: Add 'as const' to ensure `item.view` is typed as a literal, not a generic string.
const navItems = [
  { view: 'home', label: 'Painel Principal', icon: HomeIcon, pro: false },
  { view: 'progress', label: 'Progresso Geral', icon: ProgressIcon, pro: false },
  { view: 'plan', label: 'Plano de Estudos', icon: PlanIcon, pro: false },
  { view: 'tutor', label: 'Tutor IA', icon: TutorIcon, pro: false },
  { view: 'simulator', label: 'Simulado de Questões', icon: SimulatorIcon, pro: false },
  { view: 'flashcards', label: 'Flashcards', icon: FlashcardIcon, pro: false },
  { view: 'calendar', label: 'Calendário Motivacional', icon: CalendarIcon, pro: false },
  { view: 'writing', label: 'Corretor de Redação', icon: WritingIcon, pro: true },
  { view: 'mindmap', label: 'Mapas Mentais', icon: MindmapIcon, pro: true },
  { view: 'faq', label: 'FAQ', icon: FaqIcon, pro: false },
] as const;

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setOpen }) => {
  const handleNavClick = (view: View) => {
    setView(view);
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  // FIX: Changed type of `item` to be any element of `navItems` array, not just the first.
  const NavLink: React.FC<{ item: (typeof navItems)[number] }> = ({ item }) => {
    const isActive = currentView === item.view;
    return (
      <button
        onClick={() => handleNavClick(item.view)}
        className={`w-full flex items-center p-3 my-1 rounded-lg transition-colors text-left ${
          isActive
            ? 'bg-[#3b82f6] text-[#f9fafb]'
            : 'text-[#9ca3af] hover:bg-[#374151] hover:text-[#f9fafb]'
        }`}
      >
        <div className={`relative w-6 h-6 mr-3 ${isActive ? '' : 'text-[#9ca3af]'}`}>
          <item.icon />
          {isActive && <div className="absolute -left-3 top-0 bottom-0 w-1 bg-[#f9fafb] rounded-r-full"></div>}
        </div>
        <span className="flex-1">{item.label}</span>
        {item.pro && (
          <span className="text-xs font-bold bg-[#f59e0b] text-[#111827] px-2 py-0.5 rounded-full">
            PRO
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      ></div>
      <aside
        className={`absolute lg:relative z-40 lg:z-auto w-64 bg-[#1f2937] h-full flex flex-col p-4 transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center mb-8">
            <div className="p-2 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-lg">
                <MindmapIcon />
            </div>
            <h1 className="text-2xl font-bold ml-3">Solo AI</h1>
        </div>
        <nav className="flex-1">
          {navItems.map((item) => (
            <NavLink key={item.view} item={item} />
          ))}
        </nav>
        <div className="mt-auto">
            <div className="bg-[#374151] p-4 rounded-lg text-center">
                <p className="text-sm text-[#9ca3af]">Atingiu seu potencial máximo?</p>
                <button className="w-full mt-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Upgrade para PRO
                </button>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
