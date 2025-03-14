import React from 'react'
import { Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { Wrench, Trash2, Plus } from 'lucide-react'
import Button from '../ui/Button'
import FormEntry from '../ui/FormEntry'
import FormInput from '../ui/FormInput'

interface SkillsSectionProps {
  register: UseFormRegister<ResumeData>
  control: Control<ResumeData>
  watch: UseFormWatch<ResumeData>
  setValue: UseFormSetValue<ResumeData>
  errors: any
}

export default function SkillsSection({ register, control, watch, setValue, errors }: SkillsSectionProps) {
  const skills = watch('skills') || ['']

  const handleAddSkill = () => {
    setValue('skills', [...skills, ''])
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index)
    setValue('skills', updatedSkills.length ? updatedSkills : [''])
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-white">Skills</h2>
        <p className="text-white/80 text-sm">
          List your key skills and technical competencies.
        </p>
      </div>

      <div className="space-y-6">
        {skills.map((_, index) => (
          <FormEntry key={index}>
            <div className="flex items-center space-x-4">
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
    </div>
  )
} 