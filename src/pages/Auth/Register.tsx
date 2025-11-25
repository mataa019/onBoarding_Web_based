import { useState } from 'react'
import TextField from '../../components/TextField'

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Register:', formData)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-10 flex-col justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">O</span>
          </div>
          <span className="text-lg font-semibold text-white">OnboardFlow</span>
        </div>
        
        <div>
          <h1 className="text-3xl font-semibold text-white mb-3">
            Start your journey with us
          </h1>
          <p className="text-blue-100 leading-relaxed">
            Join thousands of teams using OnboardFlow to streamline project onboarding.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-blue-600"></div>
            <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-blue-600"></div>
            <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-blue-600"></div>
          </div>
          <p className="text-blue-100 text-sm">Trusted by 850+ teams</p>
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
              label="Full Name"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
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