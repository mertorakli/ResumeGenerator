import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onChange: (option: DropdownOption) => void;
  value?: DropdownOption | null;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

const Dropdown = ({
  options,
  placeholder = 'Select an option',
  onChange,
  value = null,
  className = '',
  buttonClassName = '',
  menuClassName = ''
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-30 ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          {value?.icon && <span>{value.icon}</span>}
          <span className={value ? 'text-gray-800' : 'text-gray-500'}>
            {value ? value.label : placeholder}
          </span>
        </span>
        <div>
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
      </button>

      {isOpen && (
        <div
          className={`fixed z-50 w-[calc(100%-2rem)] mt-1 bg-white border border-gray-200 rounded-lg shadow-lg ${menuClassName}`}
          style={{
            width: dropdownRef.current ? dropdownRef.current.offsetWidth : 'auto',
            left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
            top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 5 : 0,
          }}
        >
          <ul className="py-1 overflow-auto max-h-60">
            {options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={`flex items-center w-full px-4 py-2.5 text-sm hover:bg-gray-50 ${
                    value?.id === option.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown; 