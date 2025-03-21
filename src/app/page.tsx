'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const features = [
    {
      title: 'Customizable Templates',
      description: 'Create resumes that fit your style and profession.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      title: 'Easy Editing',
      description: 'Edit sections with a simple and intuitive interface.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Export to PDF',
      description: 'Download your resume in a professional format.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ]

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to Resume Generator
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Create a standout resume in minutes with our easy-to-use tool.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-shadow duration-300">
                Get Started
              </button>
            </Link>
            <Link href="/templates">
              <button className="px-8 py-4 bg-white/10 text-white border-2 border-white/20 backdrop-blur-sm rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                View Templates
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-2xl transform transition-all duration-300" />
              <div className="relative p-6 text-white">
                <div className="mb-4 p-3 bg-white/10 rounded-xl inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Design Principles */}
        <div className="mt-24 text-center">
          <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm mb-8">
            Inspired by Dieter Rams' Principles of Good Design
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {['Innovative', 'Useful', 'Aesthetic', 'Understandable'].map((principle, index) => (
              <div
                key={principle}
                className="px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm text-white/90"
              >
                {principle}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
