// services/portfolioApi.ts
import { getStoredToken, makeRequest } from './helpers'
import type { Portfolio, Experience, Education, Skill, Reference } from './types'

class PortfolioApiService {
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

  // Refresh token from storage (call after login)
  refreshToken(): void {
    this.accessToken = getStoredToken()
  }

  // ==========================================
  // 👤 PORTFOLIO
  // ==========================================

  async get(): Promise<Portfolio> {
    const response = await this.request<{ portfolio: Portfolio }>('/portfolio')
    return response.portfolio
  }

  async getByUsername(username: string): Promise<Portfolio> {
    const response = await this.request<{ portfolio: Portfolio }>(`/portfolio/${username}`)
    return response.portfolio
  }

  async update(data: Partial<Portfolio>): Promise<Portfolio> {
    const response = await this.request<{ portfolio: Portfolio }>('/portfolio', {
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

  // ==========================================
  // 📋 REFERENCES
  // ==========================================

  async addReference(data: Omit<Reference, 'id'>): Promise<Reference> {
    const response = await this.request<{ reference: Reference }>('/portfolio/references', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.reference
  }

  async updateReference(id: string, data: Partial<Reference>): Promise<Reference> {
    const response = await this.request<{ reference: Reference }>(`/portfolio/references/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.reference
  }

  async deleteReference(id: string): Promise<void> {
    await this.request(`/portfolio/references/${id}`, {
      method: 'DELETE',
    })
  }
}

// Export singleton instance
export const portfolioApi = new PortfolioApiService()
