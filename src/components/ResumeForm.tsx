'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { testResumeData } from '@/utils/testData'
import Accordion from './Accordion'
import Dropdown from './Dropdown'
import DatePicker from './DatePicker'

const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    location: z.string().min(1, 'Location is required'),
    summary: z.string().min(1, 'Professional summary is required'),
  }),
  experience: z.array(z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company name is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string(),
    description: z.string().min(1, 'Job description is required'),
  })),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    school: z.string().min(1, 'School name is required'),
    location: z.string().min(1, 'Location is required'),
    graduationDate: z.string().min(1, 'Graduation date is required'),
  })),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  languages: z.array(z.object({
    language: z.string().min(1, 'Language is required'),
    proficiency: z.string().min(1, 'Proficiency is required'),
  })),
  customSections: z.array(z.object({
    title: z.string().min(1, 'Section title is required'),
    description: z.string().min(1, 'Description is required'),
  })),
})

type ResumeData = z.infer<typeof resumeSchema>

type ExperienceEntry = {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
}

type EducationEntry = {
  degree: string
  school: string
  location: string
  graduationDate: string
}

const steps = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'experience', title: 'Experience' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'languages', title: 'Languages' },
  { id: 'customSections', title: 'Custom Sections' },
  { id: 'review', title: 'Review' }
]

