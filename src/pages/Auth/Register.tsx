import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '../../components/TextField'
import { useAuth } from '../../context/AuthContext'

const slides = [
  {
    image: '/slide1.png',
    title: 'Start your journey with us',
    description: 'Join thousands of teams using OnboardFlow to streamline project onboarding.'
  },
  {
    image: '/slide2.png',
    title: 'Collaborate seamlessly',
    description: 'Work together with your team in real-time and boost productivity.'
  },
  {
    image: '/slide3.png',
    title: 'Track your progress',
    description: 'Monitor your projects and stay on top of every milestone.'
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
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">O</span>
            </div>
            <span className="text-lg font-semibold text-white">OnboardFlow</span>
          </div>
          
          <div>
            <h1 className="text-3xl font-semibold text-white mb-3">
              {slides[currentSlide].title}
            </h1>
            <p className="text-blue-100 leading-relaxed">
              {slides[currentSlide].description}
            </p>

            {/* Slide indicators */}
            <div className="flex space-x-2 mt-6">
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
              <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white/30"></div>
              <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white/30"></div>
              <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white/30"></div>
            </div>
            <p className="text-blue-100 text-sm">Trusted by 850+ teams</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-lg">O</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">OnboardFlow</span>
          </div>

          <div className="text-center mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-1 text-sm">Get started with your free account</p>
          </div>

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
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register