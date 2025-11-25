import React, { forwardRef, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  showPasswordToggle?: boolean
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required, 
    leftIcon, 
    rightIcon, 
    variant = 'text',
    showPasswordToggle = true,
    className = '', 
    type,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    
    // Determine the actual input type
    const isPasswordField = variant === 'password' || type === 'password'
    const actualType = isPasswordField 
      ? (showPassword ? 'text' : 'password')
      : variant !== 'text' ? variant : type || 'text'

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    // Password toggle icon (only for password fields)
    const passwordToggleIcon = isPasswordField && showPasswordToggle ? (
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    ) : null

    // Determine which right icon to show
    const finalRightIcon = passwordToggleIcon || rightIcon

    const inputClasses = `
      block w-full appearance-none rounded-lg border px-3 py-2 placeholder-gray-400 shadow-sm 
      focus:outline-none transition-colors duration-200 sm:text-sm
      ${error 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-900' 
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900'
      }
      ${leftIcon ? 'pl-10' : ''}
      ${finalRightIcon ? 'pr-10' : ''}
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      ${className}
    `.trim()

    return (
      <div className="space-y-1">
        <label 
          htmlFor={props.id || props.name} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={actualType}
            className={inputClasses}
            autoComplete={isPasswordField ? 'current-password' : undefined}
            {...props}
          />
          
          {finalRightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {finalRightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <span>⚠️</span>
            <span>{error}</span>
          </p>
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