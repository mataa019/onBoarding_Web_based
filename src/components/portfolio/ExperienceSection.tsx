import { useState } from 'react'
import { BriefcaseIcon, PlusIcon, TrashIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'
import type { Experience } from '../../ApiService/types'
import { useExperiences, useAddExperience, useUpdateExperience, useDeleteExperience } from '../../hooks/usePortfolioQueries'

interface ExperienceSectionProps {
  username?: string
  isEditing: boolean
}

export function ExperienceSection({ username, isEditing }: ExperienceSectionProps) {
  const { data: experiences = [], isLoading: isLoadingList, error } = useExperiences(username)
  const addMutation = useAddExperience()
  const updateMutation = useUpdateExperience()
  const deleteMutation = useDeleteExperience()

  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: 'false',
    description: ''
  })

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Present'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const handleAdd = async () => {
    if (!form.title || !form.company) return
    setIsLoading(true)
    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location || undefined,
        startDate: form.startDate,
        endDate: form.current === 'true' ? undefined : form.endDate,
        current: form.current === 'true',
        description: form.description || undefined,
        order: experiences.length
      }

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: payload })
        setEditingId(null)
      } else {
        await addMutation.mutateAsync(payload)
      }

      setForm({ title: '', company: '', location: '', startDate: '', endDate: '', current: 'false', description: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Failed to save experience:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const startEdit = (exp: Experience) => {
    setEditingId(exp.id)
    setForm({
      title: exp.title,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current ? 'true' : 'false',
      description: exp.description || ''
    })
    setShowForm(true)
  }

  const handleRemove = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
    } catch (err) {
      console.error('Failed to remove experience:', err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-600" />
          Experience
        </h3>
        {isEditing && !showForm && (
          <button onClick={() => setShowForm(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Experience
          </button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{editingId ? 'Edit Experience' : 'Add Experience'}</span>
            <button onClick={() => { setShowForm(false); setEditingId(null) }} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <input type="text" placeholder="Job Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="Company *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" placeholder="Start Date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="date" placeholder="End Date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
              disabled={form.current === 'true'} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
          </div>
          <select value={form.current} onChange={e => setForm({ ...form, current: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="false">Not currently employed</option>
            <option value="true">Currently employed</option>
          </select>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" rows={3} />
          <button onClick={handleAdd} disabled={isLoading || !form.title || !form.company}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : editingId ? 'Update Experience' : 'Add Experience'}
          </button>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No experience added yet.</p>
        ) : (
          experiences.map((exp, index) => (
            <div key={exp.id} className={index !== experiences.length - 1 ? 'border-b border-gray-100 pb-6' : ''}>
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
                    {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(exp)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleRemove(exp.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
