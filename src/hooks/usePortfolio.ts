import { useState, useEffect, useCallback } from 'react'
import { portfolioApi } from '../ApiService/portfolioApi'
import { cloudinaryService } from '../utils/cloudinary'
import { useAuth } from '../context/AuthContext'
import type { Experience, Education, Skill, Reference } from '../ApiService/types'

// Form data interface for local state
export interface PortfolioFormData {
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
  references: Reference[]
}

// Reference form for modal
export interface ReferenceFormData {
  name: string
  position: string
  company: string
  email: string
  phone: string
  relationship: string
}

const initialPortfolio: PortfolioFormData = {
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
  skills: [],
  references: []
}

const initialReferenceForm: ReferenceFormData = {
  name: '',
  position: '',
  company: '',
  email: '',
  phone: '',
  relationship: ''
}

export function usePortfolio() {
  const { user } = useAuth()

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // UI states
  const [isEditing, setIsEditing] = useState(false)

  // Portfolio data
  const [portfolio, setPortfolio] = useState<PortfolioFormData>(initialPortfolio)

  // Skill form state
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' as Skill['level'] })

  // Reference modal state
  const [showReferenceModal, setShowReferenceModal] = useState(false)
  const [editingReference, setEditingReference] = useState<Reference | null>(null)
  const [referenceForm, setReferenceForm] = useState<ReferenceFormData>(initialReferenceForm)

  // ==========================================
  // FETCH PORTFOLIO
  // ==========================================
  const fetchPortfolio = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await portfolioApi.get()
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
        skills: data.skills || [],
        references: data.references || []
      })
    } catch (err) {
      console.error('Failed to fetch portfolio:', err)
      if (user) {
        setPortfolio({
          ...initialPortfolio,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          avatar: user.avatar || '',
          location: user.city && user.country ? `${user.city}, ${user.country}` : '',
          email: user.email || '',
          phone: user.phone || ''
        })
        setError('')
      } else {
        setError('Failed to load portfolio. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPortfolio()
  }, [fetchPortfolio])

  // ==========================================
  // SAVE PORTFOLIO
  // ==========================================
  const savePortfolio = async () => {
    setIsSaving(true)
    setError('')
    try {
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

  // ==========================================
  // IMAGE UPLOADS
  // ==========================================
  const uploadAvatar = async (file: File) => {
    try {
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setPortfolio(prev => ({ ...prev, avatar: reader.result as string }))
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

  const uploadCover = async (file: File) => {
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPortfolio(prev => ({ ...prev, coverImage: reader.result as string }))
      }
      reader.readAsDataURL(file)

      const url = await cloudinaryService.uploadImage(file, 'covers')
      setPortfolio(prev => ({ ...prev, coverImage: url }))
    } catch (err) {
      console.error('Failed to upload cover:', err)
      setError('Failed to upload image')
    }
  }

  // ==========================================
  // SKILLS CRUD
  // ==========================================
  const addSkill = async () => {
    if (!newSkill.name.trim()) return
    try {
      const skill = await portfolioApi.addSkill({
        name: newSkill.name,
        level: newSkill.level
      })
      setPortfolio(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
      setNewSkill({ name: '', level: 'Intermediate' })
    } catch (err) {
      console.error('Failed to add skill:', err)
      setError('Failed to add skill')
    }
  }

  const removeSkill = async (id: string) => {
    try {
      await portfolioApi.deleteSkill(id)
      setPortfolio(prev => ({
        ...prev,
        skills: prev.skills.filter(s => s.id !== id)
      }))
    } catch (err) {
      console.error('Failed to remove skill:', err)
      setError('Failed to remove skill')
    }
  }

  // ==========================================
  // EXPERIENCE CRUD
  // ==========================================
  const removeExperience = async (id: string) => {
    try {
      await portfolioApi.deleteExperience(id)
      setPortfolio(prev => ({
        ...prev,
        experiences: prev.experiences.filter(e => e.id !== id)
      }))
    } catch (err) {
      console.error('Failed to remove experience:', err)
      setError('Failed to remove experience')
    }
  }

  // ==========================================
  // EDUCATION CRUD
  // ==========================================
  const removeEducation = async (id: string) => {
    try {
      await portfolioApi.deleteEducation(id)
      setPortfolio(prev => ({
        ...prev,
        education: prev.education.filter(e => e.id !== id)
      }))
    } catch (err) {
      console.error('Failed to remove education:', err)
      setError('Failed to remove education')
    }
  }

  // ==========================================
  // REFERENCES CRUD
  // ==========================================
  const openAddReference = () => {
    setEditingReference(null)
    setReferenceForm(initialReferenceForm)
    setShowReferenceModal(true)
  }

  const openEditReference = (ref: Reference) => {
    setEditingReference(ref)
    setReferenceForm({
      name: ref.name,
      position: ref.position,
      company: ref.company,
      email: ref.email,
      phone: ref.phone || '',
      relationship: ref.relationship
    })
    setShowReferenceModal(true)
  }

  const saveReference = async () => {
    try {
      if (editingReference) {
        const updated = await portfolioApi.updateReference(editingReference.id, {
          name: referenceForm.name,
          position: referenceForm.position,
          company: referenceForm.company,
          email: referenceForm.email,
          phone: referenceForm.phone || undefined,
          relationship: referenceForm.relationship
        })
        setPortfolio(prev => ({
          ...prev,
          references: prev.references.map(r => r.id === editingReference.id ? updated : r)
        }))
      } else {
        const newRef = await portfolioApi.addReference({
          name: referenceForm.name,
          position: referenceForm.position,
          company: referenceForm.company,
          email: referenceForm.email,
          phone: referenceForm.phone || undefined,
          relationship: referenceForm.relationship
        })
        setPortfolio(prev => ({
          ...prev,
          references: [...prev.references, newRef]
        }))
      }
      setShowReferenceModal(false)
      setEditingReference(null)
    } catch (err) {
      console.error('Failed to save reference:', err)
      setError('Failed to save reference')
    }
  }

  const removeReference = async (id: string) => {
    try {
      await portfolioApi.deleteReference(id)
      setPortfolio(prev => ({
        ...prev,
        references: prev.references.filter(r => r.id !== id)
      }))
    } catch (err) {
      console.error('Failed to remove reference:', err)
      setError('Failed to remove reference')
    }
  }

  const closeReferenceModal = () => {
    setShowReferenceModal(false)
    setEditingReference(null)
  }

  // ==========================================
  // UPDATE PORTFOLIO FIELD
  // ==========================================
  const updateField = <K extends keyof PortfolioFormData>(field: K, value: PortfolioFormData[K]) => {
    setPortfolio(prev => ({ ...prev, [field]: value }))
  }

  return {
    // State
    portfolio,
    isLoading,
    isSaving,
    error,
    isEditing,
    newSkill,
    showReferenceModal,
    editingReference,
    referenceForm,

    // Setters
    setError,
    setIsEditing,
    setNewSkill,
    setReferenceForm,
    updateField,

    // Actions
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
  }
}
