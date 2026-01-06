import { useState } from 'react'
import { AcademicCapIcon, PlusIcon, TrashIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'
import type { Education } from '../../ApiService/types'

import { portfolioApi } from '../../ApiService/portfolioApi'

import { usePortfolioResource } from '../../hooks/usePortfolioResource'
import { ConfirmDialog } from '../ConfirmDialog'

interface EducationSectionProps {
  isEditing: boolean
  onRefresh?: () => Promise<void> | void
}

export function EducationSection({ isEditing, onRefresh }: EducationSectionProps) {
  const { education, isFetching, error: fetchError, refresh } = usePortfolioResource()

  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null; title: string }>({ isOpen: false, id: null, title: '' })
  const [form, setForm] = useState({
    school: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    current: 'false',
    description: ''
  })

  const handleAdd = async () => {
    if (!form.school || !form.degree) return
    setIsLoading(true)
    try {
      const payload = {
        school: form.school,
        degree: form.degree,
        field: form.field || null,
        startYear: form.startYear ? parseInt(form.startYear) : null,
        endYear: form.current === 'true' ? null : (form.endYear ? parseInt(form.endYear) : null),
        current: form.current === 'true',
        description: form.description || null,
        order: education.length
      }

      if (editingId) {
        await portfolioApi.updateEducation(editingId, payload as Partial<Education>)
        setEditingId(null)
      } else {
        await portfolioApi.addEducation(payload as Omit<Education, 'id'>)
      }

      // Refresh shared resource and parent
      await refresh()
      if (onRefresh) await onRefresh()
      setForm({ school: '', degree: '', field: '', startYear: '', endYear: '', current: 'false', description: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Failed to save education:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await portfolioApi.deleteEducation(id)
      await refresh()
      if (onRefresh) await onRefresh()
    } catch (err) {
      console.error('Failed to remove education:', err)
    } finally {
      setDeleteConfirm({ isOpen: false, id: null, title: '' })
    }
  }

  const confirmDelete = (edu: Education) => {
    setDeleteConfirm({ isOpen: true, id: edu.id, title: edu.school })
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Education"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm.id && handleRemove(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: '' })}
        isDestructive
      />

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
        {isFetching ? (
          <p className="text-gray-500 text-center py-4">Loading education…</p>
        ) : fetchError ? (
          <p className="text-red-600 text-center py-4">Failed to load education: {fetchError}</p>
        ) : education.length === 0 ? (
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
                    <p className="text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <p className="text-sm text-gray-500 mt-1">{edu.startYear || 'N/A'} - {edu.current ? 'Present' : (edu.endYear || 'N/A')}</p>
                    {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
                  </div>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(edu)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(edu)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
