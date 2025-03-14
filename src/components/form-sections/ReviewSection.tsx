import React from 'react'
import { UseFormWatch, FieldErrors } from 'react-hook-form'
import { ResumeData } from '@/types/resume'

interface ReviewSectionProps {
  watch: UseFormWatch<ResumeData>
  errors: FieldErrors<ResumeData>
}

export default function ReviewSection({ watch, errors }: ReviewSectionProps) {
  const personalInfo = watch('personalInfo')
  const experience = watch('experience')
  const education = watch('education')
  const skills = watch('skills')
  const languages = watch('languages')
  const customSections = watch('customSections')

  const formatDate = (date: string) => {
    return date ? new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'Not provided'
  }

  const renderError = (error: any) => {
    if (!error) return null
    return <p className="text-sm text-red-300">{error.message}</p>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-light text-white tracking-tight">Review Your Resume</h2>
      <div className="space-y-8">
        {/* Personal Info Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(personalInfo).map(([key, value]) => (
              <div key={key} className="space-y-2 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-gray-400">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                <p className="text-white font-light">{value || 'Not provided'}</p>
                {errors.personalInfo?.[key as keyof typeof personalInfo] && (
                  renderError(errors.personalInfo[key as keyof typeof personalInfo])
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Experience Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Experience</h3>
          {experience.length === 0 ? (
            <div className="bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
              <p className="text-red-300">No experience entries added. Please add at least one experience entry.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{exp.title || 'No title provided'}</h4>
                      <p className="text-gray-400">{exp.company || 'No company provided'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">{exp.location || 'No location provided'}</p>
                      <p className="text-sm text-gray-400">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </p>
                    </div>
                  </div>
                  <p className="text-white font-light whitespace-pre-line">{exp.description || 'No description provided'}</p>
                  {errors.experience?.[index] && (
                    <div className="mt-2 p-2 bg-red-400/10 backdrop-blur-sm rounded-lg border border-red-400/20">
                      {Object.entries(errors.experience[index] || {}).map(([key, error]) => (
                        <div key={key}>{renderError(error)}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Education Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Education</h3>
          {education.length === 0 ? (
            <div className="bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
              <p className="text-red-300">No education entries added. Please add at least one education entry.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{edu.degree || 'No degree provided'}</h4>
                      <p className="text-gray-400">{edu.school || 'No school provided'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">{edu.location || 'No location provided'}</p>
                      <p className="text-sm text-gray-400">{formatDate(edu.graduationDate)}</p>
                    </div>
                  </div>
                  {errors.education?.[index] && (
                    <div className="mt-2 p-2 bg-red-400/10 backdrop-blur-sm rounded-lg border border-red-400/20">
                      {Object.entries(errors.education[index] || {}).map(([key, error]) => (
                        <div key={key}>{renderError(error)}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Skills Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Skills</h3>
          {skills && skills.filter(skill => skill && skill.trim() !== '').length === 0 ? (
            <div className="bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
              <p className="text-red-300">No skills added. Please add at least one skill.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills && skills
                .filter(skill => skill && skill.trim() !== '')
                .map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-white/5 backdrop-blur-sm text-white border border-white/20"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Languages Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Languages</h3>
          {languages.length === 0 ? (
            <div className="bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
              <p className="text-red-300">No languages added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map((lang, index) => (
                <div key={index} className="space-y-2 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-white font-medium">{lang.language || 'No language provided'}</p>
                  <p className="text-gray-400">{lang.proficiency || 'No proficiency level provided'}</p>
                  {errors.languages?.[index] && (
                    <div className="mt-2">
                      {Object.entries(errors.languages[index] || {}).map(([key, error]) => (
                        <div key={key}>{renderError(error)}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
          
        {/* Custom Sections Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Custom Sections</h3>
          {customSections && customSections.filter(section => section && section.title && section.title.trim() !== '' && section.description && section.description.trim() !== '').length === 0 ? (
            <div className="bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
              <p className="text-red-300">No custom sections added yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {customSections && customSections
                .filter(section => section && section.title && section.title.trim() !== '' && section.description && section.description.trim() !== '')
                .map((section, index) => (
                  <div key={index} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="text-white font-medium">{section.title}</h4>
                    <p className="text-white font-light whitespace-pre-line">{section.description}</p>
                    {errors.customSections?.[index] && (
                      <div className="mt-2 p-2 bg-red-400/10 backdrop-blur-sm rounded-lg border border-red-400/20">
                        {Object.entries(errors.customSections[index] || {}).map(([key, error]) => (
                          <div key={key}>{renderError(error)}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 