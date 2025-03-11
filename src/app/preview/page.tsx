'use client'

import { Suspense } from 'react'
import { PDFPreview } from '@/utils/generatePDF'
import { useSearchParams } from 'next/navigation'

function PreviewContent() {
  const searchParams = useSearchParams()
  const resumeData = JSON.parse(searchParams.get('data') || '{}')
  const template = searchParams.get('template') || 'professional'

  return <PDFPreview data={resumeData} template={template} />
}

export default function Preview() {
  return (
    <div className="h-screen">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading preview...</div>}>
        <PreviewContent />
      </Suspense>
    </div>
  )
} 