import React from 'react'
import { ArrowRightIcon, CodeBracketIcon, CloudArrowUpIcon, CogIcon, ChartBarIcon, UsersIcon, DevicePhoneIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const features = [
    {
      name: 'GitHub Integration',
      description: 'Seamlessly connect your repositories and start onboarding projects with one click.',
      icon: CodeBracketIcon,
      color: 'from-purple-500 to-purple-700'
    },
    {
      name: 'Smart Analytics',
      description: 'Track project progress, team performance, and onboarding metrics in real-time.',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Team Collaboration',
      description: 'Invite team members, assign roles, and collaborate effectively on project onboarding.',
      icon: UsersIcon,
      color: 'from-green-500 to-green-700'
    },
    {
      name: 'Automated Workflows',
      description: 'Set up custom workflows to automate repetitive onboarding tasks and processes.',
      icon: CogIcon,
      color: 'from-orange-500 to-orange-700'
    },
    {
      name: 'Cloud Deployment',
      description: 'Deploy your projects to cloud platforms directly from the onboarding pipeline.',
      icon: CloudArrowUpIcon,
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      name: 'Mobile Ready',
      description: 'Access your projects and monitor progress from anywhere with our mobile app.',
      icon: DevicePhoneIcon,
      color: 'from-pink-500 to-pink-700'
    }
  ]

  const stats = [
    { label: 'Projects Onboarded', value: '2,400+' },
    { label: 'Active Teams', value: '850+' },
    { label: 'GitHub Repos Connected', value: '12,000+' },
    { label: 'Success Rate', value: '99.2%' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">O</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OnboardFlow
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sign In
              </a>
              <a href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="block text-gray-900">Streamline Your</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Project Onboarding
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
              Connect GitHub repositories, automate workflows, and onboard projects 
              faster than ever before. Built for modern development teams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-blue-400 hover:text-blue-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Everything you need to onboard projects efficiently and scale your development process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.name}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using OnboardFlow to streamline their project onboarding process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              Start Your Free Trial
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* App Download Banner */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                Take OnboardFlow Everywhere
              </h3>
              <p className="text-gray-300 font-medium">
                Download our mobile app and manage your projects on the go.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              
              <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">O</span>
            </div>
            <span className="text-lg font-black">OnboardFlow</span>
          </div>
          <p className="text-gray-400 mb-4">
            © 2025 OnboardFlow. Streamlining project onboarding worldwide.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}