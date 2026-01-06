import { useState, useEffect, useRef, useCallback } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'

interface AboutSectionProps {
  summary?: string
  isEditing: boolean
  onUpdate?: (summary: string) => Promise<void> | void
}

export function AboutSection({ summary, isEditing, onUpdate }: AboutSectionProps) {
  const [currentSummary, setCurrentSummary] = useState(summary || '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setCurrentSummary(summary || '')
  }, [summary])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleChange = useCallback((value: string) => {
    setCurrentSummary(value)
    
    // Debounce API call by 500ms
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (onUpdate) onUpdate(value)
    }, 500)
  }, [onUpdate])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
        <UserCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
        About
      </h3>
      {isEditing ? (
        <textarea
          rows={4}
          value={currentSummary}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Tell your story..."
        />
      ) : (
        <p className="text-gray-600 leading-relaxed">{currentSummary || 'No summary added yet.'}</p>
      )}
    </div>
  )
}
