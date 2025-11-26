import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

// ============================================
// SearchInput Component
// ============================================
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '' 
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  )
}

// ============================================
// SelectFilter Component
// ============================================
interface SelectFilterProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  showIcon?: boolean
  className?: string
}

export function SelectFilter({ 
  value, 
  onChange, 
  options, 
  showIcon = true,
  className = '' 
}: SelectFilterProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && <FunnelIcon className="w-5 h-5 text-gray-400" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

// ============================================
// FormInput Component (Generic Input)
// ============================================
interface FormInputProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, required, children }: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && '*'}
      </label>
      {children}
    </div>
  )
}
