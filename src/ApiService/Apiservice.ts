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
  ProjectResponse,
  Portfolio,
  PortfolioResponse,
  Experience,
  Education,
  Skill
} from './types'

// ApiService Class
export class ApiService {
  private baseURL: string

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://10.36.60.64:3000') {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    // Always get fresh token from storage for each request
    const accessToken = getStoredToken()
    return makeRequest<T>(url, options, accessToken)
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

    return response
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Store token after successful registration
    setStoredToken(response.accessToken)

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
    return getStoredToken()
  }

  isAuthenticated(): boolean {
    return getStoredToken() !== null
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

  // ==========================================
  // 👤 PORTFOLIO
  // ==========================================

  async getPortfolio(): Promise<Portfolio> {
    const response = await this.request<PortfolioResponse>('/portfolio')
    return response.portfolio
  }

  async getPortfolioByUsername(username: string): Promise<Portfolio> {
    const response = await this.request<PortfolioResponse>(`/portfolio/${username}`)
    return response.portfolio
  }

  async updatePortfolio(data: Partial<Portfolio>): Promise<Portfolio> {
    const response = await this.request<PortfolioResponse>('/portfolio', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.portfolio
  }

  // ==========================================
  // 💼 EXPERIENCES
  // ==========================================

  async addExperience(data: Omit<Experience, 'id'>): Promise<Experience> {
    const response = await this.request<{ experience: Experience }>('/portfolio/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.experience
  }

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    const response = await this.request<{ experience: Experience }>(`/portfolio/experiences/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.experience
  }

  async deleteExperience(id: string): Promise<void> {
    await this.request(`/portfolio/experiences/${id}`, {
      method: 'DELETE',
    })
  }

  // ==========================================
  // 🎓 EDUCATION
  // ==========================================

  async addEducation(data: Omit<Education, 'id'>): Promise<Education> {
    const response = await this.request<{ education: Education }>('/portfolio/education', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.education
  }

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    const response = await this.request<{ education: Education }>(`/portfolio/education/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.education
  }

  async deleteEducation(id: string): Promise<void> {
    await this.request(`/portfolio/education/${id}`, {
      method: 'DELETE',
    })
  }

  // ==========================================
  // 🛠️ SKILLS
  // ==========================================

  async addSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
    const response = await this.request<{ skill: Skill }>('/portfolio/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.skill
  }

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    const response = await this.request<{ skill: Skill }>(`/portfolio/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.skill
  }

  async deleteSkill(id: string): Promise<void> {
    await this.request(`/portfolio/skills/${id}`, {
      method: 'DELETE',
    })
  }
}