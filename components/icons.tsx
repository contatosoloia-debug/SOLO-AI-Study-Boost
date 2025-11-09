import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  strokeWidth: 1.5,
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// FIX: Update all icon components to accept SVG props to allow overriding className.
export const HomeIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
  <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const PlanIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
  <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const TutorIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
  <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

export const SimulatorIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M14 9l-2-2-2 2m4 6l-2 2-2-2" />
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
        <path d="M12 15V9" />
    </svg>
);

export const FlashcardIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M6 3h12a2 2 0 012 2v2H4V5a2 2 0 012-2z" />
    </svg>
);

export const CalendarIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
  <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" />
    <path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
  </svg>
);

export const WritingIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

export const MindmapIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M12 3v1m0 16v1m-7-8h1m14 0h1m-9-6.5L9.5 9.5M14.5 9.5L12 12" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 15a6 6 0 00-6 6h12a6 6 0 00-6-6zM12 9a6 6 0 00-6-6h12a6 6 0 00-6 6z" />
    </svg>
);

export const FaqIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

export const ProgressIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export const MenuIcon = (props: React.SVGAttributes<SVGSVGElement>) => <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" /></svg>
export const XIcon = (props: React.SVGAttributes<SVGSVGElement>) => <svg {...iconProps} {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
export const SendIcon = (props: React.SVGAttributes<SVGSVGElement>) => <svg {...iconProps} className="w-5 h-5" {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9 22 2z" /></svg>

export const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const NotepadIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} className="w-8 h-8" {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

export const DragHandleIcon = (props: React.SVGAttributes<SVGSVGElement>) => (
    <svg {...iconProps} className="w-5 h-5 cursor-move" {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
    </svg>
);