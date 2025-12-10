import { useState, useEffect } from 'react'
import {
  UserCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  LinkIcon,
  PencilIcon,
  ShareIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentArrowUpIcon,
  GlobeAltIcon,
  MapPinIcon,
  EnvelopeIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Modal } from '../../components/UIComponents'
import { portfolioApi } from '../../ApiService/portfolioApi'
import { cloudinaryService } from '../../utils/cloudinary'
import { useAuth } from '../../context/AuthContext'
import type { Experience, Education, Skill } from '../../ApiService/types'

// LinkedIn icon component
const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

// Local interface for form state (matches API types but with non-null strings for form handling)
interface PortfolioFormData {
  firstName: string
  lastName: string
  headline: string
  summary: string
  avatar: string
  coverImage: string
  location: string
  email: string
  phone: string
  website: string
  linkedinUrl: string
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
}

const skillLevels: Skill['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const skillLevelColors = {
  'Beginner': 'bg-gray-200',
  'Intermediate': 'bg-blue-300',
  'Advanced': 'bg-blue-500',
  'Expert': 'bg-blue-700'
}

const skillLevelWidth = {
  'Beginner': 'w-1/4',
  'Intermediate': 'w-2/4',
  'Advanced': 'w-3/4',
  'Expert': 'w-full'
}

