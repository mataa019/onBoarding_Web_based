import { AcademicCapIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import type { Education } from '../../ApiService/types'

interface EducationSectionProps {
  education: Education[]
  isEditing: boolean
  onRemove: (id: string) => void
  onAdd?: () => void
}

export function EducationSection({ education, isEditing, onRemove, onAdd }: EducationSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <AcademicCapIcon className="w-5 h-5 mr-2 text-blue-600" />
          Education
        </h3>
        {isEditing && onAdd && (
          <button
            onClick={onAdd}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Education
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {education.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No education added yet.</p>
        ) : (
          education.map((edu, index) => (
            <div key={edu.id} className={`${index !== education.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{edu.school}</h4>
                    <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                    <p className="text-sm text-gray-500 mt-1">{edu.startYear} - {edu.endYear}</p>
                    {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => onRemove(edu.id)}
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
