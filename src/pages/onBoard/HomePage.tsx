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
              Everything You Need to Shine
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features to build your professional portfolio and manage your career documents.
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in just a few simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Account</h3>
              <p className="text-gray-500 text-sm">Sign up for free and set up your profile with your basic information.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Build Your Portfolio</h3>
              <p className="text-gray-500 text-sm">Add your skills, experience, education, projects, and upload documents.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Share & Succeed</h3>
              <p className="text-gray-500 text-sm">Share your profile with employers or clients and land your next opportunity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join professionals who use OnBoard to showcase their skills and manage their career journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Create Free Account
            </a>
            <a href="/login" className="border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
              Sign In
            </a>
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
              <span className="font-semibold">OnBoard</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="https://github.com/mataa019" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
            
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              © 2026 OnBoard. Developed by{' '}
              <a href="https://github.com/mataa019" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                John Mataa
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}