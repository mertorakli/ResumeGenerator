'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { resumeSchema, ResumeData, defaultResumeData } from '@/types/resume'
import { testResumeData } from '@/utils/testData'
import PersonalInfoSection from './form-sections/PersonalInfoSection'
import ExperienceSection from './form-sections/ExperienceSection'
import EducationSection from './form-sections/EducationSection'
import SkillsSection from './form-sections/SkillsSection'
import LanguagesSection from './form-sections/LanguagesSection'
import CustomSections from './form-sections/CustomSections'
import ReviewSection from './form-sections/ReviewSection'
import Button from './ui/Button'

type StepId = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'customSections' | 'review'

interface Step {
  id: StepId
  title: string
}

const steps: Step[] = [
  { id: 'personal', title: 'Personal Information' },
  { id: 'experience', title: 'Experience' },
  { id: 'education', title: 'Education' },
  { id: 'skills', title: 'Skills' },
  { id: 'languages', title: 'Languages' },
  { id: 'customSections', title: 'Custom Sections' },
  { id: 'review', title: 'Review' }
] as const

const stepComponents: Record<StepId, React.ComponentType<any>> = {
  personal: PersonalInfoSection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  languages: LanguagesSection,
  customSections: CustomSections,
  review: ReviewSection
}

export default function ResumeForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  
  const { register, handleSubmit, formState: { errors }, control, watch, setValue, reset, trigger } = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeData,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const fillWithTestData = () => {
    // Use a more direct approach to reset with test data
    reset({...testResumeData}, {
      keepDefaultValues: false,
      keepDirty: false,
      keepErrors: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false
    });
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleFinalSubmit = async (data: ResumeData) => {
    console.log('handleFinalSubmit called with data:', data);
    try {
      // Submit data to API instead of storing in URL
      console.log('Sending API request to /api/resume');
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error('Failed to save resume');
      }
      
      const result = await response.json();
      console.log('API response data:', result);
      const { id } = result;
      
      // Navigate with just the ID and template
      const template = new URLSearchParams(window.location.search).get('template') || 'professional';
      console.log('Navigating to:', `/preview?id=${id}&template=${template}`);
      router.push(`/preview?id=${id}&template=${template}`);
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume: ' + (error instanceof Error ? error.message : 'Unknown error'));
      // Here you could add error handling UI
    }
  }

  const onSubmit = (data: ResumeData) => {
    console.log('Form submitted on step', currentStep, 'of', steps.length - 1);
    // This is now only used for the form's onSubmit handler
    if (currentStep === steps.length - 1) {
      console.log('On final step, calling handleFinalSubmit');
      handleFinalSubmit(data);
    } else {
      console.log('Not on final step, moving to next step');
      nextStep();
    }
  }

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      // On the last step, trigger form submission which will validate
      handleSubmit(handleFinalSubmit)()
    } else {
      // Otherwise just go to next step without validation
      nextStep()
    }
  }

  const goToStep = (index: number) => {
    setCurrentStep(index)
  }

  const getStepIndexById = (stepId: StepId): number => {
    return steps.findIndex(step => step.id === stepId);
  }

  const navigateToSection = (sectionId: StepId) => {
    goToStep(getStepIndexById(sectionId));
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-300 z-50">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center space-y-6 py-12">
          <h1 className="text-5xl font-light tracking-tight text-white mb-4">
            Create Your Resume
          </h1>
          <p className="text-lg text-white font-light max-w-2xl mx-auto">
            Less, but better. Fill in your information below to generate a clean, professional resume that stands out.
          </p>
          <Button
            type="button"
            onClick={fillWithTestData}
            variant="outline"
            size="md"
          >
            Fill with Test Data
          </Button>
        </div>

        {/* Mobile Navigation - Only visible on small screens */}
        <div className="md:hidden mb-8">
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Button 
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              size="sm"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
              aria-label="Previous"
            />
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                  {currentStep + 1}
                </div>
                <span className="text-white ml-2">of {steps.length}</span>
              </div>
              <div className="text-white font-medium">{steps[currentStep].title}</div>
            </div>
            
            <Button 
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              variant="outline"
              size="sm"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
              aria-label="Next"
            />
          </div>
          
          {/* Mobile Step Indicator */}
          <div className="mt-4 overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2 min-w-max">
              {steps.map((step, index) => (
                <Button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  variant={index === currentStep ? "primary" : index < currentStep ? "secondary" : "outline"}
                  size="sm"
                >
                  {step.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Hidden on small screens */}
        <div className="hidden md:block mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center cursor-pointer ${
                  index < steps.length - 1 ? 'flex-1' : ''
                }`}
                onClick={() => goToStep(index)}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full 
                             transition-all duration-300 ease-in-out backdrop-blur-sm
                             ${
                    index < currentStep 
                      ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/20'
                      : index === currentStep 
                        ? 'bg-indigo-500 text-white ring-4 ring-indigo-300/20' 
                        : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-300 ${
                      index < currentStep ? 'bg-white' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="text-sm text-white font-light">
                {step.title}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div>
              {React.createElement(stepComponents[steps[currentStep].id], {
                register,
                control,
                errors,
                watch,
                setValue,
                ...(steps[currentStep].id === 'review' ? { navigateToSection } : {})
              })}
            </div>
            
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                size="lg"
              >
                Previous
              </Button>
              
              {currentStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                >
                  Generate Resume
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  variant="primary"
                  size="lg"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 