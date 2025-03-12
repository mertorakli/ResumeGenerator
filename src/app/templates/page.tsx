'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'A clean and professional template suitable for most industries.',
    image: '/templates/professional.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A modern two-column design with a sleek color scheme.',
    image: '/templates/creative.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A simple and elegant design that lets your content shine.',
    image: '/templates/minimal.png',
  },
]

export default function Templates() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* Navigation Bar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-white hover:text-white/80 font-medium transition-colors duration-200">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Resume Templates</h1>
            <p className="text-lg text-white/90">
              Choose from our collection of professionally designed templates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="aspect-[3/4] relative mb-4 rounded-xl overflow-hidden bg-black/20">
                    <Image
                      src={template.image}
                      alt={template.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
                  <p className="text-white/80 mb-4">{template.description}</p>
                  <Link
                    href={`/create?template=${template.id}`}
                    className="block w-full text-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    Use Template
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 