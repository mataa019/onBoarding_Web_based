import { UserCircleIcon, PlusIcon, PencilIcon, TrashIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import type { Reference } from '../../ApiService/types'

interface ReferencesSectionProps {
  references: Reference[]
  isEditing: boolean
  onAdd: () => void
  onEdit: (ref: Reference) => void
  onRemove: (id: string) => void
}

export function ReferencesSection({
  references,
  isEditing,
  onAdd,
  onEdit,
  onRemove
}: ReferencesSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <UserCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
          References
        </h3>
        {isEditing && (
          <button
            onClick={onAdd}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Reference
          </button>
        )}
      </div>

      <div className="space-y-4">
        {references.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No references added yet.</p>
        ) : (
          references.map((ref, index) => (
            <div key={ref.id} className={`${index !== references.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{ref.name}</h4>
                    <p className="text-gray-600">{ref.position} at {ref.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{ref.relationship}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {ref.email && (
                        <a href={`mailto:${ref.email}`} className="flex items-center hover:text-blue-600">
                          <EnvelopeIcon className="w-4 h-4 mr-1" />
                          {ref.email}
                        </a>
                      )}
                      {ref.phone && (
                        <span className="flex items-center">
                          📞 {ref.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(ref)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(ref.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
