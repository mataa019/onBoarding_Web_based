import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../../components/TextField'
import { useAuth } from '../../context/AuthContext'
import { UserCircleIcon, FolderIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=1600&fit=crop',
    title: 'Build Your Professional Portfolio',
    description: 'Showcase your skills, experience, and achievements in one beautiful profile.'
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=1600&fit=crop',
    title: 'Showcase Your Best Work',
    description: 'Display your projects with images, descriptions, and links to impress employers.'
  },
  {
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=1600&fit=crop',
    title: 'Manage Documents Securely',
    description: 'Upload and organize certificates, resumes, and important files all in one place.'
  }
]

function Register() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const navigate = useNavigate()
  const { api } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }

      // Call register API
      await api.register(payload)

      // Show success dialog
      setShowSuccessDialog(true)
    } catch (err) {
      console.error('Register failed', err)
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    navigate('/login')
  }

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding with Slideshow */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Slide Images */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-blue-600/70" />
          </div>
        ))}

        {/* Content overlay */}
        <div className="relative z-10 p-10 flex flex-col justify-between w-full">
          <div className="flex items-center">
            <img src="/Onboardingflow_logo.png" alt="OnBoard" className="h-[140px] w-auto" />
          </div>
          
          <div>
            <h1 className="text-3xl font-semibold text-white mb-3">
              {slides[currentSlide].title}
            </h1>
            <p className="text-blue-100 leading-relaxed mb-6">
              {slides[currentSlide].description}
            </p>

            {/* Feature Containers */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <UserCircleIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-medium text-white">Portfolio</div>
                <div className="text-xs text-blue-100">Profile Builder</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <FolderIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-medium text-white">Projects</div>
                <div className="text-xs text-blue-100">Showcase Work</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                  <DocumentTextIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-medium text-white">Documents</div>
                <div className="text-xs text-blue-100">Secure Storage</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                  <ChartBarIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-medium text-white">Dashboard</div>
                <div className="text-xs text-blue-100">Track Progress</div>
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-white/30 object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-white/30 object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" className="w-8 h-8 rounded-full border-2 border-white/30 object-cover" alt="" />
            </div>
            <p className="text-blue-100 text-sm">Join professionals building their careers</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-6">
            <img src="/Onboardingflow_logo.png" alt="OnBoard" className="h-[140px] w-auto" />
          </div>

          <div className="text-center mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-1 text-sm">Get started with your free account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <TextField
              label="First Name"
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
            />
              
              <TextField
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Mulenga"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              label="Password"
              name="password"
              variant="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              showPasswordToggle={true}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              variant="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              showPasswordToggle={true}
            />

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Registration Successful!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Your account has been created successfully. Please sign in to continue.
              </p>
              
              <button
                onClick={handleSuccessDialogClose}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Register