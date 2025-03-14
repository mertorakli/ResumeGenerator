import React from 'react'
import { useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { Globe, MessageSquare, Trash2, Plus } from 'lucide-react'
import Button from '../ui/Button'
import FormEntry from '../ui/FormEntry'
import FormInput from '../ui/FormInput'

interface LanguagesSectionProps {
  register: UseFormRegister<ResumeData>
  control: Control<ResumeData>
  watch: UseFormWatch<ResumeData>
  setValue: UseFormSetValue<ResumeData>
  errors: any
}

export default function LanguagesSection({ register, control, watch, setValue, errors }: LanguagesSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages"
  })

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-white">Languages</h2>
        <p className="text-white/80 text-sm">
          List the languages you speak and your proficiency level.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <FormEntry key={field.id}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-white">Language {index + 1}</h3>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  control={control}
                  name={`languages.${index}.language` as const}
                  render={({ field }) => (
                    <FormInput
                      label="Language"
                      icon={Globe}
                      placeholder="e.g. English, Spanish, French"
                      error={errors.languages?.[index]?.language?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`languages.${index}.proficiency` as const}
                  render={({ field }) => (
                    <FormInput
                      label="Proficiency"
                      icon={MessageSquare}
                      placeholder="e.g. Native, Fluent, Intermediate, Basic"
                      error={errors.languages?.[index]?.proficiency?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </FormEntry>
        ))}
      </div>

      <Button
        type="button"
        onClick={() => append({ language: '', proficiency: '' })}
        variant="primary"
        icon={<Plus className="w-4 h-4" />}
      >
        Add Language
      </Button>
    </div>
  )
} 