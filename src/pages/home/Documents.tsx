import { useState } from 'react'
import { 
  PlusIcon, 
  DocumentIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { SearchInput, SelectFilter } from '../../components/FormComponents'
import { Modal, FileUpload, EmptyState, type UploadedFile } from '../../components/UIComponents'

interface Document {
  id: string
  name: string
  type: string
  category: string
  file: string
  fileName: string
  fileSize: string
  uploadedAt: Date
  expiryDate?: string
}

const documentCategories = [
  'All Documents',
  'Identification',
  'Certificates',
  'Licenses',
  'Education',
  'Professional',
  'Other'
]

const documentTypes: Record<string, string[]> = {
  'Identification': ['National ID (NRC)', 'Passport', 'Birth Certificate', 'Voter ID'],
  'Certificates': ['Academic Certificate', 'Professional Certificate', 'Award Certificate', 'Training Certificate'],
  'Licenses': ['Driving License', 'Professional License', 'Business License', 'Trade License'],
  'Education': ['Degree', 'Diploma', 'Transcript', 'Recommendation Letter'],
  'Professional': ['Resume/CV', 'Cover Letter', 'Reference Letter', 'Work Permit'],
  'Other': ['Other Document']
}

export function Document() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'National Registration Card',
      type: 'National ID (NRC)',
      category: 'Identification',
      file: '',
      fileName: 'nrc_front.pdf',
      fileSize: '2.4 MB',
      uploadedAt: new Date('2024-01-15'),
      expiryDate: '2030-01-15'
    },
    {
      id: '2',
      name: 'Driving License',
      type: 'Driving License',
      category: 'Licenses',
      file: '',
      fileName: 'driving_license.pdf',
      fileSize: '1.8 MB',
      uploadedAt: new Date('2024-02-20'),
      expiryDate: '2026-02-20'
    },
    {
      id: '3',
      name: 'Bachelor Degree Certificate',
      type: 'Degree',
      category: 'Education',
      file: '',
      fileName: 'bsc_certificate.pdf',
      fileSize: '3.1 MB',
      uploadedAt: new Date('2024-03-10')
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewDocument, setViewDocument] = useState<Document | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Documents')
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: 'Identification',
    expiryDate: ''
  })
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)

  const openModal = () => {
    setFormData({ name: '', type: '', category: 'Identification', expiryDate: '' })
    setUploadedFile(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({ name: '', type: '', category: 'Identification', expiryDate: '' })
    setUploadedFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedFile) return

    const newDocument: Document = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      category: formData.category,
      file: uploadedFile.file,
      fileName: uploadedFile.fileName,
      fileSize: uploadedFile.fileSize,
      uploadedAt: new Date(),
      expiryDate: formData.expiryDate || undefined
    }
    setDocuments([...documents, newDocument])
    closeModal()
  }

  const deleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id))
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Documents' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Documents</h1>
          <p className="text-gray-500 mt-1">Store and manage your important documents</p>
        </div>
        <button
          onClick={openModal}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search documents..."
            className="flex-1 max-w-md"
          />
          <SelectFilter
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={documentCategories}
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <EmptyState
            icon={<DocumentIcon className="w-16 h-16 text-gray-300" />}
            title="No documents found"
            description={
              searchQuery || selectedCategory !== 'All Documents' 
                ? 'Try adjusting your search or filter' 
                : 'Get started by uploading your first document'
            }
            actionLabel={!searchQuery && selectedCategory === 'All Documents' ? 'Upload Document' : undefined}
            onAction={!searchQuery && selectedCategory === 'All Documents' ? openModal : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <DocumentIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.fileName} • {doc.fileSize}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(doc.uploadedAt)}
                    </td>
                    <td className="px-6 py-4">
                      {doc.expiryDate ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isExpired(doc.expiryDate)
                            ? 'bg-red-100 text-red-700'
                            : isExpiringSoon(doc.expiryDate)
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isExpired(doc.expiryDate) ? 'Expired' : formatDate(doc.expiryDate)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setViewDocument(doc)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View document"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <a
                          href={doc.file}
                          download={doc.fileName}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download document"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete document"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filteredDocuments.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{filteredDocuments.length}</span> of{' '}
              <span className="font-medium text-gray-900">{documents.length}</span> documents
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Upload Document"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File *
            </label>
            <FileUpload
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              uploadedFile={uploadedFile}
              onFileSelect={setUploadedFile}
              onFileRemove={() => setUploadedFile(null)}
              variant="document"
              helpText="PDF, DOC, DOCX, JPG, PNG (max 10MB)"
            />
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., National Registration Card"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, type: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {Object.keys(documentTypes).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select type...</option>
              {documentTypes[formData.category]?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (if applicable)
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!uploadedFile}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload Document
            </button>
          </div>
        </form>
      </Modal>

      {/* View Document Modal */}
      <Modal
        isOpen={!!viewDocument}
        onClose={() => setViewDocument(null)}
        title={viewDocument?.name || ''}
        subtitle={viewDocument?.type}
        maxWidth="2xl"
      >
        {viewDocument && (
          <>
            {viewDocument.file ? (
              viewDocument.fileName.endsWith('.pdf') ? (
                <iframe
                  src={viewDocument.file}
                  className="w-full h-96 rounded-lg border border-gray-200"
                  title={viewDocument.name}
                />
              ) : (
                <img
                  src={viewDocument.file}
                  alt={viewDocument.name}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                <DocumentIcon className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500">Preview not available</p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm font-medium text-gray-900">{viewDocument.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">File Size</p>
                <p className="text-sm font-medium text-gray-900">{viewDocument.fileSize}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Uploaded</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(viewDocument.uploadedAt)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                <p className={`text-sm font-medium ${
                  isExpired(viewDocument.expiryDate) ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {viewDocument.expiryDate ? formatDate(viewDocument.expiryDate) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <a
                href={viewDocument.file}
                download={viewDocument.fileName}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download
              </a>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}