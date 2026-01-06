import { useState, useEffect } from 'react'
import { ArrowRightIcon, UserCircleIcon, DocumentTextIcon, FolderIcon, ChartBarIcon, CloudArrowUpIcon, ShieldCheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'Build Your Professional Portfolio',
      subtitle: 'Showcase your skills, experience, and projects in one beautiful, organized profile.',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop',
      cta: 'Get Started'
    },
    {
      title: 'Showcase Your Best Projects',
      subtitle: 'Display your work with images, descriptions, and links to live demos or GitHub repositories.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      cta: 'Start Building'
    },
    {
      title: 'Manage Your Documents Securely',
      subtitle: 'Upload and organize certificates, resumes, and important documents all in one place.',
      image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&h=600&fit=crop',
      cta: 'Upload Documents'
    }
  ]

  const features = [
    {
      name: 'Professional Portfolio',
      description: 'Create a stunning profile with your skills, experience, education, and references.',
      icon: UserCircleIcon
    },
    {
      name: 'Project Showcase',
      description: 'Display your projects with images, technologies used, and GitHub links.',
      icon: FolderIcon
    },
    {
      name: 'Document Management',
      description: 'Upload and organize certificates, resumes, and important documents securely.',
      icon: DocumentTextIcon
    },
    {
      name: 'Progress Dashboard',
      description: 'Track your profile completion and get insights on your portfolio.',
      icon: ChartBarIcon
    },
    {
      name: 'Cloud Storage',
      description: 'All your files are securely stored in the cloud and accessible anywhere.',
      icon: CloudArrowUpIcon
    },
    {
      name: 'Secure & Private',
      description: 'Your data is protected with secure authentication and encryption.',
      icon: ShieldCheckIcon
    }
  ]

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-blue-600 font-semibold text-lg">O</span>
              </div>
              <span className="text-lg font-semibold text-white">
                OnBoard
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/90 hover:text-white text-sm transition-colors">Features</a>
              <a href="#about" className="text-white/90 hover:text-white text-sm transition-colors">About</a>
              <a href="#how-it-works" className="text-white/90 hover:text-white text-sm transition-colors">How It Works</a>
            </div>

            <div className="flex items-center space-x-3">
              <a href="/login" className="text-white/90 hover:text-white text-sm transition-colors">
                Sign In
              </a>
              <a href="/register" className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slideshow */}
      <section className="relative h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex items-center space-x-4">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <span>{slide.cta}</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                    <button className="border border-white/30 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-4">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                About OnBoard
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                OnBoard is a modern portfolio management platform designed to help professionals 
                showcase their skills, projects, and achievements. We make it easy to create 
                a comprehensive profile that stands out to employers and clients.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Whether you're a developer, designer, or any professional, OnBoard helps you 
                organize your career journey — from education and experience to projects and certifications.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">Portfolio</div>
                  <div className="text-sm text-gray-500">Complete Profile Builder</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-gray-900">Projects</div>
                  <div className="text-sm text-gray-500">Showcase Your Work</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-gray-900">Documents</div>
                  <div className="text-sm text-gray-500">Secure Storage</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-gray-900">Dashboard</div>
                  <div className="text-sm text-gray-500">Track Progress</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCircleIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Complete Profile</h4>
                    <p className="text-sm text-gray-500">Add skills, experience, education & references.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Project Gallery</h4>
                    <p className="text-sm text-gray-500">Showcase your best work with images & links.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Document Vault</h4>
                    <p className="text-sm text-gray-500">Store certificates, resumes & important files.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features to streamline your project onboarding and team collaboration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of teams using OnboardFlow to streamline their project onboarding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Start Free Trial
            </button>
            <button className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* App Download Banner */}
      <section className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-xl font-semibold text-white mb-1">
                Get the Mobile App
              </h3>
              <p className="text-gray-400 text-sm">
                Manage your projects on the go.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors border border-gray-700">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </button>
              
              <button className="bg-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors border border-gray-700">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">O</span>
              </div>
              <span className="font-semibold">OnboardFlow</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
            
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              © 2025 OnboardFlow
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}