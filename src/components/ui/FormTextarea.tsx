import React, { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  icon?: LucideIcon
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ 
  label, 
  error, 
  icon: Icon,
  className = '',
  value,
  ...props 
}, ref) => {
  // Determine if the textarea has a value - improved check for string values
  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">{label}</label>
      <div className={`
        relative rounded-lg transition-all duration-200
        before:absolute before:inset-0 before:rounded-lg before:transition-opacity before:duration-200
        before:bg-gradient-to-r before:from-emerald-500/40 before:via-emerald-500/50 before:to-emerald-500/40
        after:absolute after:inset-0 after:rounded-lg after:transition-opacity after:duration-200
        after:bg-white/10
        ${hasValue ? 'before:opacity-100 after:opacity-100 ring-1 ring-emerald-500/30' : 'before:opacity-0 after:opacity-30'}
      `}>
        {Icon && (
          <div className="absolute left-3 top-3 text-white/40 z-20">
            <Icon size={18} />
          </div>
        )}
        <textarea
          ref={ref}
          className={`
            relative w-full px-4 py-3 rounded-lg z-10
            bg-transparent
            border border-white/10
            focus:outline-none focus:ring-2 
            focus:ring-indigo-500 focus:border-transparent
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${className}
            ${hasValue ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}
          `}
          style={{
            color: hasValue ? '#ffffff' : '#ffffff80',
            fontWeight: hasValue ? '500' : '300',
          }}
          value={value}
          {...props}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
})

FormTextarea.displayName = 'FormTextarea'

export default FormTextarea 