import { useState, useRef, useEffect } from 'react'
import { PlusIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import ProjectCard, { type Project as ProjectCardType } from '../../components/ProjectCard'
import { useAuth } from '../../context/AuthContext'
import { cloudinaryService } from '../../utils/cloudinary'
import { ConfirmDialog } from '../../components/ConfirmDialog'

export function Project() {
  const { api } = useAuth()
  const [projects, setProjects] = useState<ProjectCardType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectCardType | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null; name: string }>({ isOpen: false, id: null, name: '' })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    githubUrl: '',
    tags: ''
  })
  const [images, setImages] = useState<string[]>(['', '', '', ''])
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null])
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setIsLoading(true)
    console.log('Fetching projects...')
    try {
      const data = await api.getProjects()
      console.log('Projects fetched:', data)
      // Transform API Project to ProjectCard Project (images: ProjectImage[] -> string[])
      const transformedProjects: ProjectCardType[] = data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        githubUrl: project.githubLink,
        images: (project.images || []).map(img => img.url),
        tags: (project.tags || []).map(tag => tag.name),
        createdAt: project.createdAt ? new Date(project.createdAt) : new Date()
      }))
      setProjects(transformedProjects)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setError('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Store File object for Cloudinary upload
      const newImageFiles = [...imageFiles]
      newImageFiles[index] = file
      setImageFiles(newImageFiles)

      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImages = [...images]
        newImages[index] = reader.result as string
        setImages(newImages)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages[index] = ''
    setImages(newImages)

    const newImageFiles = [...imageFiles]
    newImageFiles[index] = null
    setImageFiles(newImageFiles)

    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = ''
    }
  }

  const openModal = (project?: ProjectCardType) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        tags: project.tags.join(', ')
      })
      // Load existing images for preview
      setImages([
        project.images[0] || '',
        project.images[1] || '',
        project.images[2] || '',
        project.images[3] || ''
      ])
    } else {
      setEditingProject(null)
      setFormData({ name: '', description: '', githubUrl: '', tags: '' })
      setImages(['', '', '', ''])
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setFormData({ name: '', description: '', githubUrl: '', tags: '' })
    setImages(['', '', '', ''])
    setImageFiles([null, null, null, null])
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsUploading(true)

    try {
      // Check if Cloudinary is configured
      if (!cloudinaryService.isConfigured()) {
        setError('Image upload service is not configured. Please contact administrator.')
        setIsUploading(false)
        return
      }

      // 1. Upload new images to Cloudinary
      const filesToUpload = imageFiles.filter((file): file is File => file !== null)
      let imageUrls: string[] = []

      if (filesToUpload.length > 0) {
        try {
          imageUrls = await cloudinaryService.uploadMultipleImages(filesToUpload, 'projects', true)
        } catch (uploadError) {
          const message = uploadError instanceof Error ? uploadError.message : 'Failed to upload images'
          setError(message)
          setIsUploading(false)
          return
        }
      }

      // 2. Prepare tags
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

      // 3. Create or update project
      if (editingProject) {
        // Keep existing images that weren't replaced
        const existingImages = images
          .map((img, idx) => (imageFiles[idx] === null && img.startsWith('http') ? img : null))
          .filter((img): img is string => img !== null)

        const allImageUrls = [...existingImages, ...imageUrls]

        console.log('Updating project:', editingProject.id, {
          name: formData.name,
          description: formData.description,
          githubUrl: formData.githubUrl,
          tags: tagsArray,
          imageUrls: allImageUrls
        })

        await api.updateProject(editingProject.id, {
          name: formData.name,
          description: formData.description,
          githubUrl: formData.githubUrl,
          tags: tagsArray,
          imageUrls: allImageUrls
        })
      } else {
        console.log('Creating project:', {
          name: formData.name,
          description: formData.description,
          githubUrl: formData.githubUrl,
          tags: tagsArray,
          imageUrls: imageUrls
        })

        await api.createProject({
          name: formData.name,
          description: formData.description,
          githubUrl: formData.githubUrl,
          tags: tagsArray,
          imageUrls: imageUrls
        })
      }

      // 4. Refresh projects list
      await fetchProjects()
      closeModal()
    } catch (err) {
      console.error('Failed to save project:', err)
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setIsUploading(false)
    }
  }

  const deleteProject = async (id: string) => {
    try {
      console.log('Deleting project:', id)
      await api.deleteProject(id)
      console.log('Project deleted successfully')
      await fetchProjects()
    } catch (err) {
      console.error('Failed to delete project:', err)
      setError('Failed to delete project')
    } finally {
      setDeleteConfirm({ isOpen: false, id: null, name: '' })
    }
  }

  const confirmDelete = (project: ProjectCardType) => {
    setDeleteConfirm({ isOpen: true, id: project.id, name: project.name })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm.id && deleteProject(deleteConfirm.id)}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        isDestructive
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Projects</h1>
          <p className="text-gray-500 mt-1">Manage and showcase your portfolio projects</p>
        </div>
        <button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      ) : /* Projects Grid */
      projects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first project</p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openModal}
              onDelete={(id) => {
                const proj = projects.find(p => p.id === id)
                if (proj) confirmDelete(proj)
              }}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="My Awesome Project"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="A brief description of your project..."
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              {/* Project Mockup Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Mockup Images (up to 4)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative">
                      <input
                        type="file"
                        ref={fileInputRefs[index]}
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                      />
                      {images[index] ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={images[index]}
                            alt={`Mockup ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRefs[index].current?.click()}
                            className="absolute bottom-1 right-1 p-1 bg-black/50 text-white rounded text-xs hover:bg-black/70 transition-colors"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRefs[index].current?.click()}
                          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <PhotoIcon className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Image {index + 1}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Click to upload mockup images for your project.</p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="React, TypeScript, Tailwind (comma separated)"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    editingProject ? 'Save Changes' : 'Add Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}