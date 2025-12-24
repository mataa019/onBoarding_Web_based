import { useState, useEffect } from 'react'
import { UserGroupIcon, PlusIcon, TrashIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'
import type { Reference } from '../../ApiService/types'

import { portfolioApi } from '../../ApiService/portfolioApi'

interface ReferencesSectionProps {
  references?: Reference[]
  isEditing: boolean
  onRefresh?: () => Promise<void> | void
}

export function ReferencesSection({ references: initialReferences, isEditing, onRefresh }: ReferencesSectionProps) {
  const [references, setReferences] = useState<Reference[]>(initialReferences || [])
  useEffect(() => setReferences(initialReferences || []), [initialReferences])

  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    relationship: ''
  })

  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchReferences = async () => {
    setIsFetching(true)
    setFetchError(null)
    try {
      const data = await portfolioApi.getReferences()
      setReferences(data)
    } catch (err) {
      console.error('Failed to fetch references:', err)
      setFetchError((err as any)?.message || 'Failed to load references')
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => { fetchReferences() }, [])

  const resetForm = () => {
    setForm({ name: '', position: '', company: '', email: '', phone: '', relationship: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleAdd = async () => {
    if (!form.name || !form.company) return
    setIsLoading(true)
    try {
        await portfolioApi.addReference({
        name: form.name,
        position: form.position || '',
        company: form.company,
        email: form.email || '',
        phone: form.phone || undefined,
        relationship: form.relationship || ''
      })
      await fetchReferences()
      if (onRefresh) await onRefresh()
      resetForm()
    } catch (err) {
      console.error('Failed to add reference:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingId || !form.name || !form.company) return
    setIsLoading(true)
    try {
      await portfolioApi.updateReference(editingId, {
        name: form.name,
        position: form.position || '',
        company: form.company,
        email: form.email || '',
        phone: form.phone || undefined,
        relationship: form.relationship || ''
      })
      await fetchReferences()
      if (onRefresh) await onRefresh()
      resetForm()
    } catch (err) {
      console.error('Failed to update reference:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await portfolioApi.deleteReference(id)
      await fetchReferences()
      if (onRefresh) await onRefresh()
    } catch (err) {
      console.error('Failed to remove reference:', err)
    }
  }

  const startEdit = (ref: Reference) => {
    setForm({
      name: ref.name,
      position: ref.position || '',
      company: ref.company,
      email: ref.email || '',
      phone: ref.phone || '',
      relationship: ref.relationship || ''
    })
    setEditingId(ref.id)
    setShowForm(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <UserGroupIcon className="w-5 h-5 mr-2 text-blue-600" />
          References
        </h3>
        {isEditing && !showForm && (
          <button onClick={() => setShowForm(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Reference
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{editingId ? 'Edit Reference' : 'Add Reference'}</span>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <input type="text" placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="Position/Title" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="Company *" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <input type="text" placeholder="Relationship (e.g., Former Manager)" value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <button onClick={editingId ? handleUpdate : handleAdd} disabled={isLoading || !form.name || !form.company}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : editingId ? 'Update Reference' : 'Add Reference'}
          </button>
        </div>
      )}

      {/* References List */}
      <div className="space-y-4">
        {isFetching ? (
          <p className="text-gray-500 text-center py-4">Loading references…</p>
        ) : fetchError ? (
          <p className="text-red-600 text-center py-4">Failed to load references: {fetchError}</p>
        ) : references.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No references added yet.</p>
        ) : (
          references.map(ref => (
            <div key={ref.id} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">{ref.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{ref.name}</h4>
                    <p className="text-gray-600">{ref.position && `${ref.position} at `}{ref.company}</p>
                    {ref.relationship && <p className="text-sm text-blue-600 mt-1">{ref.relationship}</p>}
                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      {ref.email && <p>📧 {ref.email}</p>}
                      {ref.phone && <p>📞 {ref.phone}</p>}
                    </div>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex space-x-1">
                    <button onClick={() => startEdit(ref)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleRemove(ref.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
