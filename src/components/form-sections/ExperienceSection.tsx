import React from 'react'
import { useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue, Controller } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { Briefcase, Building2, MapPin, Calendar, Trash2, Plus } from 'lucide-react'
import Button from '../ui/Button'
import FormEntry from '../ui/FormEntry'
import FormInput from '../ui/FormInput'
import FormTextarea from '../ui/FormTextarea'

interface ExperienceSectionProps {
  register: UseFormRegister<ResumeData>
  control: Control<ResumeData>
  watch: UseFormWatch<ResumeData>
  setValue: UseFormSetValue<ResumeData>
  errors: any
}

export default function ExperienceSection({ register, control, watch, setValue, errors }: ExperienceSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  })

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-white">Work Experience</h2>
        <p className="text-white/80 text-sm">
          List your work experience in chronological order, starting with the most recent.
        </p>
      </div>

      {fields.length === 0 ? (
        <div className="flex justify-center py-8">
          <Button
            type="button"
            onClick={() => append({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            size="lg"
          >
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <FormEntry key={field.id}>
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">Experience Entry {index + 1}</h3>
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
                      name={`experience.${index}.title` as const}
                      render={({ field }) => (
                        <FormInput
                          label="Job Title"
                          icon={Briefcase}
                          placeholder="e.g. Software Engineer"
                          error={errors.experience?.[index]?.title?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`experience.${index}.company` as const}
                      render={({ field }) => (
                        <FormInput
                          label="Company"
                          icon={Building2}
                          placeholder="e.g. Tech Company Inc."
                          error={errors.experience?.[index]?.company?.message}
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name={`experience.${index}.location` as const}
                      render={({ field }) => (
                        <FormInput
                          label="Location"
                          icon={MapPin}
                          placeholder="e.g. New York, NY"
                          error={errors.experience?.[index]?.location?.message}
                          {...field}
                        />
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Controller
                        control={control}
                        name={`experience.${index}.startDate` as const}
                        render={({ field }) => (
                          <FormInput
                            label="Start Date"
                            type="date"
                            icon={Calendar}
                            error={errors.experience?.[index]?.startDate?.message}
                            {...field}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`experience.${index}.endDate` as const}
                        render={({ field }) => (
                          <FormInput
                            label="End Date"
                            type="date"
                            icon={Calendar}
                            placeholder="Present"
                            error={errors.experience?.[index]?.endDate?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <Controller
                    control={control}
                    name={`experience.${index}.description` as const}
                    render={({ field }) => (
                      <FormTextarea
                        label="Description"
                        rows={4}
                        placeholder="Describe your responsibilities and achievements..."
                        error={errors.experience?.[index]?.description?.message}
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
            onClick={() => append({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Experience
          </Button>
        </>
      )}
    </div>
  )
} 