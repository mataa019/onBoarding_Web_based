import React, { forwardRef, useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import TextField from './TextField'

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  showToggle?: boolean
  leftIcon?: React.ReactNode
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ 
    label = 'Password', 
    error, 
    helperText, 
    required, 
    showToggle = true, 
    leftIcon, 
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const rightIcon = showToggle ? (
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    ) : undefined

    return (
      <TextField
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label={label}
        error={error}
        helperText={helperText}
        required={required}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        autoComplete="current-password"
        {...props}
      />
    )
  }
)

PasswordField.displayName = 'PasswordField'

export default PasswordField