export function Portfolio() {
  // Get user from AuthContext
  const { user } = useAuth()

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // UI states
  const [isEditing, setIsEditing] = useState(false)
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [linkedinImportMethod, setLinkedinImportMethod] = useState<'url' | 'file' | 'oauth'>('url')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [copied, setCopied] = useState(false)

  // Portfolio data
  const [portfolio, setPortfolio] = useState<PortfolioFormData>({
    firstName: '',
    lastName: '',
    headline: '',
    summary: '',
    avatar: '',
    coverImage: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    linkedinUrl: '',
    experiences: [],
    education: [],
    skills: []
  })

  // Edit states
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as Skill['level'] })

  // Fetch portfolio on mount
  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await portfolioApi.get()
      
      // Map API response (with nested user object) to flat form data
      // User info from API response takes precedence, then AuthContext user
      setPortfolio({
        firstName: data.user?.firstName || user?.firstName || '',
        lastName: data.user?.lastName || user?.lastName || '',
        headline: data.headline || '',
        summary: data.summary || '',
        avatar: data.user?.avatar || user?.avatar || '',
        coverImage: data.coverImage || '',
        location: data.location || (user?.city && user?.country ? `${user.city}, ${user.country}` : ''),
        email: data.user?.email || user?.email || '',
        phone: data.user?.phone || user?.phone || '',
        website: data.website || '',
        linkedinUrl: data.linkedinUrl || '',
        experiences: data.experiences || [],
        education: data.education || [],
        skills: data.skills || []
      })
    } catch (err) {
      console.error('Failed to fetch portfolio:', err)
      // If portfolio doesn't exist yet, pre-fill with user data
      if (user) {
        setPortfolio({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          headline: '',
          summary: '',
          avatar: user.avatar || '',
          coverImage: '',
          location: user.city && user.country ? `${user.city}, ${user.country}` : '',
          email: user.email || '',
          phone: user.phone || '',
          website: '',
          linkedinUrl: '',
          experiences: [],
          education: [],
          skills: []
        })
        setError('')
      } else {
        setError('Failed to load portfolio. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Save all portfolio changes
  const handleSaveChanges = async () => {
    setIsSaving(true)
    setError('')
    try {
      // Only update portfolio-specific fields (user data is managed separately via /auth/me)
      await portfolioApi.update({
        headline: portfolio.headline,
        summary: portfolio.summary,
        coverImage: portfolio.coverImage || null,
        location: portfolio.location,
        website: portfolio.website || null,
        linkedinUrl: portfolio.linkedinUrl || null
      })
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save portfolio:', err)
      setError('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Image uploads with Cloudinary
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
          setPortfolio({ ...portfolio, avatar: reader.result as string })
        }
        reader.readAsDataURL(file)

        // Upload to Cloudinary
        const url = await cloudinaryService.uploadImage(file, 'avatars')
        setPortfolio(prev => ({ ...prev, avatar: url }))
      } catch (err) {
        console.error('Failed to upload avatar:', err)
        setError('Failed to upload image')
      }
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
          setPortfolio({ ...portfolio, coverImage: reader.result as string })
        }
        reader.readAsDataURL(file)

        // Upload to Cloudinary
        const url = await cloudinaryService.uploadImage(file, 'covers')
        setPortfolio(prev => ({ ...prev, coverImage: url }))
      } catch (err) {
        console.error('Failed to upload cover:', err)
        setError('Failed to upload image')
      }
    }
  }

  // Skills CRUD
  const addSkill = async () => {
    if (newSkill.name.trim()) {
      try {
        const skill = await portfolioApi.addSkill({
          name: newSkill.name,
          level: newSkill.level
        })
        setPortfolio({
          ...portfolio,
          skills: [...portfolio.skills, skill]
        })
        setNewSkill({ name: '', level: 'Intermediate' })
      } catch (err) {
        console.error('Failed to add skill:', err)
        setError('Failed to add skill')
      }
    }
  }

  const removeSkill = async (id: string) => {
    try {
      await portfolioApi.deleteSkill(id)
      setPortfolio({
        ...portfolio,
        skills: portfolio.skills.filter((s: Skill) => s.id !== id)
      })
    } catch (err) {
      console.error('Failed to remove skill:', err)
      setError('Failed to remove skill')
    }
  }

  // Experience CRUD
  const removeExperience = async (id: string) => {
    try {
      await portfolioApi.deleteExperience(id)
      setPortfolio({
        ...portfolio,
        experiences: portfolio.experiences.filter((e: Experience) => e.id !== id)
      })
    } catch (err) {
      console.error('Failed to remove experience:', err)
      setError('Failed to remove experience')
    }
  }

  // Education CRUD
  const removeEducation = async (id: string) => {
    try {
      await portfolioApi.deleteEducation(id)
      setPortfolio({
        ...portfolio,
        education: portfolio.education.filter((e: Education) => e.id !== id)
      })
    } catch (err) {
      console.error('Failed to remove education:', err)
      setError('Failed to remove education')
    }
  }

  const handleLinkedInImport = () => {
    // Simulate LinkedIn import
    if (linkedinImportMethod === 'url' && linkedinUrl) {
      // In real implementation, you'd call an API to scrape/fetch LinkedIn data
      alert('LinkedIn URL saved! In production, this would fetch your profile data.')
      setPortfolio({ ...portfolio, linkedinUrl })
    }
    setShowLinkedInModal(false)
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        try {
          // Parse LinkedIn export JSON
          const data = JSON.parse(reader.result as string)
          // Map LinkedIn data to portfolio format
          // This would need to match LinkedIn's export format
          console.log('LinkedIn data:', data)
          alert('File imported! Parsing LinkedIn data...')
        } catch {
          alert('Invalid file format. Please upload a valid LinkedIn export JSON.')
        }
      }
      reader.readAsText(file)
    }
  }

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/portfolio/${portfolio.firstName.toLowerCase()}${portfolio.lastName.toLowerCase()}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Present'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
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
              onClick={() => setShowLinkedInModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <LinkedInIcon className="w-4 h-4 mr-2" />
              Import from LinkedIn
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </button>
            <button
              onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
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
                  Save Changes
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Cover & Profile Header */}
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
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
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
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
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
                      onChange={(e) => setPortfolio({ ...portfolio, firstName: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={portfolio.lastName}
                      onChange={(e) => setPortfolio({ ...portfolio, lastName: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    type="text"
                    value={portfolio.headline}
                    onChange={(e) => setPortfolio({ ...portfolio, headline: e.target.value })}
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
                      onChange={(e) => setPortfolio({ ...portfolio, location: e.target.value })}
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

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
              About
            </h3>
          </div>
          {isEditing ? (
            <textarea
              rows={4}
              value={portfolio.summary}
              onChange={(e) => setPortfolio({ ...portfolio, summary: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Tell your story..."
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">{portfolio.summary}</p>
          )}
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-600" />
              Experience
            </h3>
            {isEditing && (
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Experience
              </button>
            )}
          </div>
          <div className="space-y-6">
            {portfolio.experiences.map((exp: Experience, index: number) => (
              <div key={exp.id} className={`${index !== portfolio.experiences.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BriefcaseIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{exp.title}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)} • {exp.location}
                      </p>
                      <p className="text-gray-600 mt-2">{exp.description}</p>
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2 text-blue-600" />
              Education
            </h3>
            {isEditing && (
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Education
              </button>
            )}
          </div>
          <div className="space-y-6">
            {portfolio.education.map((edu: Education, index: number) => (
              <div key={edu.id} className={`${index !== portfolio.education.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{edu.school}</h4>
                      <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-gray-500 mt-1">{edu.startYear} - {edu.endYear}</p>
                      {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
                    </div>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
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
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Skill name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.skills.map((skill: Skill) => (
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
                    onClick={() => removeSkill(skill.id)}
                    className="ml-3 p-1 text-gray-400 hover:text-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section Link */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CodeBracketIcon className="w-5 h-5 mr-2 text-blue-600" />
                Projects
              </h3>
              <p className="text-sm text-gray-500 mt-1">View your portfolio projects</p>
            </div>
            <a
              href="/projects"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              View Projects
              <LinkIcon className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>

      {/* LinkedIn Import Modal */}
      <Modal
        isOpen={showLinkedInModal}
        onClose={() => setShowLinkedInModal(false)}
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
                onClick={() => setLinkedinImportMethod(method.id as 'url' | 'file' | 'oauth')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  linkedinImportMethod === method.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>

          {/* URL Method */}
          {linkedinImportMethod === 'url' && (
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
          {linkedinImportMethod === 'file' && (
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
          {linkedinImportMethod === 'oauth' && (
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
              onClick={() => setShowLinkedInModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            {linkedinImportMethod !== 'oauth' && (
              <button
                onClick={handleLinkedInImport}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Import
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Portfolio"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Share your portfolio with others using this link:</p>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/portfolio/johnmataa`}
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
    </div>
  )
}
