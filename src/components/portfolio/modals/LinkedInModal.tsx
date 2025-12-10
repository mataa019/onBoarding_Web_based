import { useState } from 'react'
import { ArrowUpTrayIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { Modal } from '../../UIComponents'
import { LinkedInIcon } from '../icons/LinkedInIcon'

interface LinkedInModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (linkedinUrl: string) => void
}

export function LinkedInModal({ isOpen, onClose, onImport }: LinkedInModalProps) {
  const [importMethod, setImportMethod] = useState<'url' | 'file' | 'oauth'>('url')
  const [linkedinUrl, setLinkedinUrl] = useState('')

  const handleImport = () => {
    if (importMethod === 'url' && linkedinUrl) {
      onImport(linkedinUrl)
      alert('LinkedIn URL saved! In production, this would fetch your profile data.')
    }
    onClose()
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        try {
          const data = JSON.parse(reader.result as string)
          console.log('LinkedIn data:', data)
          alert('File imported! Parsing LinkedIn data...')
        } catch {
          alert('Invalid file format. Please upload a valid LinkedIn export JSON.')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import from LinkedIn"
      maxWidth="lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600">
          Choose how you'd like to import your LinkedIn profile data:
        </p>

        {/* Import Method Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          {[
            { id: 'url', label: 'Profile URL' },
            { id: 'file', label: 'Upload Export' },
            { id: 'oauth', label: 'Connect Account' }
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setImportMethod(method.id as 'url' | 'file' | 'oauth')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                importMethod === method.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        {/* URL Method */}
        {importMethod === 'url' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              We'll save your LinkedIn URL and display it on your portfolio.
            </p>
          </div>
        )}

        {/* File Upload Method */}
        {importMethod === 'file' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload LinkedIn Data Export
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <DocumentArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload your LinkedIn data export file</p>
              <p className="text-xs text-gray-500 mb-4">
                Go to LinkedIn → Settings → Get a copy of your data
              </p>
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                Choose File
                <input type="file" accept=".json,.zip" onChange={handleFileImport} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* OAuth Method */}
        {importMethod === 'oauth' && (
          <div className="text-center py-4">
            <LinkedInIcon className="w-16 h-16 text-blue-700 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Connect your LinkedIn account to import your profile data automatically.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">
              <LinkedInIcon className="w-5 h-5 mr-2" />
              Sign in with LinkedIn
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Note: LinkedIn OAuth provides limited access (name, email, photo only).
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          {importMethod !== 'oauth' && (
            <button
              onClick={handleImport}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Import
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
