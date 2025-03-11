'use client'

import { PDFPreview } from '@/utils/generatePDF'
import { useSearchParams } from 'next/navigation'

export default function Preview() {
  const searchParams = useSearchParams()
  const resumeData = JSON.parse(searchParams.get('data') || '{}')
  const template = searchParams.get('template') || 'professional'

  return (
    <div className="h-screen">
      <PDFPreview data={resumeData} template={template} />
    </div>
  )
} 