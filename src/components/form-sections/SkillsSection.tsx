import React, { useState } from 'react'
import { Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { Wrench, Trash2, Plus, Lightbulb } from 'lucide-react'
import Button from '../ui/Button'
import FormEntry from '../ui/FormEntry'
import FormInput from '../ui/FormInput'
import SkillSuggestions from '../SkillSuggestions'

interface SkillsSectionProps {
  register: UseFormRegister<ResumeData>
  control: Control<ResumeData>
  watch: UseFormWatch<ResumeData>
  setValue: UseFormSetValue<ResumeData>
  errors: any
}

export default function SkillsSection({ register, control, watch, setValue, errors }: SkillsSectionProps) {
  const skills = watch('skills') || []
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAddSkill = () => {
    setValue('skills', [...skills, ''])
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index)
    setValue('skills', updatedSkills)
  }

  const handleSelectSkill = (skill: string) => {
    // Check if skill already exists
    if (skills.includes(skill)) return
    
    // Find first empty skill slot or add to the end
    const emptyIndex = skills.findIndex(s => !s.trim())
    if (emptyIndex !== -1) {
      const newSkills = [...skills]
      newSkills[emptyIndex] = skill
      setValue('skills', newSkills)
    } else {
      setValue('skills', [...skills, skill])
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-white">Skills</h2>
        <p className="text-white/80 text-sm">
          List your key skills and technical competencies.
        </p>
      </div>

      {/* Toggle suggestions button */}
      <button
        type="button"
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {showSuggestions ? 'Hide skill suggestions' : 'Show skill suggestions'}
      </button>

      {/* Skill suggestions */}
      {showSuggestions && <SkillSuggestions onSelectSkill={handleSelectSkill} />}

      {skills.length === 0 ? (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleAddSkill}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {skills.map((_, index) => (
              <FormEntry key={index}>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name={`skills.${index}` as const}
                      render={({ field }) => (
                        <FormInput
                          label={`Skill ${index + 1}`}
                          icon={Wrench}
                          placeholder="e.g. JavaScript, Project Management, Photoshop"
                          error={errors.skills?.[index]?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="pt-6">
                    <Button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </FormEntry>
            ))}
          </div>

          <Button
            type="button"
            onClick={handleAddSkill}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Skill
          </Button>
        </>
      )}
    </div>
  )
} 