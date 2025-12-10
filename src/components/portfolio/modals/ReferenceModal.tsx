import { Modal } from '../../UIComponents'
import type { ReferenceFormData } from '../../../hooks/usePortfolio'
import type { Reference } from '../../../ApiService/types'

interface ReferenceModalProps {
  isOpen: boolean
  editingReference: Reference | null
  form: ReferenceFormData
  onFormChange: (form: ReferenceFormData) => void
  onSave: () => void
  onClose: () => void
}

export function ReferenceModal({
  isOpen,
  editingReference,
  form,
  onFormChange,
  onSave,
  onClose
}: ReferenceModalProps) {
  const isValid = form.name && form.position && form.company && form.email && form.relationship

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingReference ? 'Edit Reference' : 'Add Reference'}
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            placeholder="Jane Smith"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
          <input
            type="text"
            value={form.position}
            onChange={(e) => onFormChange({ ...form, position: e.target.value })}
            placeholder="CEO"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => onFormChange({ ...form, company: e.target.value })}
            placeholder="Tech Corp"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onFormChange({ ...form, email: e.target.value })}
            placeholder="jane@techcorp.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => onFormChange({ ...form, phone: e.target.value })}
            placeholder="+1234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
          <input
            type="text"
            value={form.relationship}
            onChange={(e) => onFormChange({ ...form, relationship: e.target.value })}
            placeholder="Former Manager"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!isValid}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingReference ? 'Update' : 'Add'} Reference
          </button>
        </div>
      </div>
    </Modal>
  )
}
