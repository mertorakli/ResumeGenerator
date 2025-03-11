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
        // Check for empty sections
        const validSkills = skills.filter(skill => skill.trim() !== '');
        if (validSkills.length === 0) {
          setValidationError('Please add at least one skill');
          return;
        }

        if (data.experience.length === 0) {
          setValidationError('Please add at least one experience entry');
          return;
        }

        if (data.education.length === 0) {
          setValidationError('Please add at least one education entry');
          return;
        }

        // Remove empty custom sections before submitting
        const nonEmptyCustomSections = data.customSections.filter(
          section => section.title.trim() !== '' && section.description.trim() !== ''
        );
        data.customSections = nonEmptyCustomSections;

        // Proceed with form submission
        const formData = {
          ...data,
          skills: validSkills, // Use the filtered valid skills
        };
        const queryParams = new URLSearchParams();
        queryParams.set('data', JSON.stringify(formData));
        const template = new URLSearchParams(window.location.search).get('template') || 'professional';
        queryParams.set('template', template);
        router.push(`/preview?${queryParams.toString()}`);
      } else {
        nextStep();
      }
    } catch (error) {
      if (error instanceof Error) {
        setValidationError(error.message);
      } else {
        setValidationError('An unexpected error occurred');
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
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Work Experience</h2>
                    <button
                      type="button"
                      onClick={() => experienceArray.append({ 
                        title: '', 
                        company: '', 
                        location: '', 
                        startDate: '', 
                        endDate: '', 
                        description: '' 
                      })}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                    >
                      Add Experience
                    </button>
                  </div>
                  {experienceArray.fields.map((field, index) => (
                    <div key={field.id} className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 border-b border-gray-900/10 pb-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-white">Job Title</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register(`experience.${index}.title`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-white">Company</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register(`experience.${index}.company`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white">Location</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register(`experience.${index}.location`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white">Start Date</label>
                        <div className="mt-2">
                          <input
                            type="date"
                            {...register(`experience.${index}.startDate`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-white">End Date</label>
                        <div className="mt-2">
                          <input
                            type="date"
                            {...register(`experience.${index}.endDate`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-white">Description</label>
                        <div className="mt-2">
                          <textarea
                            {...register(`experience.${index}.description`)}
                            rows={3}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      {index > 0 && (
                        <div className="col-span-full flex justify-end">
                          <button
                            type="button"
                            onClick={() => experienceArray.remove(index)}
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Education</h2>
                    <button
                      type="button"
                      onClick={() => educationArray.append({ 
                        degree: '', 
                        school: '', 
                        location: '', 
                        graduationDate: '' 
                      })}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                    >
                      Add Education
                    </button>
                  </div>
                  {educationArray.fields.map((field, index) => (
                    <div key={field.id} className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 border-b border-gray-900/10 pb-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-white">Degree</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register(`education.${index}.degree`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-white">School</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register(`education.${index}.school`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-white">Location</label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register(`education.${index}.location`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-white">Graduation Date</label>
                        <div className="mt-2">
                          <input
                            type="date"
                            {...register(`education.${index}.graduationDate`)}
                            className="block w-full rounded-md bg-white bg-opacity-90 border border-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                          />
                        </div>
                      </div>

                      {index > 0 && (
                        <div className="col-span-full flex justify-end">
                          <button
                            type="button"
                            onClick={() => educationArray.remove(index)}
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
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
                <div className="space-y-6 bg-white bg-opacity-90 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900">Custom Sections</h3>
                  {customSectionArray.fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border border-gray-200 rounded-md relative">
                      <button
                        type="button"
                        onClick={() => removeCustomSection(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Section Title</label>
                        <input
                          type="text"
                          {...register(`customSections.${index}.title`)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.customSections?.[index]?.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.customSections[index]?.title?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          {...register(`customSections.${index}.description`)}
                          rows={4}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.customSections?.[index]?.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.customSections[index]?.description?.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCustomSection}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Add Section
                  </button>
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
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Full Name</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.fullName')}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.email')}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Phone</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.phone')}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Location</p>
                            <p className="text-gray-800 font-medium">{watch('personalInfo.location')}</p>
                          </div>
                        </div>
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Professional Summary</p>
                          <p className="text-gray-800">{watch('personalInfo.summary')}</p>
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
                        <div className="space-y-4">
                          {watch('experience').map((exp, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-800">{exp.title}</h4>
                                  <p className="text-gray-600">{exp.company}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-600">{exp.location}</p>
                                  <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                                </div>
                              </div>
                              <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
                            </div>
                          ))}
                        </div>
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
                        <div className="space-y-4">
                          {watch('education').map((edu, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-800">{edu.degree}</h4>
                                  <p className="text-gray-600">{edu.school}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-600">{edu.location}</p>
                                  <p className="text-sm text-gray-500">{edu.graduationDate}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
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
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {skills.filter(skill => skill.trim() !== '').map((skill, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
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
                          {watch('languages').map((lang, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                              <span className="font-medium text-gray-800">{lang.language}</span>
                              <span className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                                {lang.proficiency}
                              </span>
                            </div>
                          ))}
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
                            {watch('customSections').filter(section => section.title.trim() !== '' && section.description.trim() !== '').map((section, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-2">{section.title}</h4>
                                <p className="text-gray-700 whitespace-pre-line">{section.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {validationError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {validationError}
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