import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { CogIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const lastScrollTop = useRef(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Get user initials
  const getInitials = () => {
    if (!user) return '?'
    const first = user.firstName?.charAt(0) || ''
    const last = user.lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || '?'
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [navigate])

  const handleSettingsClick = () => {
    setShowProfileDropdown(false)
    navigate('/settings')
  }

  const handleLogoutClick = () => {
    setShowProfileDropdown(false)
    logout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const mainElement = mainRef.current
    if (!mainElement) return

    const handleScroll = () => {
      const scrollTop = mainElement.scrollTop
      
      // Show footer when scrolling down, hide when scrolling up
      if (scrollTop > lastScrollTop.current && scrollTop > 50) {
        setShowFooter(true)
      } else {
        setShowFooter(false)
      }
      
      lastScrollTop.current = scrollTop
    }

    mainElement.addEventListener('scroll', handleScroll)
    return () => mainElement.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-0
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebar}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
            
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 lg:ml-0"></h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Profile Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">{getInitials()}</span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CogIcon className="w-4 h-4 mr-3 text-gray-400" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-red-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

        {/* Footer - appears on scroll down, disappears on scroll up */}
        <footer 
          className={`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 transition-transform duration-300 ${
            showFooter ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Developed by</span>
            <a 
              href="https://github.com/mataa019" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:text-blue-800 hover:underline font-small"
            >
              John Mataa
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}