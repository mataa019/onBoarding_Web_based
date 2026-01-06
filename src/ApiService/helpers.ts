import type { ApiError } from "./types"

// Token management
export const getStoredToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

export const setStoredToken = (token: string): void => {
  localStorage.setItem('accessToken', token)
}

export const removeStoredToken = (): void => {
  localStorage.removeItem('accessToken')
}

// Refresh token management
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken')
}

export const setStoredRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token)
}

export const removeStoredRefreshToken = (): void => {
  localStorage.removeItem('refreshToken')
}

// Clear all tokens (used on logout)
export const clearAllTokens = (): void => {
  removeStoredToken()
  removeStoredRefreshToken()
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

// Refresh the access token using the refresh token
export const refreshAccessToken = async (baseURL: string): Promise<string | null> => {
  // If already refreshing, wait for that to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) {
    return null
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        // Refresh failed, clear all tokens
        clearAllTokens()
        return null
      }

      const data = await response.json()
      
      // Store new tokens
      if (data.accessToken) {
        setStoredToken(data.accessToken)
      }
      if (data.refreshToken) {
        setStoredRefreshToken(data.refreshToken)
      }

      return data.accessToken || null
    } catch {
      clearAllTokens()
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// HTTP request helper with automatic token refresh
export const makeRequest = async <T>(
  url: string,
  options: RequestInit = {},
  accessToken: string | null = null,
  baseURL: string = import.meta.env.VITE_API_URL || 'http://10.36.60.64:3000'
): Promise<T> => {
  const makeRequestWithToken = async (token: string | null): Promise<T> => {
    const initialHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const headers = new Headers(initialHeaders)

    // Add Authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw {
        message: data.message || 'An error occurred',
        statusCode: response.status,
        errors: data.errors,
      } as ApiError
    }

    return data as T
  }

  try {
    return await makeRequestWithToken(accessToken)
  } catch (error) {
    const apiError = error as ApiError
    
    // If 401 Unauthorized, try to refresh the token
    if (apiError.statusCode === 401) {
      const newToken = await refreshAccessToken(baseURL)
      
      if (newToken) {
        // Retry the request with new token
        return await makeRequestWithToken(newToken)
      }
      
      // Refresh failed, throw the original error
      throw apiError
    }
    
    // For other errors, throw as-is or wrap network errors
    if (apiError.statusCode) {
      throw apiError
    }
    
    throw {
      message: 'Network error. Please check your connection.',
      statusCode: 0,
    } as ApiError
  }
}
