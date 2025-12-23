import { useState, useEffect } from 'react'
import {
  PencilIcon,
  ShareIcon,
  CheckCircleIcon,
  XMarkIcon,
  LinkIcon,
  ClipboardIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import { portfolioApi } from '../../ApiService/portfolioApi'
import type { Portfolio as PortfolioType } from '../../ApiService/types'
import {
  PortfolioHeader,
  AboutSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ReferencesSection
} from '../../components/portfolio'

// Default empty portfolio structure
const defaultPortfolio: PortfolioType = {
  id: '',
  userId: '',
  username: '',
  location: null,
  website: null,
  linkedinUrl: null,
  githubUrl: null,
  coverImage: null,
  isPublic: false,
  shareableLink: null,
  createdAt: '',
  updatedAt: '',
  user: {
    firstName: '',
    lastName: '',
    email: '',
    phone: null,
    gender: null,
    dateOfBirth: null,
    country: null,
    city: null,
    avatar: null,
    headline: null,
    summary: null
  },
  experiences: [],
  education: [],
  skills: [],
  references: []
}

export function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioType>(defaultPortfolio)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load portfolio on mount
  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      setIsLoading(true)
      setError('')
      // Get username from URL or use a default/current user
      const username = new URLSearchParams(window.location.search).get('username') || ''
      if (!username) {
        // Fallback to fetching current user's portfolio
        const data = await portfolioApi.get()
        console.log('Fetched current portfolio:', data)
        setPortfolio(data || defaultPortfolio)
      } else {
        const data = await portfolioApi.getByUsername(username)
        console.log('Fetched portfolio by username:', data)
        setPortfolio(data || defaultPortfolio)
      }
    } catch (err) {
      // If loading fails, keep the default empty portfolio so user can still see/edit the layout
      console.error('Failed to load portfolio:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const savePortfolio = async () => {
    if (!portfolio) return
    setIsSaving(true)
    try {
      await portfolioApi.update({
        firstName: portfolio.user.firstName,
        lastName: portfolio.user.lastName,
        headline: portfolio.user.headline,
        summary: portfolio.user.summary,
        location: portfolio.location,
        website: portfolio.website,
        linkedinUrl: portfolio.linkedinUrl,
        githubUrl: portfolio.githubUrl
      })
      setIsEditing(false)
    } catch (err) {
      setError('Failed to save portfolio')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const copyShareLink = () => {
    const link = portfolio.shareableLink || `${window.location.origin}/portfolio/${portfolio.username}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Loading State - show skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">My Portfolio</h1>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-9 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="px-6 pb-6 pt-20">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          {/* Sections Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">My Portfolio</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </button>
            <button
              onClick={() => isEditing ? savePortfolio() : setIsEditing(true)}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                isEditing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditing ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </>
              ) : (
                <>
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Portfolio
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <PortfolioHeader
          isEditing={isEditing}
          username={portfolio.username}
        />

        <AboutSection
          summary={portfolio.user.summary}
          isEditing={isEditing}
        />

        <ExperienceSection
          isEditing={isEditing}
          username={portfolio.username}
        />

        <EducationSection
          isEditing={isEditing}
          username={portfolio.username}
        />

        <SkillsSection
          isEditing={isEditing}
          username={portfolio.username}
        />

        <ReferencesSection
          isEditing={isEditing}
          username={portfolio.username}
        />

        {/* Projects Link */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Projects</h3>
                <p className="text-sm text-gray-500">View all your projects</p>
              </div>
            </div>
            <a href="/projects" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View Projects →
            </a>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Portfolio</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Share your portfolio with others using this link:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={portfolio.shareableLink || `${window.location.origin}/portfolio/${portfolio.username}`}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
              />
              <button
                onClick={copyShareLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                {copied ? (
                  <ClipboardDocumentCheckIcon className="w-5 h-5" />
                ) : (
                  <ClipboardIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {copied && <p className="text-green-600 text-sm mt-2">Link copied to clipboard!</p>}
          </div>
        </div>
      )}
    </div>
  )
}
