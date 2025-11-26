import { useState } from 'react'
import { PlusIcon, LinkIcon, TrashIcon, PencilIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Project {
  id: string
  name: string
  description: string
  githubUrl: string
  imageUrl: string
  tags: string[]
  createdAt: Date
}

// Generate shareable link
const generateShareableLink = (projectId: string) => {
  return `${window.location.origin}/portfolio/project/${projectId}`
}

export function Project() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB',
      githubUrl: 'https://github.com/username/ecommerce',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
      tags: ['React', 'Node.js', 'MongoDB'],
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'A productivity app for managing tasks and projects',
      githubUrl: 'https://github.com/username/taskapp',
      imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
      tags: ['TypeScript', 'React', 'Tailwind'],
      createdAt: new Date()
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    githubUrl: '',
    imageUrl: '',
    tags: ''
  })
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        description: project.description,
        githubUrl: project.githubUrl,
        imageUrl: project.imageUrl,
        tags: project.tags.join(', ')
      })
    } else {
      setEditingProject(null)
      setFormData({ name: '', description: '', githubUrl: '', imageUrl: '', tags: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setFormData({ name: '', description: '', githubUrl: '', imageUrl: '', tags: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

    if (editingProject) {
      setProjects(projects.map(p =>
        p.id === editingProject.id
          ? { ...p, ...formData, tags: tagsArray }
          : p
      ))
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        githubUrl: formData.githubUrl,
        imageUrl: formData.imageUrl,
        tags: tagsArray,
        createdAt: new Date()
      }
      setProjects([...projects, newProject])
    }
    closeModal()
  }

  const deleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  const copyShareLink = (projectId: string) => {
    const link = generateShareableLink(projectId)
    navigator.clipboard.writeText(link)
    setCopiedId(projectId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
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

      {/* Projects Grid */}
      {projects.length === 0 ? (
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
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gray-100">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                    <span className="text-4xl font-bold text-white">{project.name.charAt(0)}</span>
                  </div>
                )}
                {/* Action Buttons Overlay */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => copyShareLink(project.id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-sm"
                    title="Copy share link"
                  >
                    {copiedId === project.id ? (
                      <span className="text-xs text-green-600 font-medium px-1">Copied!</span>
                    ) : (
                      <ShareIcon className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* GitHub Link */}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  View on GitHub
                </a>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openModal(project)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
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

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/image.png"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use a generated placeholder</p>
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}