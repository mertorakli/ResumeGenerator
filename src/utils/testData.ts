import { ResumeData } from '@/types/resume'

export const testResumeData: ResumeData = {
  personalInfo: {
    fullName: 'Emily Johnson',
    email: 'emily.johnson@gmail.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Results-driven software engineer with 5 years of experience in full-stack development. Specialized in building scalable web applications using React, Node.js, and cloud technologies. Led multiple successful projects and mentored junior developers.',
  },
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      startDate: '2021-03-01',
      endDate: '',
      description: 'Lead developer for the company\'s flagship product, managing a team of 5 engineers. Improved application performance by 40% through optimization and modernization of the tech stack. Implemented CI/CD pipeline reducing deployment time by 60%.',
    },
    {
      title: 'Software Engineer',
      company: 'InnovateTech',
      location: 'Seattle, WA',
      startDate: '2018-06-01',
      endDate: '2021-02-28',
      description: 'Developed and maintained multiple client-facing applications using React and TypeScript. Collaborated with UX team to implement responsive designs. Reduced bug reports by 30% through implementation of comprehensive testing strategy.',
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      graduationDate: '2018-05-15',
    },
    {
      degree: 'Bachelor of Science in Software Engineering',
      school: 'University of Washington',
      location: 'Seattle, WA',
      graduationDate: '2016-06-20',
    },
  ],
  skills: [
    'React.js',
    'TypeScript',
    'Node.js',
    'Python',
    'AWS',
    'Docker',
    'GraphQL',
    'Agile Development',
  ],
  languages: [
    {
      language: 'English',
      proficiency: 'Native',
    },
    {
      language: 'Spanish',
      proficiency: 'Professional Working',
    },
    {
      language: 'Mandarin',
      proficiency: 'Elementary',
    },
  ],
  customSections: [
    {
      title: 'Certifications',
      description: '• AWS Certified Solutions Architect - Professional\n• Google Cloud Professional Developer\n• Certified Scrum Master (CSM)',
    },
    {
      title: 'Projects & Achievements',
      description: '• Open Source Contributor - Core contributor to React-Query library\n• Speaker at ReactConf 2022 - "Building Scalable React Applications"\n• Patent Pending - Method for Optimizing Cloud Resource Allocation (US Patent App. 123,456)',
    },
  ],
} 