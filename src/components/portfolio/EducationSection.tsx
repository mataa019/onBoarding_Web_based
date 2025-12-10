import { useState } from 'react'
import { AcademicCapIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { portfolioApi } from '../../ApiService/portfolioApi'
import type { Education } from '../../ApiService/types'

interface EducationSectionProps {
  education: Education[]
  isEditing: boolean
  onUpdate: (education: Education[]) => void
}

export function EducationSection({ education, isEditing, onUpdate }: EducationSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    school: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    description: ''
  })

  const handleAdd = async () => {
    if (!form.school || !form.degree) return
    setIsLoading(true)
    try {
      const newEdu = await portfolioApi.addEducation({
        school: form.school,
        degree: form.degree,
        field: form.field,
        startYear: form.startYear,
        endYear: form.endYear,
        description: form.description
      })
      onUpdate([...education, newEdu])
      setForm({ school: '', degree: '', field: '', startYear: '', endYear: '', description: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Failed to add education:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await portfolioApi.deleteEducation(id)
      onUpdate(education.filter(e => e.id !== id))
    } catch (err) {
      console.error('Failed to remove education:', err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <AcademicCapIcon className="w-5 h-5 mr-2 text-blue-600" />
          Education
        </h3>
        {isEditing && !showForm && (
          <button onClick={() => setShowForm(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Education
          </button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Add Education</span>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <input type="text" placeholder="School/University *" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="Degree *" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="Field of Study" value={form.field} onChange={e => setForm({ ...form, field: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Start Year" value={form.startYear} onChange={e => setForm({ ...form, startYear: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="text" placeholder="End Year" value={form.endYear} onChange={e => setForm({ ...form, endYear: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} />
          <button onClick={handleAdd} disabled={isLoading || !form.school || !form.degree}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Adding...' : 'Add Education'}
          </button>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-6">
        {education.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No education added yet.</p>
        ) : (
          education.map((edu, index) => (
            <div key={edu.id} className={index !== education.length - 1 ? 'border-b border-gray-100 pb-6' : ''}>
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
                  <button onClick={() => handleRemove(edu.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
