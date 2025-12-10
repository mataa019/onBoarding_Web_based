import { useState } from 'react'
import { SparklesIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { portfolioApi } from '../../ApiService/portfolioApi'
import type { Skill } from '../../ApiService/types'

interface SkillsSectionProps {
  skills: Skill[]
  isEditing: boolean
  onUpdate: (skills: Skill[]) => void
}

export function SkillsSection({ skills, isEditing, onUpdate }: SkillsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'Technical' })

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setIsLoading(true)
    try {
      const newSkill = await portfolioApi.addSkill({
        name: form.name.trim(),
        category: form.category
      })
      onUpdate([...skills, newSkill])
      setForm({ name: '', category: 'Technical' })
      setShowForm(false)
    } catch (err) {
      console.error('Failed to add skill:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await portfolioApi.deleteSkill(id)
      onUpdate(skills.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to remove skill:', err)
    }
  }

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
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

      {/* Add Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Add Skill</span>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <input type="text" placeholder="Skill name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="Technical">Technical</option>
            <option value="Language">Language</option>
            <option value="Soft Skill">Soft Skill</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={handleAdd} disabled={isLoading || !form.name.trim()}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Adding...' : 'Add Skill'}
          </button>
        </div>
      )}

      {/* Skills by Category */}
      <div className="space-y-4">
        {Object.keys(skillsByCategory).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No skills added yet.</p>
        ) : (
          Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-gray-500 mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="group inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                    {skill.name}
                    {isEditing && (
                      <button onClick={() => handleRemove(skill.id)} className="ml-2 text-blue-400 hover:text-red-600">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
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
