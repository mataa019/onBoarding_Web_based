import { FunnelIcon } from '@heroicons/react/24/outline'

interface SelectFilterProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  showIcon?: boolean
  className?: string
}

export default function SelectFilter({ 
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
