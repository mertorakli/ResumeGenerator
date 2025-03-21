import { z } from 'zod'

export const resumeSchema = z.object({
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
    bulletPoints: z.array(z.string()).optional().default([]),
  })).optional().default([]).describe('Add work experience in chronological order'),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    school: z.string().min(1, 'School name is required'),
    location: z.string().min(1, 'Location is required'),
    graduationDate: z.string().min(1, 'Graduation date is required'),
  })).optional().default([]).describe('Add education details if you have formal education to include'),
  skills: z.array(z.string()).optional().default([]).describe('Add skills to highlight your expertise'),
  languages: z.array(z.object({
    language: z.string().min(1, 'Language is required'),
    proficiency: z.string().min(1, 'Proficiency is required'),
  })).optional().default([]).describe('Add languages to showcase your linguistic abilities'),
  customSections: z.array(z.object({
    title: z.string().min(1, 'Section title is required'),
    description: z.string().min(1, 'Description is required'),
  })).optional().default([]).describe('Add custom sections to showcase additional achievements'),
})

export type ResumeData = z.infer<typeof resumeSchema>

export type FieldArrayName = keyof Pick<ResumeData, 'experience' | 'education' | 'skills' | 'languages' | 'customSections'>

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  customSections: [],
} 