export default function ResumeForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [skills, setSkills] = useState<string[]>([''])
  const [validationError, setValidationError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors }, control, watch, reset, setValue } = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
      },
      experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', description: '' }],
      education: [{ degree: '', school: '', location: '', graduationDate: '' }],
      skills: [''],
      languages: [{ language: '', proficiency: '' }],
      customSections: [{ title: '', description: '' }],
    },
  })

  const experienceArray = useFieldArray({
    control,
    name: 'experience',
  })

  const educationArray = useFieldArray({
    control,
    name: 'education',
  })

  const languageArray = useFieldArray({
    control,
    name: 'languages',
  })

  const customSectionArray = useFieldArray({
    control,
    name: 'customSections',
  })

  const addSkill = () => {
    setSkills([...skills, ''])
  }

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index)
    setSkills(newSkills)
  }

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills]
    newSkills[index] = value
    setSkills(newSkills)
  }

  const addLanguage = () => {
    languageArray.append({ language: '', proficiency: '' })
  }

  const addCustomSection = () => {
    customSectionArray.append({ title: '', description: '' })
  }

  const addExperience = () => {
    experienceArray.append({ 
      title: '', 
      company: '', 
      location: '', 
      startDate: '', 
      endDate: '', 
      description: '' 
    })
  }

  const removeExperience = (index: number) => {
    experienceArray.remove(index)
  }

  const addEducation = () => {
    educationArray.append({ 
      degree: '', 
      school: '', 
      location: '', 
      graduationDate: '' 
    })
  }

  const removeEducation = (index: number) => {
    educationArray.remove(index)
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const removeCustomSection = (index: number) => {
    customSectionArray.remove(index)
  }

  const onSubmit = (data: ResumeData) => {
    try {
      // Clear any previous validation errors
      setValidationError(null)

      // Validate the form data
      if (currentStep === steps.length - 1) {
        let errors = []

        // Check for empty sections
        const validSkills = skills.filter(skill => skill.trim() !== '')
        if (validSkills.length === 0) {
          errors.push('Please add at least one skill')
        }

        if (data.experience.length === 0) {
          errors.push('Please add at least one experience entry')
        }

        if (data.education.length === 0) {
          errors.push('Please add at least one education entry')
        }

        // Check for required fields in personal info
        const personalInfoErrors = Object.entries(data.personalInfo).filter(([_, value]) => !value)
        if (personalInfoErrors.length > 0) {
          errors.push('Please fill in all required personal information fields')
        }

        // Check for required fields in experience
        const experienceErrors = data.experience.some(exp => 
          !exp.title || !exp.company || !exp.location || !exp.startDate || !exp.description
        )
        if (experienceErrors) {
          errors.push('Please fill in all required experience fields')
        }

        // Check for required fields in education
        const educationErrors = data.education.some(edu => 
          !edu.degree || !edu.school || !edu.location || !edu.graduationDate
        )
        if (educationErrors) {
          errors.push('Please fill in all required education fields')
        }

        // Check for required fields in languages
        const languageErrors = data.languages.some(lang => 
          !lang.language || !lang.proficiency
        )
        if (languageErrors && data.languages.length > 0) {
          errors.push('Please fill in all required language fields')
        }

        // Check for empty custom sections
        const customSectionErrors = data.customSections.some(section => 
          !section.title.trim() || !section.description.trim()
        )
        if (customSectionErrors) {
          errors.push('Please fill in all required custom section fields')
        }

        if (errors.length > 0) {
          setValidationError(errors.join('\n'))
          return
        }

        // Remove empty custom sections before submitting
        const nonEmptyCustomSections = data.customSections.filter(
          section => section.title.trim() !== '' && section.description.trim() !== ''
        )
        data.customSections = nonEmptyCustomSections

        // Proceed with form submission
        const formData = {
          ...data,
          skills: validSkills,
        }
        const queryParams = new URLSearchParams()
        queryParams.set('data', JSON.stringify(formData))
        const template = new URLSearchParams(window.location.search).get('template') || 'professional'
        queryParams.set('template', template)
        router.push(`/preview?${queryParams.toString()}`)
      } else {
        nextStep()
      }
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error.message)
      } else {
        setValidationError('An unexpected error occurred')
      }
    }
  }

  const addLink = () => {
    // Logic to add a new link field
  }

  const fillWithTestData = () => {
    // Fill personal info
    Object.entries(testResumeData.personalInfo).forEach(([key, value]) => {
      setValue(`personalInfo.${key as keyof typeof testResumeData.personalInfo}`, value)
    })

    // Fill experience
    experienceArray.remove()
    testResumeData.experience.forEach((exp) => {
      experienceArray.append(exp)
    })

    // Fill education
    educationArray.remove()
    testResumeData.education.forEach((edu) => {
      educationArray.append(edu)
    })

    // Fill skills
    setSkills(testResumeData.skills)

    // Fill languages
    languageArray.remove()
    testResumeData.languages.forEach((lang) => {
      languageArray.append(lang)
    })

    // Fill custom sections
    customSectionArray.remove()
    testResumeData.customSections.forEach((section) => {
      customSectionArray.append(section)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex flex-col justify-center items-center">
      {/* Progress bar at the top of the page */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-300 z-50">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="w-full max-w-3xl px-4">
        <div className="text-center text-white py-8">
          <h1 className="text-4xl font-extrabold mb-4">Create Your Resume</h1>
          <p className="text-lg">Fill in your information below to generate your professional resume.</p>
          <button
            type="button"
            onClick={fillWithTestData}
            className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-opacity-90 transition-colors duration-200"
          >
            Fill with Test Data
          </button>
        </div>
        <div className="mb-8">
          <div className="relative px-4 py-5 bg-indigo-700 bg-opacity-30 rounded-lg">
            {/* Remove the progress bar from here since we moved it to the top */}
            
            {/* Step indicators */}
          <div className="flex justify-between items-center w-full relative">
            {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className="flex flex-col items-center cursor-pointer z-10" 
                  onClick={() => setCurrentStep(index)}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index < currentStep 
                        ? 'bg-indigo-600 text-white' 
                        : index === currentStep 
                          ? 'bg-indigo-500 text-white ring-4 ring-indigo-300' 
                          : 'bg-white text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                  <span className="text-xs mt-2 text-white text-center hidden sm:block">{step.title}</span>
              </div>
            ))}
            </div>
            
            {/* Current step label for mobile */}
            <div className="text-center mt-4 text-white font-medium sm:hidden">
              Step {currentStep + 1}: {steps[currentStep].title}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-white">Full Name</label>
                      <input
                        type="text"
                        {...register('personalInfo.fullName')}
                        className="mt-1 block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        placeholder="John Doe"
                      />
                      {errors.personalInfo?.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.personalInfo.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white">Email</label>
                      <input
                        type="email"
                        {...register('personalInfo.email')}
                        className="mt-1 block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        placeholder="john@example.com"
                      />
                      {errors.personalInfo?.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white">Phone</label>
                      <input
                        type="tel"
                        {...register('personalInfo.phone')}
                        className="mt-1 block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.personalInfo?.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.personalInfo.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white">Location</label>
                      <input
                        type="text"
                        {...register('personalInfo.location')}
                        className="mt-1 block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        placeholder="City, Country"
                      />
                      {errors.personalInfo?.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.personalInfo.location.message}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-white">Professional Summary</label>
                      <textarea
                        {...register('personalInfo.summary')}
                        rows={4}
                        className="mt-1 block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                        placeholder="Brief overview of your professional background..."
                      />
                      {errors.personalInfo?.summary && (
                        <p className="mt-1 text-sm text-red-600">{errors.personalInfo.summary.message}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={addLink}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Experience</h2>
                  <div className="space-y-4">
                  {experienceArray.fields.map((field, index) => (
                      <Accordion
                        key={field.id}
                        title={watch(`experience.${index}.title`) || `Job ${index + 1}`}
                        defaultOpen={index === 0}
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Job Title</label>
                          <input
                            type="text"
                            {...register(`experience.${index}.title`)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                              {errors.experience?.[index]?.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.title?.message}</p>
                              )}
                        </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Company</label>
                          <input
                            type="text"
                            {...register(`experience.${index}.company`)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                              {errors.experience?.[index]?.company && (
                                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.company?.message}</p>
                              )}
                        </div>
                      </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            {...register(`experience.${index}.location`)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                            {errors.experience?.[index]?.location && (
                              <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.location?.message}</p>
                            )}
                        </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Start Date</label>
                              <DatePicker
                                selected={watch(`experience.${index}.startDate`) ? new Date(watch(`experience.${index}.startDate`)) : null}
                                onChange={(date) => setValue(`experience.${index}.startDate`, date ? date.toLocaleDateString() : '')}
                                placeholder="MM/DD/YYYY"
                                dateFormat="MM/dd/yyyy"
                              />
                              {errors.experience?.[index]?.startDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.startDate?.message}</p>
                              )}
                        </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">End Date</label>
                              <DatePicker
                                selected={watch(`experience.${index}.endDate`) ? new Date(watch(`experience.${index}.endDate`)) : null}
                                onChange={(date) => setValue(`experience.${index}.endDate`, date ? date.toLocaleDateString() : '')}
                                placeholder="MM/DD/YYYY or leave blank for 'Present'"
                                dateFormat="MM/dd/yyyy"
                                isClearable={true}
                          />
                        </div>
                      </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            {...register(`experience.${index}.description`)}
                              rows={4}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                            {errors.experience?.[index]?.description && (
                              <p className="mt-1 text-sm text-red-600">{errors.experience[index]?.description?.message}</p>
                            )}
                        </div>
                      {index > 0 && (
                            <div className="flex justify-end">
                          <button
                            type="button"
                                onClick={() => removeExperience(index)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                      </Accordion>
                  ))}
                </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addExperience}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Experience
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Education</h2>
                  <div className="space-y-4">
                  {educationArray.fields.map((field, index) => (
                      <Accordion
                        key={field.id}
                        title={watch(`education.${index}.degree`) || `Degree ${index + 1}`}
                        defaultOpen={index === 0}
                      >
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Degree</label>
                          <input
                            type="text"
                            {...register(`education.${index}.degree`)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                              {errors.education?.[index]?.degree && (
                                <p className="mt-1 text-sm text-red-600">{errors.education[index]?.degree?.message}</p>
                              )}
                        </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">School</label>
                          <input
                            type="text"
                            {...register(`education.${index}.school`)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                              {errors.education?.[index]?.school && (
                                <p className="mt-1 text-sm text-red-600">{errors.education[index]?.school?.message}</p>
                              )}
                        </div>
                      </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                          <input
                            type="text"
                            {...register(`education.${index}.location`)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                            {errors.education?.[index]?.location && (
                              <p className="mt-1 text-sm text-red-600">{errors.education[index]?.location?.message}</p>
                            )}
                        </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Graduation Date</label>
                            <DatePicker
                              selected={watch(`education.${index}.graduationDate`) ? new Date(watch(`education.${index}.graduationDate`)) : null}
                              onChange={(date) => setValue(`education.${index}.graduationDate`, date ? date.toLocaleDateString() : '')}
                              placeholder="MM/DD/YYYY"
                              dateFormat="MM/dd/yyyy"
                              showMonthYearPicker={true}
                            />
                            {errors.education?.[index]?.graduationDate && (
                              <p className="mt-1 text-sm text-red-600">{errors.education[index]?.graduationDate?.message}</p>
                            )}
                        </div>
                      {index > 0 && (
                            <div className="flex justify-end">
                          <button
                            type="button"
                                onClick={() => removeEducation(index)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                      </Accordion>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Education
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Skills</h2>
                    <button
                      type="button"
                      onClick={() => setSkills([...skills, ''])}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                    >
                      Add Skill
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-x-4">
                        <div className="flex-grow">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                            placeholder="Enter a skill"
                          />
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 overflow-visible">
                  <h2 className="text-2xl font-bold text-white mb-4">Language Skills</h2>
                  
                  <div className="bg-white bg-opacity-95 rounded-xl shadow-lg overflow-hidden">
                  {languageArray.fields.map((field, index) => (
                      <div 
                        key={field.id}
                        className={`border-b border-gray-100 ${index === languageArray.fields.length - 1 ? 'border-b-0' : ''}`}
                      >
                        <div 
                          className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => {
                            // Toggle accordion logic here if needed
                          }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </div>
                            <h3 className="font-medium text-gray-800">{field.language || 'Language'}</h3>
                          </div>
                          <div className="flex items-center">
                            {watch(`languages.${index}.proficiency`) && (
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mr-3">
                                {watch(`languages.${index}.proficiency`)}
                              </span>
                            )}
                        <button
                          type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                languageArray.remove(index);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                        </button>
                      </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                              <input
                                type="text"
                                placeholder="Language"
                                {...register(`languages.${index}.language`)}
                                className="block w-full rounded-md bg-white border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 p-2.5"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                              <Dropdown
                                options={[
                                  { id: 'Native', label: 'Native' },
                                  { id: 'Fluent', label: 'Fluent' },
                                  { id: 'Conversational', label: 'Conversational' },
                                  { id: 'Basic', label: 'Basic' },
                                ]}
                                placeholder="Select proficiency level"
                                value={watch(`languages.${index}.proficiency`) ? 
                                  { id: watch(`languages.${index}.proficiency`), label: watch(`languages.${index}.proficiency`) } : 
                                  null
                                }
                                onChange={(option) => {
                                  setValue(`languages.${index}.proficiency`, option.label);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="p-4 bg-gray-50">
                  <button
                    type="button"
                    onClick={addLanguage}
                        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200"
                  >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    Add Language
                  </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6 overflow-visible">
                  <h2 className="text-2xl font-bold text-white mb-4">Custom Sections</h2>
                  
                  <div className="bg-white bg-opacity-95 rounded-xl shadow-lg overflow-hidden">
                  {customSectionArray.fields.map((field, index) => (
                      <div 
                        key={field.id}
                        className={`border-b border-gray-100 ${index === customSectionArray.fields.length - 1 ? 'border-b-0' : ''}`}
                      >
                        <div className="p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </div>
                            <h3 className="font-medium text-gray-800">{field.title || 'Custom Section'}</h3>
                          </div>
                      <button
                        type="button"
                        onClick={() => removeCustomSection(index)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                        </div>
                        
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <div className="space-y-4">
                      <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                        <input
                          type="text"
                          {...register(`customSections.${index}.title`)}
                                className="block w-full rounded-md bg-white border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 p-2.5"
                                placeholder="e.g., Projects, Certifications, Awards"
                        />
                        {errors.customSections?.[index]?.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.customSections[index]?.title?.message}</p>
                        )}
                      </div>
                      <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          {...register(`customSections.${index}.description`)}
                          rows={4}
                                className="block w-full rounded-md bg-white border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900 p-2.5"
                                placeholder="Describe your achievements, projects, or other relevant information"
                        />
                        {errors.customSections?.[index]?.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.customSections[index]?.description?.message}</p>
                        )}
                            </div>
                          </div>
                      </div>
                    </div>
                  ))}
                    
                    <div className="p-4 bg-gray-50">
                  <button
                    type="button"
                    onClick={addCustomSection}
                        className="w-full flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors duration-200"
                  >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    Add Section
                  </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-8">
                  <div className="bg-white bg-opacity-95 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                      <h2 className="text-2xl font-medium text-gray-800">Review Your Resume</h2>
                      <p className="text-sm text-gray-500 mt-1">Verify your information before generating your resume</p>
                    </div>
                    
                    <div className="p-6">
                      {/* Personal Information */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                          <button 
                            type="button" 
                            onClick={() => setCurrentStep(0)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`bg-gray-50 p-4 rounded-lg ${errors.personalInfo?.fullName ? 'border border-red-300' : ''}`}>
                            <p className="text-sm text-gray-500 mb-1">Full Name</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.fullName') || 'Not provided'}</p>
                            {errors.personalInfo?.fullName && (
                              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.fullName.message}</p>
                            )}
                    </div>
                          <div className={`bg-gray-50 p-4 rounded-lg ${errors.personalInfo?.email ? 'border border-red-300' : ''}`}>
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.email') || 'Not provided'}</p>
                            {errors.personalInfo?.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>
                            )}
                        </div>
                          <div className={`bg-gray-50 p-4 rounded-lg ${errors.personalInfo?.phone ? 'border border-red-300' : ''}`}>
                            <p className="text-sm text-gray-500 mb-1">Phone</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.phone') || 'Not provided'}</p>
                            {errors.personalInfo?.phone && (
                              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.phone.message}</p>
                            )}
                    </div>
                          <div className={`bg-gray-50 p-4 rounded-lg ${errors.personalInfo?.location ? 'border border-red-300' : ''}`}>
                            <p className="text-sm text-gray-500 mb-1">Location</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.location') || 'Not provided'}</p>
                            {errors.personalInfo?.location && (
                              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.location.message}</p>
                            )}
                    </div>
                        </div>
                        <div className={`mt-4 bg-gray-50 p-4 rounded-lg ${errors.personalInfo?.summary ? 'border border-red-300' : ''}`}>
                          <p className="text-sm text-gray-500 mb-1">Professional Summary</p>
                          <p className="text-gray-800">{watch('personalInfo.summary') || 'Not provided'}</p>
                          {errors.personalInfo?.summary && (
                            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.summary.message}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Experience */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Experience</h3>
                          <button 
                            type="button" 
                            onClick={() => setCurrentStep(1)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                        </div>
                        {watch('experience').length === 0 ? (
                          <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                            <p className="text-red-600">No experience entries added. Please add at least one experience entry.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {watch('experience').map((exp, index) => {
                              const hasErrors = errors.experience?.[index]
                              return (
                                <div key={index} className={`bg-gray-50 p-4 rounded-lg ${hasErrors ? 'border border-red-300' : ''}`}>
                                  <div className="flex justify-between items-start">
                    <div>
                                      <h4 className="font-medium text-gray-800">{exp.title || 'No title provided'}</h4>
                                      <p className="text-gray-600">{exp.company || 'No company provided'}</p>
                        </div>
                                    <div className="text-right">
                                      <p className="text-gray-600">{exp.location || 'No location provided'}</p>
                                      <p className="text-sm text-gray-500">{exp.startDate || 'No start date'} - {exp.endDate || 'Present'}</p>
                    </div>
                                  </div>
                                  <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description || 'No description provided'}</p>
                                  {hasErrors && (
                                    <div className="mt-2 p-2 bg-red-50 rounded">
                                      {errors.experience?.[index]?.title && (
                                        <p className="text-sm text-red-600">{errors.experience?.[index]?.title?.message}</p>
                                      )}
                                      {errors.experience?.[index]?.company && (
                                        <p className="text-sm text-red-600">{errors.experience?.[index]?.company?.message}</p>
                                      )}
                                      {errors.experience?.[index]?.location && (
                                        <p className="text-sm text-red-600">{errors.experience?.[index]?.location?.message}</p>
                                      )}
                                      {errors.experience?.[index]?.startDate && (
                                        <p className="text-sm text-red-600">{errors.experience?.[index]?.startDate?.message}</p>
                                      )}
                                      {errors.experience?.[index]?.description && (
                                        <p className="text-sm text-red-600">{errors.experience?.[index]?.description?.message}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      
                      {/* Education */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Education</h3>
                          <button 
                            type="button" 
                            onClick={() => setCurrentStep(2)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                        </div>
                        {watch('education').length === 0 ? (
                          <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                            <p className="text-red-600">No education entries added. Please add at least one education entry.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {watch('education').map((edu, index) => {
                              const hasErrors = errors.education?.[index]
                              return (
                                <div key={index} className={`bg-gray-50 p-4 rounded-lg ${hasErrors ? 'border border-red-300' : ''}`}>
                                  <div className="flex justify-between items-start">
                    <div>
                                      <h4 className="font-medium text-gray-800">{edu.degree || 'No degree provided'}</h4>
                                      <p className="text-gray-600">{edu.school || 'No school provided'}</p>
                        </div>
                                    <div className="text-right">
                                      <p className="text-gray-600">{edu.location || 'No location provided'}</p>
                                      <p className="text-sm text-gray-500">{edu.graduationDate || 'No graduation date provided'}</p>
                                    </div>
                                  </div>
                                  {hasErrors && (
                                    <div className="mt-2 p-2 bg-red-50 rounded">
                                      {errors.education?.[index]?.degree && (
                                        <p className="text-sm text-red-600">{errors.education?.[index]?.degree?.message}</p>
                                      )}
                                      {errors.education?.[index]?.school && (
                                        <p className="text-sm text-red-600">{errors.education?.[index]?.school?.message}</p>
                                      )}
                                      {errors.education?.[index]?.location && (
                                        <p className="text-sm text-red-600">{errors.education?.[index]?.location?.message}</p>
                                      )}
                                      {errors.education?.[index]?.graduationDate && (
                                        <p className="text-sm text-red-600">{errors.education?.[index]?.graduationDate?.message}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      
                      {/* Skills */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Skills</h3>
                          <button 
                            type="button" 
                            onClick={() => setCurrentStep(3)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                        </div>
                        {skills.filter(skill => skill.trim() !== '').length === 0 ? (
                          <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                            <p className="text-red-600">No skills added. Please add at least one skill.</p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-wrap gap-2">
                              {skills.filter(skill => skill.trim() !== '').map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                  {skill}
                                </span>
                      ))}
                    </div>
                  </div>
                        )}
                        {errors.skills && (
                          <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
                        )}
                </div>
                      
                      {/* Languages */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-800">Languages</h3>
                          <button 
                            type="button" 
                            onClick={() => setCurrentStep(4)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {watch('languages').map((lang, index) => {
                            const hasErrors = errors.languages?.[index]
                            return (
                              <div key={index} className={`bg-gray-50 p-4 rounded-lg flex justify-between items-center ${hasErrors ? 'border border-red-300' : ''}`}>
                                <span className="font-medium text-gray-800">{lang.language || 'No language provided'}</span>
                                <span className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                                  {lang.proficiency || 'No proficiency provided'}
                                </span>
                                {hasErrors && (
                                  <div className="mt-2 p-2 bg-red-50 rounded">
                                    {errors.languages?.[index]?.language && (
                                      <p className="text-sm text-red-600">{errors.languages?.[index]?.language?.message}</p>
                                    )}
                                    {errors.languages?.[index]?.proficiency && (
                                      <p className="text-sm text-red-600">{errors.languages?.[index]?.proficiency?.message}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      
                      {/* Custom Sections */}
                      {watch('customSections').length > 0 && (
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-800">Custom Sections</h3>
                            <button 
                              type="button" 
                              onClick={() => setCurrentStep(5)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                          </div>
                          <div className="space-y-4">
                            {watch('customSections').filter(section => section.title.trim() !== '' && section.description.trim() !== '').map((section, index) => {
                              const hasErrors = errors.customSections?.[index]
                              return (
                                <div key={index} className={`bg-gray-50 p-4 rounded-lg ${hasErrors ? 'border border-red-300' : ''}`}>
                                  <h4 className="font-medium text-gray-800 mb-2">{section.title}</h4>
                                  <p className="text-gray-700 whitespace-pre-line">{section.description}</p>
                                  {hasErrors && (
                                    <div className="mt-2 p-2 bg-red-50 rounded">
                                      {errors.customSections?.[index]?.title && (
                                        <p className="text-sm text-red-600">{errors.customSections?.[index]?.title?.message}</p>
                                      )}
                                      {errors.customSections?.[index]?.description && (
                                        <p className="text-sm text-red-600">{errors.customSections?.[index]?.description?.message}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

          {validationError && (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
            </div>
                        <div className="ml-3 w-full">
                          <h3 className="text-lg font-medium text-red-800">Please fix the following errors:</h3>
                          <div className="mt-2 text-red-700">
                            {validationError.split('\n').map((error, index) => (
                              <div key={index} className="flex items-start mt-2">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2">{error}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4">
                            <div className="flex space-x-3">
                              {validationError.includes('personal information') && (
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(0)}
                                  className="inline-flex items-center px-3 py-2 border border-red-600 text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Fix Personal Info
                                </button>
                              )}
                              {validationError.includes('experience') && (
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(1)}
                                  className="inline-flex items-center px-3 py-2 border border-red-600 text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Fix Experience
                                </button>
                              )}
                              {validationError.includes('education') && (
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(2)}
                                  className="inline-flex items-center px-3 py-2 border border-red-600 text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Fix Education
                                </button>
                              )}
                              {validationError.includes('skill') && (
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(3)}
                                  className="inline-flex items-center px-3 py-2 border border-red-600 text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Fix Skills
                                </button>
                              )}
                              {validationError.includes('language') && (
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(4)}
                                  className="inline-flex items-center px-3 py-2 border border-red-600 text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Fix Languages
                                </button>
                              )}
                              {validationError.includes('custom section') && (
                                <button
                                  type="button"
                                  onClick={() => setCurrentStep(5)}
                                  className="inline-flex items-center px-3 py-2 border border-red-600 text-sm leading-4 font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Fix Custom Sections
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 ${
                currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={currentStep === steps.length - 1 ? handleSubmit(onSubmit) : nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
              {currentStep === steps.length - 1 ? 'Generate Resume' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 