import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
// FIx: Corrected import for Home component
import Home from './components/Home';
import StudyPlanGenerator from './components/StudyPlanGenerator';
import AITutor from './components/AITutor';
import QuestionSimulator from './components/QuestionSimulator';
import Flashcards from './components/Flashcards';
// Fix: Corrected import for MotivationalCalendar component
import MotivationalCalendar from './components/MotivationalCalendar';
import WritingCoach from './components/WritingCoach';
import MindMapGenerator from './components/MindMapGenerator';
import FAQ from './components/FAQ';
import FloatingNotepad from './components/FloatingNotepad';
import OverallProgress from './components/OverallProgress';
// Fix: Corrected import for View type
import { View } from './types';
import { MenuIcon, XIcon } from './components/icons';

const App: React.FC = () => {
  const { auth } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!auth.isLoggedIn) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home setView={setCurrentView} />;
      case 'plan':
        return <StudyPlanGenerator />;
      case 'tutor':
        return <AITutor />;
      case 'simulator':
        return <QuestionSimulator />;
      case 'flashcards':
        return <Flashcards />;
      case 'calendar':
        return <MotivationalCalendar />;
      case 'writing':
        return <WritingCoach />;
      case 'mindmap':
        return <MindMapGenerator />;
      case 'faq':
        return <FAQ />;
      case 'progress':
        return <OverallProgress />;
      default:
        return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#111827] text-[#f9fafb]">
      <Sidebar currentView={currentView} setView={setCurrentView} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex justify-between items-center p-4 bg-[#1f2937] border-b border-[#374151]">
          <h1 className="text-xl font-bold text-[#f9fafb]">Solo AI Study Boost</h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-[#9ca3af] hover:text-[#f9fafb]">
            {isSidebarOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
      <FloatingNotepad />
    </div>
  );
};

export default App;