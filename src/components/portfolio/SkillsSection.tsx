import { CodeBracketIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { Skill } from '../../ApiService/types'

const skillLevels: Skill['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const skillLevelColors: Record<Skill['level'], string> = {
  'Beginner': 'bg-gray-200',
  'Intermediate': 'bg-blue-300',
  'Advanced': 'bg-blue-500',
  'Expert': 'bg-blue-700'
}

const skillLevelWidth: Record<Skill['level'], string> = {
  'Beginner': 'w-1/4',
  'Intermediate': 'w-2/4',
  'Advanced': 'w-3/4',
  'Expert': 'w-full'
}

interface SkillsSectionProps {
  skills: Skill[]
  isEditing: boolean
  newSkill: { name: string; level: Skill['level'] }
  onNewSkillChange: (skill: { name: string; level: Skill['level'] }) => void
  onAdd: () => void
  onRemove: (id: string) => void
}

export function SkillsSection({
  skills,
  isEditing,
  newSkill,
  onNewSkillChange,
  onAdd,
  onRemove
}: SkillsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CodeBracketIcon className="w-5 h-5 mr-2 text-blue-600" />
          Skills
        </h3>
      </div>

      {isEditing && (
        <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => onNewSkillChange({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <select
            value={newSkill.level}
            onChange={(e) => onNewSkillChange({ ...newSkill, level: e.target.value as Skill['level'] })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {skillLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.length === 0 ? (
          <p className="text-gray-500 text-center py-4 col-span-2">No skills added yet.</p>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <span className="text-xs text-gray-500">{skill.level}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${skillLevelColors[skill.level]} ${skillLevelWidth[skill.level]} rounded-full transition-all`} />
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => onRemove(skill.id)}
                  className="ml-3 p-1 text-gray-400 hover:text-red-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
