import React, { forwardRef } from 'react'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, required, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const inputClasses = `
      block w-full appearance-none rounded-lg border px-3 py-2 placeholder-gray-400 shadow-sm 
      focus:outline-none transition-colors duration-200 sm:text-sm
      ${error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      }
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon ? 'pr-10' : ''}
      ${className}
    `.trim()

    return (
      <div className="space-y-1">
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

TextField.displayName = 'TextField'

export default TextField