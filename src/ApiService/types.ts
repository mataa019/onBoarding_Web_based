// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  accessToken: string
  refreshToken?: string
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
  gender?: string
  country?: string
  city?: string
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
  name: string
}

export interface Project {
  id: string
  name: string
  description: string
  githubLink: string
  images: ProjectImage[]
  tags: ProjectTag[]
  createdAt?: string
  updatedAt?: string
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
  portfolioId?: string
  title: string
  company: string
  location: string | null
  startDate: string | null
  endDate: string | null
  current: boolean
  description: string | null
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface Education {
  id: string
  portfolioId?: string
  school: string
  degree: string
  field: string | null
  startYear: number | null
  endYear: number | null
  current: boolean
  description: string | null
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface Skill {
  id: string
  portfolioId?: string
  name: string
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  order?: number
  createdAt?: string
  updatedAt?: string
}

export interface Reference {
  id: string
  portfolioId?: string
  name: string
  position: string  // Backend uses 'position' not 'title'
  company: string
  email: string
  phone?: string
  relationship: string
  order?: number
  createdAt?: string
  updatedAt?: string
}

// User info nested in Portfolio response
export interface PortfolioUser {
  firstName: string
  lastName: string
  email: string
  phone: string | null
  gender: string | null
  dateOfBirth: string | null
  country: string | null
  city: string | null
  avatar: string | null
}

export interface Portfolio {
  id: string
  userId: string
  username: string
  headline: string | null  // Now at portfolio level
  summary: string | null   // Now at portfolio level
  location: string | null
  website: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  coverImage: string | null
  isPublic?: boolean
  shareableLink?: string | null
  createdAt?: string
  updatedAt?: string
  user: PortfolioUser  // Nested user object from API (no longer has headline/summary)
  experiences?: Experience[]
  education?: Education[]
  skills?: Skill[]
  references?: Reference[]
}

// Portfolio Update Data Type (what backend expects)
export interface PortfolioUpdateData {
  firstName?: string
  lastName?: string
  headline?: string | null
  summary?: string | null
  location?: string | null
  website?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
  coverImage?: string | null
  avatar?: string | null
}

// Portfolio Response Type
export interface PortfolioResponse {
  message: string
  portfolio: Portfolio
}

// ==========================================
// Document Types
// ==========================================

export interface Document {
  id: string
  name: string
  type: string
  category: string
  fileUrl: string
  fileName: string
  fileSize: string
  uploadedAt: string
  expiryDate?: string | null
}

export interface CreateDocumentRequest {
  name: string
  type: string
  category: string
  fileUrl: string
  fileName: string
  fileSize: string
  expiryDate?: string | null
}

export interface DocumentsResponse {
  documents: Document[]
}

export interface DocumentResponse {
  message: string
  document: Document
}
