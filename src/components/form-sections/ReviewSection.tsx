import React from 'react'
import { UseFormWatch, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { ResumeData } from '@/types/resume'
import { Trash2, Plus, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'

interface ReviewSectionProps {
  watch: UseFormWatch<ResumeData>
  errors: FieldErrors<ResumeData>
  setValue: UseFormSetValue<ResumeData>
  navigateToSection: (sectionId: 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'customSections' | 'review') => void
}

export default function ReviewSection({ watch, errors, setValue, navigateToSection }: ReviewSectionProps) {
  const personalInfo = watch('personalInfo')
  const experience = watch('experience')
  const education = watch('education')
  const skills = watch('skills')
  const languages = watch('languages')
  const customSections = watch('customSections')

  const formatDate = (date: string) => {
    return date ? new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'Not provided'
  }

  const renderError = (error: any, context?: string) => {
    if (!error) return null
    let message = error.message
    if (context === 'empty-entry') {
      message = `You've added this entry but haven't filled it out yet. Please fill in the required information or remove it.`
    }
    return <p className="text-sm text-red-300">{message}</p>
  }

  const removeEmptySkill = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    console.log('Removing skill at index:', index);
    
    if (index >= 0 && index < (skills || []).length) {
      // Create a shallow copy of the skills array
      const newSkills = [...(skills || [])];
      
      // Remove the skill at the given index
      newSkills.splice(index, 1);
      
      // For skills (optional), we can allow an empty array
      setValue('skills', newSkills);
    }
  }

  const removeEmptyLanguage = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    console.log('Removing language at index:', index);
    
    if (index >= 0 && index < languages.length) {
      // Create a shallow copy of the languages array
      const newLanguages = [...languages];
      
      // Remove the language at the given index
      newLanguages.splice(index, 1);
      
      // For languages (optional), we can allow an empty array
      setValue('languages', newLanguages);
    }
  }

  const removeEmptyCustomSection = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    console.log('Removing custom section at index:', index);
    
    if (index >= 0 && index < (customSections || []).length) {
      // Create a shallow copy of the customSections array
      const newCustomSections = [...(customSections || [])];
      
      // Remove the section at the given index
      newCustomSections.splice(index, 1);
      
      // For customSections (optional), we can allow an empty array
      setValue('customSections', newCustomSections);
    }
  }
  
  const removeEmptyEducation = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    console.log('Removing education at index:', index);
    
    if (index >= 0 && index < education.length) {
      // Create a shallow copy of the education array
      const newEducation = [...education];
      
      // Remove the education at the given index
      newEducation.splice(index, 1);
      
      // For education (optional), we can allow an empty array
      setValue('education', newEducation);
    }
  }

  const addSkill = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToSection('skills');
  }

  const addLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToSection('languages');
  }

  const addCustomSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToSection('customSections');
  }
  
  const addEducation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToSection('education');
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
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 mb-4">Add your work experience to showcase your professional history and achievements.</p>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateToSection('experience');
                  }}
                  variant="primary"
                  size="sm"
                  className="flex items-center space-x-1 transition-all transform hover:translate-x-1"
                >
                  <span>Add Experience</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
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
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 mb-4">If you have formal education, you can add your degrees and qualifications here.</p>
                <Button
                  type="button"
                  onClick={(e) => addEducation(e)}
                  variant="primary"
                  size="sm"
                  className="flex items-center space-x-1 transition-all transform hover:translate-x-1"
                >
                  <span>Add Education</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Display empty education entries with warning */}
              {education.map((edu, index) => {
                if (!edu.degree.trim() || !edu.school.trim() || !edu.location.trim() || !edu.graduationDate.trim()) {
                  return (
                    <div key={`empty-edu-${index}`} className="flex items-center justify-between bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
                      <div>
                        <p className="text-red-300 text-sm">Empty education entry</p>
                        {renderError({ message: '' }, 'empty-entry')}
                      </div>
                      <Button
                        type="button"
                        onClick={(e) => removeEmptyEducation(index, e)}
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Display filled education entries */}
              {education.some(edu => edu.degree.trim() && edu.school.trim() && edu.location.trim() && edu.graduationDate.trim()) && (
                <div className="space-y-6">
                  {education.map((edu, index) => {
                    if (edu.degree.trim() && edu.school.trim() && edu.location.trim() && edu.graduationDate.trim()) {
                      return (
                        <div key={`edu-${index}`} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white font-medium">{edu.degree}</h4>
                              <p className="text-gray-400">{edu.school}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400">{edu.location}</p>
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
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Skills Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Skills</h3>
          {skills.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 mb-4">Consider adding skills to highlight your expertise and make your resume stand out.</p>
                <Button
                  type="button"
                  onClick={(e) => addSkill(e)}
                  variant="primary"
                  size="sm"
                  className="flex items-center space-x-1 transition-all transform hover:translate-x-1"
                >
                  <span>Add Skills</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display empty skill entries with warning */}
              {skills.map((skill, index) => {
                if (!skill.trim()) {
                  return (
                    <div key={`empty-skill-${index}`} className="flex items-center justify-between bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
                      <div>
                        <p className="text-red-300 text-sm">Empty skill entry</p>
                        {renderError({ message: '' }, 'empty-entry')}
                      </div>
                      <Button
                        type="button"
                        onClick={(e) => removeEmptySkill(index, e)}
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Display non-empty skills */}
              {skills.some(skill => skill.trim()) && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => {
                    if (skill.trim()) {
                      return (
                        <span
                          key={`skill-${index}`}
                          className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/5 backdrop-blur-sm text-white border border-white/20"
                        >
                          {skill}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Languages Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Languages</h3>
          {languages.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 mb-4">Consider adding languages to showcase your linguistic abilities.</p>
                <Button
                  type="button"
                  onClick={(e) => addLanguage(e)}
                  variant="primary"
                  size="sm"
                  className="flex items-center space-x-1 transition-all transform hover:translate-x-1"
                >
                  <span>Add Languages</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display empty language entries with warning */}
              {languages.map((lang, index) => {
                if (!lang.language.trim() || !lang.proficiency.trim()) {
                  return (
                    <div key={`empty-lang-${index}`} className="flex items-center justify-between bg-red-400/10 backdrop-blur-sm p-4 rounded-lg border border-red-400/20">
                      <div>
                        <p className="text-red-300 text-sm">Empty language entry</p>
                        {renderError({ message: '' }, 'empty-entry')}
                      </div>
                      <Button
                        type="button"
                        onClick={(e) => removeEmptyLanguage(index, e)}
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Display filled language entries */}
              {languages.some(lang => lang.language.trim() && lang.proficiency.trim()) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {languages.map((lang, index) => {
                    if (lang.language.trim() && lang.proficiency.trim()) {
                      return (
                        <div key={`lang-${index}`} className="space-y-2 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                          <p className="text-white font-medium">{lang.language}</p>
                          <p className="text-gray-400">{lang.proficiency}</p>
                          {errors.languages?.[index] && (
                            <div className="mt-2">
                              {Object.entries(errors.languages[index] || {}).map(([key, error]) => (
                                <div key={key}>{renderError(error)}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          )}
        </div>
          
        {/* Custom Sections Review */}
        <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6">Custom Sections</h3>
          {customSections.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 mb-4">You can add custom sections to showcase additional achievements, certifications, or other relevant information.</p>
                <Button
                  type="button"
                  onClick={(e) => addCustomSection(e)}
                  variant="primary"
                  size="sm"
                  className="flex items-center space-x-1 transition-all transform hover:translate-x-1"
                >
                  <span>Add Custom Section</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Display empty custom sections with warning */}
              {customSections.map((section, index) => {
                if (!section.title.trim() || !section.description.trim()) {
                  return (
                    <div key={`empty-section-${index}`} className="space-y-4 bg-red-400/10 backdrop-blur-sm rounded-lg p-4 border border-red-400/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-300 text-sm">Empty custom section entry</p>
                          {renderError({ message: '' }, 'empty-entry')}
                        </div>
                        <Button
                          type="button"
                          onClick={(e) => removeEmptyCustomSection(index, e)}
                          variant="danger"
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Display filled custom sections */}
              {customSections.map((section, index) => {
                if (section.title.trim() && section.description.trim()) {
                  return (
                    <div key={`section-${index}`} className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
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
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 