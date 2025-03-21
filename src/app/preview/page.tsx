'use client'

import { useState, useEffect, Suspense } from 'react'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { ResumeDocument } from '@/utils/generatePDF'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ResumeData, defaultResumeData } from '@/types/resume'

function PreviewContent() {
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('id')
  const template = searchParams.get('template') || 'professional'
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch resume data from API
    const fetchResumeData = async () => {
      console.log('Preview: Fetching resume data, ID:', resumeId);
      try {
        if (!resumeId) {
          console.error('Preview: No resume ID provided');
          throw new Error('Resume ID not provided')
        }
        
        console.log('Preview: Making API request to:', `/api/resume?id=${resumeId}`);
        const response = await fetch(`/api/resume?id=${resumeId}`)
        console.log('Preview: API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Preview: API error response:', errorText);
          throw new Error('Failed to load resume data')
        }
        
        const data = await response.json()
        console.log('Preview: Resume data received:', data);
        setResumeData(data)
      } catch (err) {
        console.error('Preview: Error loading resume:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        // Set loading to false after a short delay to ensure PDF is generated
        console.log('Preview: Setting loading to false after delay');
        setTimeout(() => setIsLoading(false), 1500)
      }
    }
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    fetchResumeData()
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [resumeId])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-600 text-lg font-medium mb-2">Error Loading Resume</h2>
          <p className="text-gray-600">{error}</p>
          <Link href="/create" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Return to Resume Editor
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Generating your resume...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4">
          <div className="flex justify-between items-center">
            <Link
              href="/create"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Editor
            </Link>
            <PDFDownloadLink
              document={<ResumeDocument data={resumeData} template={template} />}
              fileName="resume.pdf"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <span>Download PDF</span>
            </PDFDownloadLink>
          </div>
        </div>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <div className="h-screen">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <ResumeDocument data={resumeData} template={template} />
          </PDFViewer>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <div className="flex-1 mt-16 p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold">Your Resume is Ready!</h2>
            
            {/* Resume Preview Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="space-y-4">
                {resumeData.personalInfo && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resumeData.personalInfo.fullName}
                    </h3>
                    <p className="text-gray-600">{resumeData.personalInfo.email}</p>
                    {resumeData.personalInfo.summary && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {resumeData.personalInfo.summary}
                      </p>
                    )}
                  </div>
                )}
                
                {resumeData.experience && resumeData.experience.length > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Latest Experience</h4>
                    <div>
                      <p className="font-medium text-gray-900">{resumeData.experience[0].title}</p>
                      <p className="text-sm text-gray-600">{resumeData.experience[0].company}</p>
                    </div>
                  </div>
                )}

                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div className="border-t border-gray-200 pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.slice(0, 4).map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {resumeData.skills.length > 4 && (
                        <span className="text-xs text-gray-500">+{resumeData.skills.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-600">
              Your resume has been generated successfully. Click the download button above to save it as a PDF file.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-medium text-indigo-800">Tips:</h3>
                <ul className="mt-2 text-sm text-indigo-600 space-y-2">
                  <li>• Save the PDF to your device</li>
                  <li>• Open it with any PDF viewer</li>
                  <li>• Print or share as needed</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-800">Note:</h3>
                <p className="mt-2 text-sm text-yellow-600">
                  For the best viewing experience on mobile, we recommend downloading the PDF and opening it in your device's PDF viewer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Loading component for Suspense fallback
function LoadingPreview() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600">Loading preview...</p>
      </div>
    </div>
  )
}

export default function Preview() {
  return (
    <div className="h-screen">
      <Suspense fallback={<LoadingPreview />}>
        <PreviewContent />
      </Suspense>
    </div>
  )
} 