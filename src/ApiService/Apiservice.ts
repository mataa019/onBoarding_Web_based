import { getStoredToken, setStoredToken, removeStoredToken, makeRequest } from './helpers'
import type { LoginRequest, LoginResponse } from './types'

// ApiService Class
export class ApiService {
  private baseURL: string
  private accessToken: string | null

  constructor(baseURL: string = 'http://localhost:3000') {
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

  async logout(): Promise<void> {
    removeStoredToken()
    this.accessToken = null
  }

  getToken(): string | null {
    return this.accessToken
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null
  }
}