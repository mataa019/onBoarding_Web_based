import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../../components/TextField'
import { TriangleBackground } from '../../components/backgrounds'
import { useAuth } from '../../context/AuthContext'
import type { ApiError } from '../../ApiService/types'

export default function Login() {
  const navigate = useNavigate()
  const { api, setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const LoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Validate fields before sending request
    if (!email.trim() || !password.trim()) {
      setError('Please provide your login details')
      return
    }

    setIsLoading(true)

    try {
      const response = await api.login({ email, password })
      console.log('Login successful:', response.message)
      
      // Fetch user data after login
      const userData = await api.getCurrentUser()
      setUser(userData)
      
      // Redirect to dashboard after successful login
      navigate('/dashboard')
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Login failed. Please try again.')
      console.error('Login error:', apiError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-center px-3 xs:px-4 py-6 sm:py-12 sm:px-6 lg:px-10 bg-blue-600 relative overflow-hidden">
      {/* Triangle Shapes Background */}
      <TriangleBackground />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[95%] xs:max-w-[90%] sm:max-w-md">
          {/* Logo Section */}
          <div className="flex justify-center">
            <img src="/Onboardingflow_logo.png" alt="OnBoard" className="h-16 xs:h-20 sm:h-28 md:h-[140px] w-auto" />
          </div>
          
          <h2 className="mt-3 xs:mt-4 sm:mt-6 text-center text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
          <p className="mt-1.5 xs:mt-2 text-center text-[11px] xs:text-xs sm:text-sm text-blue-100 px-1 xs:px-2">
            Welcome back! Please enter your credentials to access your dashboard.
          </p>
        </div>

        <div className="mt-4 xs:mt-6 sm:mt-8 mx-auto w-full max-w-[95%] xs:max-w-[90%] sm:max-w-md">
          <div className="bg-white py-5 xs:py-6 sm:py-8 px-3 xs:px-4 sm:px-10 shadow-lg rounded-xl">
            <form className="space-y-3 xs:space-y-4 sm:space-y-6" onSubmit={LoginSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-2.5 xs:px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-[11px] xs:text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <TextField
                label="Email address"
                id="email"
                name="email"
                variant="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              {/* Password Field */}
              <TextField
                label="Password"
                id="password"
                name="password"
                variant="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                showPasswordToggle={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-3.5 xs:h-4 w-3.5 xs:w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-1.5 xs:ml-2 block text-[11px] xs:text-xs sm:text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-[11px] xs:text-xs sm:text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 active:text-blue-700">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Sign In Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center items-center rounded-lg border border-transparent bg-blue-600 py-2.5 xs:py-3 sm:py-2.5 px-4 text-xs xs:text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] touch-manipulation"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-1">
                <span className="text-[11px] xs:text-xs sm:text-sm text-gray-600">
                  Don't have an account?{' '}
                  <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 active:text-blue-700">
                    Sign up here
                  </a>
                </span>
              </div>
            </form>
        </div>
      </div>
      </div>
    </div>
  )
}