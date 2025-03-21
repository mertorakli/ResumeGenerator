import React from 'react'
import { useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { GraduationCap, Building2, MapPin, Calendar, Trash2, Plus } from 'lucide-react'
import Button from '../ui/Button'
import FormEntry from '../ui/FormEntry'
import FormInput from '../ui/FormInput'
import FormTextarea from '../ui/FormTextarea'

interface EducationSectionProps {
  register: UseFormRegister<ResumeData>
  control: Control<ResumeData>
  watch: UseFormWatch<ResumeData>
  setValue: UseFormSetValue<ResumeData>
  errors: any
}

export default function EducationSection({ register, control, watch, setValue, errors }: EducationSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education"
  })

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-white">Education</h2>
        <p className="text-white/80 text-sm">
          List your educational background, starting with the most recent degree. This section is optional.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="flex justify-center py-8">
          <Button
            type="button"
            onClick={() => append({ degree: '', school: '', location: '', graduationDate: '' })}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Add Your First Education Entry
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <FormEntry key={field.id}>
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">Education Entry {index + 1}</h3>
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
                      name={`education.${index}.degree` as const}
                      render={({ field }) => (
                        <FormInput
                          label="Degree"
                          icon={GraduationCap}
                          placeholder="e.g. Bachelor of Science in Computer Science"
                          error={errors.education?.[index]?.degree?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`education.${index}.school` as const}
                      render={({ field }) => (
                        <FormInput
                          label="School"
                          icon={Building2}
                          placeholder="e.g. University of Technology"
                          error={errors.education?.[index]?.school?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`education.${index}.location` as const}
                      render={({ field }) => (
                        <FormInput
                          label="Location"
                          icon={MapPin}
                          placeholder="e.g. New York, NY"
                          error={errors.education?.[index]?.location?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`education.${index}.graduationDate` as const}
                      render={({ field }) => (
                        <FormInput
                          label="Graduation Date"
                          type="date"
                          icon={Calendar}
                          error={errors.education?.[index]?.graduationDate?.message}
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
            onClick={() => append({ degree: '', school: '', location: '', graduationDate: '' })}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Education
          </Button>
        </>
      )}
    </div>
  )
} 