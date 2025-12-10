import { useState } from 'react'
import {
  PencilIcon,
  ShareIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { usePortfolio } from '../../hooks/usePortfolio'
import {
  PortfolioHeader,
  AboutSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ReferencesSection,
  ProjectsLink,
  ReferenceModal,
  LinkedInModal,
  ShareModal,
  LinkedInIcon
} from '../../components/portfolio'

export function Portfolio() {
  // Custom hook handles all state and API logic
  const {
    portfolio,
    isLoading,
    isSaving,
    error,
    isEditing,
    newSkill,
    showReferenceModal,
    editingReference,
    referenceForm,
    setError,
    setIsEditing,
    setNewSkill,
    setReferenceForm,
    updateField,
    savePortfolio,
    uploadAvatar,
    uploadCover,
    addSkill,
    removeSkill,
    removeExperience,
    removeEducation,
    openAddReference,
    openEditReference,
    saveReference,
    removeReference,
    closeReferenceModal
  } = usePortfolio()

  // Local modal states
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Handle LinkedIn import
  const handleLinkedInImport = (linkedinUrl: string) => {
    updateField('linkedinUrl', linkedinUrl)
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
          portfolio={portfolio}
          isEditing={isEditing}
          onUpdateField={updateField}
          onAvatarUpload={uploadAvatar}
          onCoverUpload={uploadCover}
        />

        <AboutSection
          summary={portfolio.summary}
          isEditing={isEditing}
          onUpdate={(value) => updateField('summary', value)}
        />

        <ExperienceSection
          experiences={portfolio.experiences}
          isEditing={isEditing}
          onRemove={removeExperience}
        />

        <EducationSection
          education={portfolio.education}
          isEditing={isEditing}
          onRemove={removeEducation}
        />

        <SkillsSection
          skills={portfolio.skills}
          isEditing={isEditing}
          newSkill={newSkill}
          onNewSkillChange={setNewSkill}
          onAdd={addSkill}
          onRemove={removeSkill}
        />

        <ReferencesSection
          references={portfolio.references}
          isEditing={isEditing}
          onAdd={openAddReference}
          onEdit={openEditReference}
          onRemove={removeReference}
        />

        <ProjectsLink />
      </div>

      {/* Modals */}
      <ReferenceModal
        isOpen={showReferenceModal}
        editingReference={editingReference}
        form={referenceForm}
        onFormChange={setReferenceForm}
        onSave={saveReference}
        onClose={closeReferenceModal}
      />

      <LinkedInModal
        isOpen={showLinkedInModal}
        onClose={() => setShowLinkedInModal(false)}
        onImport={handleLinkedInImport}
      />

      <ShareModal
        isOpen={showShareModal}
        firstName={portfolio.firstName}
        lastName={portfolio.lastName}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  )
}
