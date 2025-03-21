import React, { useState } from 'react';
import { commonLanguages } from '@/data/languageData';
import { Globe, Search } from 'lucide-react';

interface LanguageSuggestionsProps {
  onSelectLanguage: (language: string) => void;
}

export default function LanguageSuggestions({ onSelectLanguage }: LanguageSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter languages based on search query
  const filteredLanguages = searchQuery.trim() !== "" 
    ? commonLanguages.filter(language => 
        language.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commonLanguages;

  return (
    <div className="mb-4 bg-gray-800/30 p-3 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white/90 text-sm font-medium flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Common Languages
        </h3>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find language..."
            className="w-full bg-gray-700/70 text-white text-xs py-1 pl-7 pr-2 rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      <div className="py-2">
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">
          {filteredLanguages.length > 0 ? filteredLanguages.map((language, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelectLanguage(language)}
              className="px-2 py-0.5 bg-gray-700/70 hover:bg-indigo-600/70 text-white rounded text-xs transition-colors duration-200 border border-white/5 hover:border-indigo-500/40"
            >
              {language}
            </button>
          )) : (
            <p className="text-gray-400 text-xs">No languages found matching "{searchQuery}"</p>
          )}
        </div>
      </div>
    </div>
  );
} 