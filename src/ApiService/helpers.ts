import { ApiError } from './types'

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

// HTTP request helper
export const makeRequest = async <T>(
  url: string,
  options: RequestInit = {},
  accessToken: string | null = null
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add Authorization header if token exists
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  try {
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
  } catch (error) {
    if ((error as ApiError).statusCode) {
      throw error
    }
    throw {
      message: 'Network error. Please check your connection.',
      statusCode: 0,
    } as ApiError
  }
}
