import TextField from '../../components/TextField'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-10 bg-blue-600 relative overflow-hidden">
      {/* Triangle Shapes Background */}
      <div 
        className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 opacity-50"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      <div 
        className="absolute top-1/4 right-0 w-80 h-80 bg-blue-700 opacity-40"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      />
      <div 
        className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-400 opacity-30"
        style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
      />
      <div 
        className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-800 opacity-40"
        style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
      />
      <div 
        className="absolute top-1/2 left-10 w-40 h-40 bg-white opacity-10"
        style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
      />
      <div 
        className="absolute top-20 right-1/4 w-32 h-32 bg-blue-300 opacity-20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-600 font-bold text-2xl">O</span>
            </div>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            Welcome back! Please enter your credentials to access your dashboard.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
            {/* Email Field */}
            <TextField
              label="Email address"
              id="email"
              name="email"
              variant="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
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
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
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