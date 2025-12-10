import { UserCircleIcon } from '@heroicons/react/24/outline'

interface AboutSectionProps {
  summary: string
  isEditing: boolean
  onUpdate: (value: string) => void
}

export function AboutSection({ summary, isEditing, onUpdate }: AboutSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <UserCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
          About
        </h3>
      </div>
      {isEditing ? (
        <textarea
          rows={4}
          value={summary}
          onChange={(e) => onUpdate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Tell your story..."
        />
      ) : (
        <p className="text-gray-600 leading-relaxed">{summary || 'No summary added yet.'}</p>
      )}
    </div>
  )
}
