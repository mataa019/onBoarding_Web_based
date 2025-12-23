import { useState, useEffect } from 'react'
import { AcademicCapIcon, PlusIcon, TrashIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'
import { portfolioApi } from '../../ApiService/portfolioApi'
import type { Education } from '../../ApiService/types'

interface EducationSectionProps {
  isEditing: boolean
  username: string
}

export function EducationSection({ isEditing, username }: EducationSectionProps) {
  const [education, setEducation] = useState<Education[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    school: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    current: 'false',
    description: ''
  })

  // Fetch education on mount
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await portfolioApi.getByUsername(username)
        setEducation(data.education || [])
      } catch (err) {
        console.error('Failed to fetch education:', err)
      }
    }
    if (username) {
      fetchEducation()
    }
  }, [username])

  const handleAdd = async () => {
    if (!form.school || !form.degree) return
    setIsLoading(true)
    try {
      const payload = {
        school: form.school,
        degree: form.degree,
        field: form.field || undefined,
        startYear: form.startYear ? parseInt(form.startYear) : undefined,
        endYear: form.current === 'true' ? undefined : (form.endYear ? parseInt(form.endYear) : undefined),
        current: form.current === 'true',
        description: form.description || undefined,
        order: education.length
      }

      if (editingId) {
        const updated = await portfolioApi.updateEducation(editingId, payload as Partial<Education>)
        setEducation(education.map(e => e.id === editingId ? updated : e))
        setEditingId(null)
      } else {
        const newEdu = await portfolioApi.addEducation(payload as Omit<Education, 'id'>)
        setEducation([...education, newEdu])
      }
      
      setForm({ school: '', degree: '', field: '', startYear: '', endYear: '', current: 'false', description: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Failed to save education:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const startEdit = (edu: Education) => {
    setEditingId(edu.id)
    setForm({
      school: edu.school,
      degree: edu.degree,
      field: edu.field || '',
      startYear: edu.startYear?.toString() || '',
      endYear: edu.endYear?.toString() || '',
      current: edu.current ? 'true' : 'false',
      description: edu.description || ''
    })
    setShowForm(true)
  }

  const handleRemove = async (id: string) => {
    try {
      await portfolioApi.deleteEducation(id)
      setEducation(education.filter(e => e.id !== id))
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
            <span className="font-medium text-gray-700">{editingId ? 'Edit Education' : 'Add Education'}</span>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="text-gray-400 hover:text-gray-600">
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
              disabled={form.current === 'true'} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
          </div>
          <select value={form.current} onChange={e => setForm({ ...form, current: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="false">Not currently studying</option>
            <option value="true">Currently studying</option>
          </select>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} />
          <button onClick={handleAdd} disabled={isLoading || !form.school || !form.degree}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : editingId ? 'Update Education' : 'Add Education'}
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
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(edu)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleRemove(edu.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
