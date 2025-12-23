import { useState, useEffect } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { portfolioApi } from '../../ApiService/portfolioApi'

interface AboutSectionProps {
  summary: string
  isEditing: boolean
}

export function AboutSection({ summary, isEditing }: AboutSectionProps) {
  const [currentSummary, setCurrentSummary] = useState(summary || '')

  // Update local state when prop changes
  useEffect(() => {
    setCurrentSummary(summary || '')
  }, [summary])

  const handleUpdate = async (value: string) => {
    setCurrentSummary(value)
    
    // Save to backend immediately
    try {
      await portfolioApi.update({ summary: value })
    } catch (err) {
      console.error('Failed to save summary:', err)
    }
  }
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
          onChange={(e) => handleUpdate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Tell your story..."
        />
      ) : (
        <p className="text-gray-600 leading-relaxed">{currentSummary || 'No summary added yet.'}</p>
      )}
    </div>
  )
}
