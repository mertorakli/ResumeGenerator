import React from 'react'
import { useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { FolderPlus, Trash2, Plus, Type, FileText } from 'lucide-react'
import Button from '../ui/Button'
import FormEntry from '../ui/FormEntry'
import FormInput from '../ui/FormInput'
import FormTextarea from '../ui/FormTextarea'

interface CustomSectionsProps {
  register: UseFormRegister<ResumeData>
  control: Control<ResumeData>
  watch: UseFormWatch<ResumeData>
  setValue: UseFormSetValue<ResumeData>
  errors: any
}

export default function CustomSections({ register, control, watch, setValue, errors }: CustomSectionsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customSections"
  })

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-white">Custom Sections</h2>
        <p className="text-white/80 text-sm">
          Add any additional sections to highlight your achievements, certifications, or other relevant information.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <FormEntry key={field.id}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-white">Section {index + 1}</h3>
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

              <Controller
                control={control}
                name={`customSections.${index}.title` as const}
                render={({ field }) => (
                  <FormInput
                    label="Section Title"
                    icon={Type}
                    placeholder="e.g. Certifications, Projects, Publications"
                    error={errors.customSections?.[index]?.title?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                control={control}
                name={`customSections.${index}.description` as const}
                render={({ field }) => (
                  <FormTextarea
                    label="Description"
                    icon={FileText}
                    rows={4}
                    placeholder="Describe the details of this section..."
                    error={errors.customSections?.[index]?.description?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </FormEntry>
        ))}
      </div>

      <Button
        type="button"
        onClick={() => append({ title: '', description: '' })}
        variant="primary"
        icon={<Plus className="w-4 h-4" />}
      >
        Add Custom Section
      </Button>
    </div>
  )
} 