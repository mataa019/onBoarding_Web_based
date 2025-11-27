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
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  githubUrl?: string
  tags?: string[]
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
