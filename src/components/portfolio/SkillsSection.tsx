import { useState } from 'react'
import { SparklesIcon, PlusIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'
import type { Skill } from '../../ApiService/types'

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

import { portfolioApi } from '../../ApiService/portfolioApi'
import { usePortfolioResource } from '../../hooks/usePortfolioResource'
import { ConfirmDialog } from '../ConfirmDialog'

interface SkillsSectionProps {
  isEditing: boolean
  onRefresh?: () => Promise<void> | void
}

export function SkillsSection({ isEditing, onRefresh }: SkillsSectionProps) {
  const { skills, isFetching, error: fetchError, refresh } = usePortfolioResource()

  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null; name: string }>({ isOpen: false, id: null, name: '' })
  const [form, setForm] = useState<{ name: string; level: SkillLevel }>({ name: '', level: 'INTERMEDIATE' })


  const resetForm = () => {
    setForm({ name: '', level: 'INTERMEDIATE' })
    setShowForm(false)
    setEditingId(null)
  }

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setIsLoading(true)
    try {
        await portfolioApi.addSkill({ name: form.name.trim(), level: form.level })
      await refresh()
      if (onRefresh) await onRefresh()
      resetForm()
    } catch (err) {
      console.error('Failed to add skill:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingId || !form.name.trim()) return
    setIsLoading(true)
    try {
      await portfolioApi.updateSkill(editingId, { name: form.name.trim(), level: form.level })
      await refresh()
      if (onRefresh) await onRefresh()
      resetForm()
    } catch (err) {
      console.error('Failed to update skill:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await portfolioApi.deleteSkill(id)
      await refresh()
      if (onRefresh) await onRefresh()
    } catch (err) {
      console.error('Failed to remove skill:', err)
    } finally {
      setDeleteConfirm({ isOpen: false, id: null, name: '' })
    }
  }

  const confirmDelete = (skill: Skill) => {
    setDeleteConfirm({ isOpen: true, id: skill.id, name: skill.name })
  }

  const startEdit = (skill: Skill) => {
    setForm({
      name: skill.name,
      level: (skill.level || 'INTERMEDIATE') as SkillLevel
    })
    setEditingId(skill.id)
    setShowForm(true)
  }

  // Group skills by level
  const skillsByLevel = (skills || []).reduce<Record<string, Skill[]>>((acc, skill) => {
    const level = skill.level || 'Other'
    if (!acc[level]) acc[level] = []
    acc[level].push(skill)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2 text-blue-600" />
          Skills
        </h3>
        {isEditing && !showForm && (
          <button onClick={() => setShowForm(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            <PlusIcon className="w-4 h-4 mr-1" /> Add Skill
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{editingId ? 'Edit Skill' : 'Add Skill'}</span>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <input type="text" placeholder="Skill name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value as SkillLevel })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          <button onClick={editingId ? handleUpdate : handleAdd} disabled={isLoading || !form.name.trim()}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
          </button>
        </div>
      )}

      {/* Skills by Level */}
      <div className="space-y-4">
        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          title="Delete Skill"
          message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => deleteConfirm.id && handleRemove(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
          isDestructive
        />

        {isFetching ? (
          <p className="text-gray-500 text-center py-4">Loading skills…</p>
        ) : fetchError ? (
          <p className="text-red-600 text-center py-4">Failed to load skills: {fetchError}</p>
        ) : Object.keys(skillsByLevel).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No skills added yet.</p>
        ) : (
          Object.entries(skillsByLevel).map(([level, levelSkills]) => (
            <div key={level}>
              <h4 className="text-sm font-medium text-gray-500 mb-2">{level}</h4>
              <div className="flex flex-wrap gap-2">
                {levelSkills.map(skill => (
                  <div key={skill.id} className="group inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    {skill.name}
                    {isEditing && (
                      <>
                        <button onClick={() => startEdit(skill)} className="ml-2 text-blue-400 hover:text-blue-600">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => confirmDelete(skill)} className="ml-1 text-blue-400 hover:text-red-600">
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
