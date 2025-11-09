import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { NotepadIcon, XIcon, DragHandleIcon, DownloadIcon } from './icons';

const FloatingNotepad: React.FC = () => {
    // --- State for Notepad Window ---
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState('');
    const [position, setPosition] = useState({ x: window.innerWidth - 350, y: window.innerHeight - 450 });
    const notepadRef = useRef<HTMLDivElement>(null);
    const notepadDragInfo = useRef({ isDragging: false, startX: 0, startY: 0 });

    // --- State for Floating Action Button (FAB) ---
    const [fabPosition, setFabPosition] = useState({ x: window.innerWidth - 88, y: window.innerHeight - 88 });
    const fabRef = useRef<HTMLButtonElement>(null);
    const fabDragInfo = useRef({
        isDragging: false,
        hasMoved: false,
        dragStartMouseX: 0,
        dragStartMouseY: 0,
        dragStartFabX: 0,
        dragStartFabY: 0,
    });

    // --- Load from localStorage on mount ---
    useEffect(() => {
        const savedNotes = localStorage.getItem('floatingNotes');
        if (savedNotes) setNotes(savedNotes);

        const savedPosition = localStorage.getItem('floatingNotesPosition');
        if (savedPosition) {
            try {
                const parsed = JSON.parse(savedPosition);
                setPosition({
                    x: Math.max(0, Math.min(parsed.x, window.innerWidth - 320)),
                    y: Math.max(0, Math.min(parsed.y, window.innerHeight - 420)), // Adjusted height for footer
                });
            } catch (e) { console.error("Failed to parse notepad position", e); }
        }
        
        const savedFabPosition = localStorage.getItem('floatingFabPosition');
        if (savedFabPosition) {
            try {
                const parsed = JSON.parse(savedFabPosition);
                 setFabPosition({
                    x: Math.max(0, Math.min(parsed.x, window.innerWidth - 72)),
                    y: Math.max(0, Math.min(parsed.y, window.innerHeight - 72)),
                });
            } catch (e) { console.error("Failed to parse FAB position", e); }
        }
    }, []);

    // --- Save to localStorage on change ---
    useEffect(() => {
        const handler = setTimeout(() => localStorage.setItem('floatingNotes', notes), 500);
        return () => clearTimeout(handler);
    }, [notes]);
    
    useEffect(() => {
        if(isOpen) localStorage.setItem('floatingNotesPosition', JSON.stringify(position));
    }, [position, isOpen]);
    
     useEffect(() => {
        localStorage.setItem('floatingFabPosition', JSON.stringify(fabPosition));
    }, [fabPosition]);

    // --- Drag Handlers for Notepad Window ---
    const handleNotepadMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!notepadRef.current) return;
        notepadDragInfo.current = {
            isDragging: true,
            startX: e.clientX - notepadRef.current.offsetLeft,
            startY: e.clientY - notepadRef.current.offsetTop,
        };
        window.addEventListener('mousemove', handleNotepadMouseMove);
        window.addEventListener('mouseup', handleNotepadMouseUp);
    };

    const handleNotepadMouseMove = (e: MouseEvent) => {
        if (!notepadDragInfo.current.isDragging || !notepadRef.current) return;
        let newX = e.clientX - notepadDragInfo.current.startX;
        let newY = e.clientY - notepadDragInfo.current.startY;
        newX = Math.max(0, Math.min(newX, window.innerWidth - notepadRef.current.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - notepadRef.current.offsetHeight));
        setPosition({ x: newX, y: newY });
    };

    const handleNotepadMouseUp = () => {
        notepadDragInfo.current.isDragging = false;
        window.removeEventListener('mousemove', handleNotepadMouseMove);
        window.removeEventListener('mouseup', handleNotepadMouseUp);
    };

    // --- Drag Handlers for FAB ---
    const handleFabMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!fabRef.current) return;

        fabDragInfo.current = {
            isDragging: true,
            hasMoved: false,
            dragStartMouseX: e.clientX,
            dragStartMouseY: e.clientY,
            dragStartFabX: fabRef.current.offsetLeft,
            dragStartFabY: fabRef.current.offsetTop,
        };
        window.addEventListener('mousemove', handleFabMouseMove);
        window.addEventListener('mouseup', handleFabMouseUp);
    };

    const handleFabMouseMove = (e: MouseEvent) => {
        if (!fabDragInfo.current.isDragging || !fabRef.current) return;

        const deltaX = e.clientX - fabDragInfo.current.dragStartMouseX;
        const deltaY = e.clientY - fabDragInfo.current.dragStartMouseY;
        
        if (!fabDragInfo.current.hasMoved && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
            fabDragInfo.current.hasMoved = true;
        }

        if (fabDragInfo.current.hasMoved) {
            let newX = fabDragInfo.current.dragStartFabX + deltaX;
            let newY = fabDragInfo.current.dragStartFabY + deltaY;

            newX = Math.max(0, Math.min(newX, window.innerWidth - fabRef.current.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - fabRef.current.offsetHeight));

            setFabPosition({ x: newX, y: newY });
        }
    };

    const handleFabMouseUp = () => {
        window.removeEventListener('mousemove', handleFabMouseMove);
        window.removeEventListener('mouseup', handleFabMouseUp);
        
        if (!fabDragInfo.current.hasMoved) {
            setIsOpen(true);
        }
        
        fabDragInfo.current.isDragging = false;
        fabDragInfo.current.hasMoved = false;
    };
    
    // --- Export Functions ---
    const exportTxt = () => {
        if (!notes.trim()) return;
        const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'anotacoes.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportPdf = () => {
        if (!notes.trim()) return;
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(notes, 180);
        doc.text(splitText, 10, 10);
        doc.save('anotacoes.pdf');
    };


    if (!isOpen) {
        return (
            <button
                ref={fabRef}
                onMouseDown={handleFabMouseDown}
                style={{ top: `${fabPosition.y}px`, left: `${fabPosition.x}px` }}
                className="fixed bg-[#3b82f6] hover:bg-[#2563eb] text-white p-4 rounded-full shadow-lg z-50 cursor-grab active:cursor-grabbing select-none"
                aria-label="Abrir bloco de notas"
            >
                <NotepadIcon />
            </button>
        );
    }

    return (
        <div
            ref={notepadRef}
            className="fixed w-80 h-[420px] bg-[#1f2937] border border-[#374151] rounded-lg shadow-2xl z-50 flex flex-col"
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
            <div
                onMouseDown={handleNotepadMouseDown}
                className="flex items-center justify-between p-2 bg-[#374151] rounded-t-lg cursor-move select-none"
            >
                <div className="flex items-center">
                    <DragHandleIcon />
                    <h3 className="text-sm font-bold ml-2">Bloco de Notas Rápido</h3>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-[#4b5563] z-10"
                    aria-label="Fechar bloco de notas"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Suas anotações..."
                className="flex-1 w-full p-3 bg-[#1f2937] text-[#f9fafb] resize-none focus:outline-none"
            />
            <div className="p-2 bg-[#374151] rounded-b-lg flex justify-between items-center text-xs text-[#9ca3af]">
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
                <div className="flex gap-3">
                    <button onClick={exportTxt} title="Exportar como .txt" className="flex items-center gap-1 hover:text-white transition-colors">
                        <DownloadIcon className="w-4 h-4" /> TXT
                    </button>
                    <button onClick={exportPdf} title="Exportar como .pdf" className="flex items-center gap-1 hover:text-white transition-colors">
                        <DownloadIcon className="w-4 h-4" /> PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FloatingNotepad;