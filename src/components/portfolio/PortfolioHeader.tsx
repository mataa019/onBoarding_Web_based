import { useState } from 'react'
import {
  ArrowUpTrayIcon,
  MapPinIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { cloudinaryService } from '../../utils/cloudinary'
import type { Portfolio } from '../../ApiService/types'

// LinkedIn icon
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

interface PortfolioHeaderProps {
  portfolio: Portfolio
  isEditing: boolean
  onUpdateField: (field: string, value: string) => void
  onAvatarChange: (url: string) => void
  onCoverChange: (url: string) => void
}

export function PortfolioHeader({
  portfolio,
  isEditing,
  onUpdateField,
  onAvatarChange,
  onCoverChange
}: PortfolioHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const { user, headline, location, website, linkedinUrl, coverImage } = portfolio

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await cloudinaryService.uploadImage(file, 'avatars')
      onAvatarChange(url)
    } catch (err) {
      console.error('Failed to upload avatar:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await cloudinaryService.uploadImage(file, 'covers')
      onCoverChange(url)
    } catch (err) {
      console.error('Failed to upload cover:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-400">
        {coverImage && (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
        {isEditing && (
          <label className="absolute bottom-4 right-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-white transition-colors">
            <ArrowUpTrayIcon className="w-4 h-4 inline mr-2" />
            {isUploading ? 'Uploading...' : 'Change Cover'}
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={isUploading} />
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div className="relative">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg" />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-medium shadow-lg">
                {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-md">
                <ArrowUpTrayIcon className="w-5 h-5 text-gray-600" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={isUploading} />
              </label>
            )}
          </div>
        </div>

        {/* Name & Headline */}
        <div className="pt-20">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={user.firstName || ''}
                  onChange={(e) => onUpdateField('firstName', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={user.lastName || ''}
                  onChange={(e) => onUpdateField('lastName', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Last Name"
                />
              </div>
              <input
                type="text"
                value={headline || ''}
                onChange={(e) => onUpdateField('headline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Professional Headline"
              />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600 mt-1">{headline || 'No headline set'}</p>
            </>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {isEditing ? (
                <input
                  type="text"
                  value={location || ''}
                  onChange={(e) => onUpdateField('location', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Location"
                />
              ) : (
                location || 'No location'
              )}
            </span>
            <span className="flex items-center">
              <EnvelopeIcon className="w-4 h-4 mr-1" />
              {user.email}
            </span>
            {(website || isEditing) && (
              <span className="flex items-center">
                <GlobeAltIcon className="w-4 h-4 mr-1" />
                {isEditing ? (
                  <input
                    type="url"
                    value={website || ''}
                    onChange={(e) => onUpdateField('website', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="Website URL"
                  />
                ) : (
                  <a href={website || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {website?.replace('https://', '')}
                  </a>
                )}
              </span>
            )}
            {(linkedinUrl || isEditing) && (
              <span className="flex items-center">
                <LinkedInIcon className="w-4 h-4 mr-1" />
                {isEditing ? (
                  <input
                    type="url"
                    value={linkedinUrl || ''}
                    onChange={(e) => onUpdateField('linkedinUrl', e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="LinkedIn URL"
                  />
                ) : (
                  <a href={linkedinUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    LinkedIn
                  </a>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
