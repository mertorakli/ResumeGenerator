import React, { ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export default function Button({ 
  children, 
  variant = 'secondary', 
  size = 'md',
  fullWidth = false,
  className = '',
  icon,
  iconPosition = 'left',
  ...props 
}: ButtonProps) {
  // Base styles for all buttons
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 ease-in-out"
  
  // Size variations
  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  }
  
  // Variant styles
  const variantStyles = {
    primary: "text-white bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 border border-indigo-600",
    secondary: "text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20",
    danger: "text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 border border-red-600",
    success: "text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 border border-emerald-600",
    outline: "text-white bg-transparent hover:bg-white/10 border border-white/30"
  }
  
  // Width styles
  const widthStyles = fullWidth ? "w-full" : ""
  
  // Disabled styles
  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"

  // Icon spacing
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className={iconSpacing}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={iconSpacing}>{icon}</span>}
    </button>
  )
} 