import React from 'react'
import { UseFormRegister, UseFormWatch, Controller, Control } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react'
import FormInput from '../ui/FormInput'
import FormTextarea from '../ui/FormTextarea'

interface PersonalInfoSectionProps {
  register: UseFormRegister<ResumeData>
  watch: UseFormWatch<ResumeData>
  control: Control<ResumeData>
  errors: any
}

export default function PersonalInfoSection({
  register,
  watch,
  control,
  errors,
}: PersonalInfoSectionProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-light text-white tracking-tight">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Controller
          control={control}
          name="personalInfo.fullName"
          render={({ field }) => (
            <FormInput
              label="Full Name"
              icon={User}
              placeholder="John Doe"
              error={errors.personalInfo?.fullName?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="personalInfo.email"
          render={({ field }) => (
            <FormInput
              label="Email"
              type="email"
              icon={Mail}
              placeholder="john@example.com"
              error={errors.personalInfo?.email?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="personalInfo.phone"
          render={({ field }) => (
            <FormInput
              label="Phone"
              type="tel"
              icon={Phone}
              placeholder="+1 (555) 123-4567"
              error={errors.personalInfo?.phone?.message}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="personalInfo.location"
          render={({ field }) => (
            <FormInput
              label="Location"
              icon={MapPin}
              placeholder="New York, NY"
              error={errors.personalInfo?.location?.message}
              {...field}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="personalInfo.summary"
        render={({ field }) => (
          <FormTextarea
            label="Professional Summary"
            icon={FileText}
            rows={4}
            placeholder="Write a brief summary of your professional background and career goals..."
            error={errors.personalInfo?.summary?.message}
            {...field}
          />
        )}
      />
    </div>
  )
} 