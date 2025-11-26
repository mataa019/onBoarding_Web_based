import { useState } from 'react'
import { LinkIcon, TrashIcon, PencilIcon, ShareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export interface Project {
  id: string
  name: string
  description: string
  githubUrl: string
  images: string[] // Array of up to 4 mockup images
  tags: string[]
  createdAt: Date
}

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (id: string) => void
}

// Generate shareable link
const generateShareableLink = (projectId: string) => {
  return `${window.location.origin}/portfolio/project/${projectId}`
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = project.images.filter(Boolean)
  const hasMultipleImages = images.length > 1

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const copyShareLink = (projectId: string) => {
    const link = generateShareableLink(projectId)
    navigator.clipboard.writeText(link)
    setCopiedId(projectId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Project Images Carousel */}
      <div className="relative h-48 bg-gray-100 group">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={`${project.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </>
            )}
            {/* Image Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index) }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-4'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
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
            onClick={() => onEdit(project)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit project"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete project"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
