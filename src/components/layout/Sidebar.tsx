import { useState } from 'react'
import {
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  BellIcon,
  DocumentTextIcon,
  FolderIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Documents', href: '/documents', icon: DocumentTextIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  return (
    <div className={classNames(
      'flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo/Brand Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Dashboard</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">D</span>
          </div>
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
          <a
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              isCollapsed ? 'justify-center' : ''
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon
              className={classNames(
                item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600',
                'flex-shrink-0 w-5 h-5',
                isCollapsed ? '' : 'mr-3'
              )}
            />
            {!isCollapsed && <span>{item.name}</span>}
          </a>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-3">
        <div className={classNames(
          'flex items-center',
          isCollapsed ? 'justify-center' : 'space-x-3'
        )}>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">JM</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">John Mataa</p>
              <p className="text-xs text-gray-500 truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}