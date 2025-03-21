import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option', 
  label,
  icon,
  error
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  const hasValue = value !== undefined && value !== null && value.trim() !== '';
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <div ref={dropdownRef} className="relative">
        <div className={`
          relative rounded-lg transition-all duration-200 
          before:absolute before:inset-0 before:rounded-lg before:transition-opacity before:duration-200
          before:bg-gradient-to-r before:from-emerald-500/40 before:via-emerald-500/50 before:to-emerald-500/40
          after:absolute after:inset-0 after:rounded-lg after:transition-opacity after:duration-200
          after:bg-white/10
          ${hasValue ? 'before:opacity-100 after:opacity-100 ring-1 ring-emerald-500/30' : 'before:opacity-0 after:opacity-30'}
        `}>
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 z-20">
              {icon}
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              relative w-full px-4 py-3 rounded-lg z-10
              bg-transparent
              border border-white/10
              focus:outline-none focus:ring-2 
              focus:ring-indigo-500 focus:border-transparent
              transition-all duration-200
              text-left
              ${icon ? 'pl-10' : ''}
              ${hasValue ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}
            `}
            style={{
              color: hasValue ? '#ffffff' : '#ffffff80',
              fontWeight: hasValue ? '500' : '300',
            }}
          >
            <span className={`block truncate`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </span>
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800/95 border border-white/10 rounded-md shadow-lg shadow-black/50">
            <div className="p-2">
              <input
                type="text"
                className="w-full bg-gray-700/70 text-white text-sm p-2 rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              <ul className="py-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-700/90 ${
                          value === option.value ? 'bg-indigo-600/20 text-indigo-300' : 'text-white'
                        }`}
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                      >
                        <div>
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-gray-400">{option.description}</div>
                          )}
                        </div>
                        {value === option.value && (
                          <Check className="w-4 h-4 text-indigo-400" />
                        )}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-gray-400">No options found</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default CustomDropdown; 