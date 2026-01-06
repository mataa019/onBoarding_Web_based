import { useState, useEffect, useRef, type ReactNode } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const lastScrollTop = useRef(0)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

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
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900"></h1>
            <div className="flex items-center space-x-4">
              {/* You can add header actions here like search, notifications, user menu */}
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
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
              className="ml-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              John Mataa
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}