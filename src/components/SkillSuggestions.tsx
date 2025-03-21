import React, { useState } from 'react';
import { skillsData, SkillCategory } from '@/data/skillsData';
import { Lightbulb, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface SkillSuggestionsProps {
  onSelectSkill: (skill: string) => void;
}

export default function SkillSuggestions({ onSelectSkill }: SkillSuggestionsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>("Programming Languages");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter skills based on search query
  const filteredSkills = searchQuery.trim() !== "" 
    ? skillsData.flatMap(category => 
        category.skills
          .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(skill => ({ skill, category: category.name }))
      )
    : [];

  return (
    <div className="mb-4 bg-gray-800/30 p-3 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white/90 text-sm font-medium flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-indigo-400" />
          Skill Suggestions
        </h3>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full bg-gray-700/70 text-white text-xs py-1 pl-7 pr-2 rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      {searchQuery.trim() !== "" ? (
        <div className="py-2">
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">
            {filteredSkills.length > 0 ? filteredSkills.map(({ skill, category }, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectSkill(skill)}
                className="px-2 py-0.5 bg-gray-700/70 hover:bg-indigo-600/70 text-white rounded text-xs transition-colors duration-200 border border-white/5 hover:border-indigo-500/40"
              >
                {skill}
              </button>
            )) : (
              <p className="text-gray-400 text-xs">No skills found matching "{searchQuery}"</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {skillsData.map((category) => (
            <div key={category.name} className="mb-1">
              <button
                type="button"
                onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                className="w-full flex justify-between items-center text-left text-xs text-gray-300 hover:text-white py-1 px-2 rounded bg-gray-700/40 hover:bg-gray-700/70 transition-colors border border-white/5"
              >
                <span>{category.name}</span>
                {activeCategory === category.name ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              
              {activeCategory === category.name && (
                <div className="pl-2 mt-1 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto scrollbar-thin pr-1">
                  {category.skills.map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => onSelectSkill(skill)}
                      className="px-2 py-0.5 bg-gray-700/70 hover:bg-indigo-600/70 text-white rounded text-xs transition-colors duration-200 border border-white/5 hover:border-indigo-500/40"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 