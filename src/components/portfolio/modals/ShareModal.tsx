import { useState } from 'react'
import { Modal } from '../../UIComponents'
import { LinkedInIcon } from '../icons/LinkedInIcon'

interface ShareModalProps {
  isOpen: boolean
  firstName: string
  lastName: string
  onClose: () => void
}

export function ShareModal({ isOpen, firstName, lastName, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${window.location.origin}/portfolio/${firstName.toLowerCase()}${lastName.toLowerCase()}`

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Portfolio"
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-gray-600">Share your portfolio with others using this link:</p>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
          />
          <button
            onClick={copyShareLink}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Share on social media:</p>
          <div className="flex space-x-3">
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <LinkedInIcon className="w-5 h-5 mr-2" />
              LinkedIn
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X (Twitter)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
