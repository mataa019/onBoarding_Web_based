import { BriefcaseIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Experience } from '../../ApiService/types'

interface ExperienceSectionProps {
  experiences: Experience[]
  isEditing: boolean
  onRemove: (id: string) => void
  onAdd?: () => void
}

export function ExperienceSection({ experiences, isEditing, onRemove, onAdd }: ExperienceSectionProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Present'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-600" />
          Experience
        </h3>
        {isEditing && onAdd && (
          <button
            onClick={onAdd}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Experience
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No experience added yet.</p>
        ) : (
          experiences.map((exp, index) => (
            <div key={exp.id} className={`${index !== experiences.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BriefcaseIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{exp.title}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)} • {exp.location}
                    </p>
                    <p className="text-gray-600 mt-2">{exp.description}</p>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => onRemove(exp.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
