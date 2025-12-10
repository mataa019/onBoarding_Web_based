import {
  ArrowUpTrayIcon,
  MapPinIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { LinkedInIcon } from './icons/LinkedInIcon'
import type { PortfolioFormData } from '../../hooks/usePortfolio'

interface PortfolioHeaderProps {
  portfolio: PortfolioFormData
  isEditing: boolean
  onUpdateField: <K extends keyof PortfolioFormData>(field: K, value: PortfolioFormData[K]) => void
  onAvatarUpload: (file: File) => void
  onCoverUpload: (file: File) => void
}

export function PortfolioHeader({
  portfolio,
  isEditing,
  onUpdateField,
  onAvatarUpload,
  onCoverUpload
}: PortfolioHeaderProps) {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onAvatarUpload(file)
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onCoverUpload(file)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-400">
        {portfolio.coverImage && (
          <img src={portfolio.coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
        {isEditing && (
          <label className="absolute bottom-4 right-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-700 cursor-pointer hover:bg-white transition-colors">
            <ArrowUpTrayIcon className="w-4 h-4 inline mr-2" />
            Change Cover
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div className="relative">
            {portfolio.avatar ? (
              <img
                src={portfolio.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-medium shadow-lg">
                {portfolio.firstName[0]}{portfolio.lastName[0]}
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-md">
                <ArrowUpTrayIcon className="w-5 h-5 text-gray-600" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
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
                  value={portfolio.firstName}
                  onChange={(e) => onUpdateField('firstName', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={portfolio.lastName}
                  onChange={(e) => onUpdateField('lastName', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Last Name"
                />
              </div>
              <input
                type="text"
                value={portfolio.headline}
                onChange={(e) => onUpdateField('headline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Professional Headline"
              />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">
                {portfolio.firstName} {portfolio.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{portfolio.headline}</p>
            </>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {isEditing ? (
                <input
                  type="text"
                  value={portfolio.location}
                  onChange={(e) => onUpdateField('location', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              ) : (
                portfolio.location
              )}
            </span>
            <span className="flex items-center">
              <EnvelopeIcon className="w-4 h-4 mr-1" />
              {portfolio.email}
            </span>
            {portfolio.website && (
              <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                <GlobeAltIcon className="w-4 h-4 mr-1" />
                {portfolio.website.replace('https://', '')}
              </a>
            )}
            {portfolio.linkedinUrl && (
              <a href={portfolio.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                <LinkedInIcon className="w-4 h-4 mr-1" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
