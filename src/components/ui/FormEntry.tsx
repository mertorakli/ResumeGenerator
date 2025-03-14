import React from 'react'

interface FormEntryProps {
  children: React.ReactNode
  className?: string
}

export default function FormEntry({ children, className = '' }: FormEntryProps) {
  return (
    <div className={`
      p-6 rounded-xl 
      bg-white/5 backdrop-blur-sm 
      border border-white/10 
      shadow-lg shadow-black/5
      hover:border-white/20 
      transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  )
} 