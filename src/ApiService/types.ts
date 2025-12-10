// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  accessToken: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  createdAt: string
}

// Error Types
export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// Project Types
export interface ProjectImage {
  id: string
  url: string
  order: number
}

export interface ProjectTag {
  id: string
  name: string
}

export interface Project {
  id: string
  name: string
  description: string
  githubUrl: string
  images: ProjectImage[]
  tags: ProjectTag[]
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  name: string
  description: string
  githubUrl: string
  tags: string[]
  imageUrls?: string[]  // URLs from Cloudinary/S3/etc
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  githubUrl?: string
  tags?: string[]
  imageUrls?: string[]  // URLs from Cloudinary/S3/etc
}

export interface ProjectsResponse {
  projects: Project[]
}

export interface ProjectResponse {
  message: string
  project: Project
}

export interface UploadImagesResponse {
  message: string
  images: ProjectImage[]
}

// ==========================================
// Portfolio Types
// ==========================================

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startYear: string
  endYear: string
  description: string
}

export interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface Reference {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone?: string
  relationship: string
}

export interface Portfolio {
  id: string
  userId: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  avatar: string | null
  coverImage: string | null
  location: string
  email: string
  phone: string | null
  website: string | null
  linkedinUrl: string | null
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  references: Reference[]
  createdAt: string
  updatedAt: string
}

// Portfolio Response Type
export interface PortfolioResponse {
  message: string
  portfolio: Portfolio
}
