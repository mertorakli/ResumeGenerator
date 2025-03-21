import React, { useState } from 'react'
import { useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { Globe, MessageSquare, Trash2, Plus, Lightbulb } from 'lucide-react'
import Button from '../ui/Button'
import FormEntry from '../ui/FormEntry'
import FormInput from '../ui/FormInput'
import CustomDropdown from '../ui/CustomDropdown'
import LanguageSuggestions from '../LanguageSuggestions'
import { proficiencyLevels } from '@/data/languageData'

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
  
  const languages = watch('languages') || []
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const proficiencyOptions = proficiencyLevels.map(level => ({
    value: level.level,
    label: level.level,
    description: level.description
  }))

  const handleSelectLanguage = (language: string) => {
    // Check if this language is already in the list
    const exists = languages.some(lang => 
      lang.language && lang.language.toLowerCase() === language.toLowerCase()
    )
    
    if (exists) return
    
    // Find first empty language slot or add to the end
    const emptyIndex = languages.findIndex(lang => !lang.language.trim())
    if (emptyIndex !== -1) {
      setValue(`languages.${emptyIndex}.language`, language)
    } else {
      append({ language, proficiency: '' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-white">Languages</h2>
        <p className="text-white/80 text-sm">
          List the languages you speak and your proficiency level.
        </p>
      </div>

      {/* Toggle suggestions button */}
      <button
        type="button"
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {showSuggestions ? 'Hide language suggestions' : 'Show language suggestions'}
      </button>

      {/* Language suggestions */}
      {showSuggestions && <LanguageSuggestions onSelectLanguage={handleSelectLanguage} />}

      {fields.length === 0 ? (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => append({ language: '', proficiency: '' })}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Add Your First Language
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <FormEntry key={field.id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <CustomDropdown
                          label="Proficiency"
                          icon={<MessageSquare size={18} />}
                          placeholder="Select proficiency level"
                          options={proficiencyOptions}
                          error={errors.languages?.[index]?.proficiency?.message}
                          value={field.value}
                          onChange={field.onChange}
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
        </>
      )}
    </div>
  )
} 