
import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { NotepadIcon, DragHandleIcon, XIcon } from './icons';

const FloatingNotepad: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState('');
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const [notepadPosition, setNotepadPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 500 });
    
    const fabRef = useRef<HTMLButtonElement>(null);
    const notepadRef = useRef<HTMLDivElement>(null);

    const [todayFocus, setTodayFocus] = useState("Nenhum foco definido");

    useEffect(() => {
        // Load FAB position
        const savedFabPosition = localStorage.getItem('fabPosition');
        if (savedFabPosition) {
            setPosition(JSON.parse(savedFabPosition));
        }

        // Load Notepad position
        const savedNotepadPosition = localStorage.getItem('notepadPosition');
        if (savedNotepadPosition) {
            setNotepadPosition(JSON.parse(savedNotepadPosition));
        }

        // Load notes
        const savedNotes = localStorage.getItem('notepadContent');
        if (savedNotes) {
            setNotes(savedNotes);
        }

        // Load study focus
        const savedPlan = localStorage.getItem('studyPlan');
        if (savedPlan) {
            const plan = JSON.parse(savedPlan);
            const dayOfWeek = new Date().toLocaleString('pt-BR', { weekday: 'long' });
            const todayPlan = plan.find((d: any) => d.Dia.toLowerCase() === dayOfWeek.toLowerCase());
            if (todayPlan) {
                setTodayFocus(`${todayPlan.Disciplina}: ${todayPlan.Tópico}`);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('notepadContent', notes);
    }, [notes]);
    
    const makeDraggable = (
        ref: React.RefObject<HTMLElement>,
        pos: {x: number, y: number},
        setPos: React.Dispatch<React.SetStateAction<{x: number, y: number}>>,
        storageKey: string
    ) => {
        let isDragging = false;
        let offset = { x: 0, y: 0 };
    
        const onMouseDown = (e: MouseEvent) => {
            if (!ref.current) return;
            isDragging = true;
            offset = {
                x: e.clientX - ref.current.offsetLeft,
                y: e.clientY - ref.current.offsetTop,
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
    
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const newPos = {
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            };
            setPos(newPos);
        };
    
        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            localStorage.setItem(storageKey, JSON.stringify(pos));
        };
        
        const el = ref.current;
        el?.addEventListener('mousedown', onMouseDown);
    
        return () => {
            el?.removeEventListener('mousedown', onMouseDown);
        };
    };

    useEffect(() => makeDraggable(fabRef, position, setPosition, 'fabPosition'), [position]);
    useEffect(() => {
        if (notepadRef.current) {
            const handle = notepadRef.current.querySelector('.drag-handle');
            if(handle) {
                // This is a workaround as we can't pass a ref to a child element for the drag handle
                const onMouseDown = (e: Event) => {
                    const mouseEvent = e as MouseEvent;
                    let isDragging = true;
                    let offset = { x: mouseEvent.clientX - notepadPosition.x, y: mouseEvent.clientY - notepadPosition.y };
    
                    const onMouseMove = (moveEvent: MouseEvent) => {
                        if (isDragging) {
                            setNotepadPosition({ x: moveEvent.clientX - offset.x, y: moveEvent.clientY - offset.y });
                        }
                    };
    
                    const onMouseUp = () => {
                        isDragging = false;
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                        localStorage.setItem('notepadPosition', JSON.stringify({ x: mouseEvent.clientX - offset.x, y: mouseEvent.clientY - offset.y }));
                    };
    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                };
                handle.addEventListener('mousedown', onMouseDown);
                return () => handle.removeEventListener('mousedown', onMouseDown);
            }
        }
    }, [isOpen, notepadPosition]);

    const exportTxt = () => {
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'anotacoes.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportPdf = () => {
        const doc = new jsPDF();
        doc.text(notes, 10, 10);
        doc.save('anotacoes.pdf');
    };

    return (
        <>
            <button
                ref={fabRef}
                onClick={() => setIsOpen(true)}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                className="fixed z-50 w-16 h-16 bg-[#3b82f6] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#2563eb] cursor-move"
            >
                <NotepadIcon />
            </button>

            {isOpen && (
                <div
                    ref={notepadRef}
                    style={{ left: `${notepadPosition.x}px`, top: `${notepadPosition.y}px` }}
                    className="fixed z-50 w-96 h-[450px] bg-[#1f2937] border border-[#374151] rounded-lg shadow-2xl flex flex-col"
                >
                    <div className="flex items-center justify-between p-2 border-b border-[#374151] bg-[#374151] rounded-t-lg drag-handle cursor-move">
                        <DragHandleIcon />
                        <span className="font-semibold">Bloco de Notas</span>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-[#4b5563] p-1 rounded-full"><XIcon/></button>
                    </div>
                    <div className='p-3 text-xs text-[#9ca3af] border-b border-[#374151]'>
                        <p><strong>Foco do dia:</strong> {todayFocus}</p>
                        <p><strong>Data:</strong> {new Date().toLocaleString('pt-BR')}</p>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="flex-grow p-3 bg-transparent w-full h-full resize-none focus:outline-none"
                        placeholder="Suas anotações rápidas aqui..."
                    ></textarea>
                     <div className="flex justify-end gap-2 p-2 border-t border-[#374151]">
                        <button onClick={exportTxt} className="px-3 py-1 text-xs bg-[#374151] hover:bg-[#4b5563] rounded">Exportar .txt</button>
                        <button onClick={exportPdf} className="px-3 py-1 text-xs bg-[#374151] hover:bg-[#4b5563] rounded">Exportar .pdf</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingNotepad;
