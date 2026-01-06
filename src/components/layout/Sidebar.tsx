import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  ChartBarIcon,
  UserCircleIcon,
  CogIcon,
  BellIcon,
  DocumentTextIcon,
  FolderIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Portfolio', href: '/portfolio', icon: UserCircleIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth()
  
  // Get user initials from first and last name
  const getInitials = () => {
    if (!user) return '?'
    const first = user.firstName?.charAt(0) || ''
    const last = user.lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || '?'
  }

  const getFullName = () => {
    if (!user) return 'Guest'
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'
  }

  return (
    <div className={classNames(
      'flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo/Brand Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <img src="/Onboardingflow_logo.png" alt="OnBoard" className="w-10 h-10 object-contain" />
            <span className="text-lg font-semibold text-gray-900">OnBoard</span>
          </div>
        )}

        {isCollapsed && (
          <img src="/Onboardingflow_logo.png" alt="OnBoard" className="w-10 h-10 object-contain mx-auto" />
        )}
        
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => classNames(
              isActive
                ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              isCollapsed ? 'justify-center' : ''
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon
              className={classNames(
                'flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-600',
                isCollapsed ? '' : 'mr-3'
              )}
            />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-3">
        <div className={classNames(
          'flex items-center',
          isCollapsed ? 'justify-center' : 'space-x-3'
        )}>
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={getFullName()} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">{getInitials()}</span>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{getFullName()}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}