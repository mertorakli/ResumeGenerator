import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion = ({ 
  title, 
  children, 
  icon, 
  defaultOpen = false,
  className = ''
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`overflow-hidden rounded-lg shadow-sm mb-3 ${className}`}>
      <div
        className="flex justify-between items-center p-3 cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="p-3 border-t border-gray-100 bg-white overflow-visible">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion; 