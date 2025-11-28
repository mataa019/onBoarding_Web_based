import { getStoredToken, setStoredToken, removeStoredToken, makeRequest } from './helpers'
import type { 
  LoginRequest, 
  LoginResponse, 
  User, 
  RegisterRequest,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectsResponse,
  ProjectResponse
} from './types'

// ApiService Class
export class ApiService {
  private baseURL: string
  private accessToken: string | null

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://10.36.60.64:3000') {
    this.baseURL = baseURL
    this.accessToken = getStoredToken()
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    return makeRequest<T>(url, options, this.accessToken)
  }

  // ==========================================
  // 🔐 AUTHENTICATION
  // ==========================================

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    // Store token after successful login
    setStoredToken(response.accessToken)
    this.accessToken = response.accessToken

    return response
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Store token after successful registration
    setStoredToken(response.accessToken)
    this.accessToken = response.accessToken

    return response
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      removeStoredToken()
      this.accessToken = null
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    })
  }

  getToken(): string | null {
    return this.accessToken
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null
  }

  // ==========================================
  // 📁 PROJECTS
  // ==========================================

  async getProjects(): Promise<Project[]> {
    const response = await this.request<ProjectsResponse>('/projects')
    return response.projects
  }
  async getProject(id: string): Promise<Project> {
    const response = await this.request<ProjectResponse>(`/projects/${id}`)
    return response.project
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await this.request<ProjectResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.project
  }
  
  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await this.request<ProjectResponse>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.project
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, {
      method: 'DELETE',
    })
  }
}