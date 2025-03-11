'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-4xl mx-auto text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-6"
        >
          Welcome to Resume Generator
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg mb-10"
        >
          Create a standout resume in minutes with our easy-to-use tool.
        </motion.p>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          <motion.div 
            variants={item}
            className="p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-md border border-white border-opacity-20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
            }}
          >
            <h2 className="text-2xl font-bold mb-2">Customizable Templates</h2>
            <p>Create resumes that fit your style and profession.</p>
          </motion.div>
          <motion.div 
            variants={item}
            className="p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-md border border-white border-opacity-20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
            }}
          >
            <h2 className="text-2xl font-bold mb-2">Easy Editing</h2>
            <p>Edit sections with a simple and intuitive interface.</p>
          </motion.div>
          <motion.div 
            variants={item}
            className="p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-md border border-white border-opacity-20"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)"
            }}
          >
            <h2 className="text-2xl font-bold mb-2">Export to PDF</h2>
            <p>Download your resume in a professional format.</p>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex justify-center gap-x-6"
        >
          <Link
            href="/create"
            className="rounded-md bg-indigo-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/templates"
            className="text-lg font-semibold text-white hover:text-indigo-200 transition-colors duration-300"
          >
            View Templates
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
