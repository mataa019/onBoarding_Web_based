import { 
  FolderIcon, 
  DocumentTextIcon, 
  EyeIcon, 
  CheckCircleIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  ShareIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

// Profile completion items
const completionItems = [
  { label: 'Basic Info', completed: true },
  { label: 'Profile Photo', completed: true },
  { label: 'Bio', completed: true },
  { label: 'Experience', completed: true },
  { label: 'Education', completed: false },
  { label: 'Skills', completed: true },
  { label: 'Projects', completed: true },
  { label: 'Cover Image', completed: false },
]

// Recent activities
const recentActivities = [
  { 
    action: 'Added new project', 
    detail: 'E-Commerce Dashboard',
    time: '2 hours ago',
    icon: FolderIcon,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    action: 'Uploaded document', 
    detail: 'Driving License',
    time: '1 day ago',
    icon: DocumentTextIcon,
    color: 'bg-green-100 text-green-600'
  },
  { 
    action: 'Updated portfolio', 
    detail: 'Added new skills',
    time: '2 days ago',
    icon: PencilIcon,
    color: 'bg-purple-100 text-purple-600'
  },
  { 
    action: 'Shared portfolio', 
    detail: 'via LinkedIn',
    time: '3 days ago',
    icon: ShareIcon,
    color: 'bg-orange-100 text-orange-600'
  },
]

// Expiring documents
const expiringDocs = [
  { name: 'Driving License', expiresIn: 30, category: 'Licenses' },
  { name: 'Work Permit', expiresIn: 60, category: 'Professional' },
]

// Recent projects preview
const recentProjects = [
  { 
    name: 'E-Commerce Dashboard', 
    description: 'React + TypeScript admin panel',
    image: '',
    status: 'Completed'
  },
  { 
    name: 'Portfolio Website', 
    description: 'Personal portfolio with Next.js',
    image: '',
    status: 'In Progress'
  },
  { 
    name: 'Mobile Banking App', 
    description: 'React Native fintech app',
    image: '',
    status: 'Completed'
  },
]

export default function Dashboard() {
  const completedCount = completionItems.filter(item => item.completed).length
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100)

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/portfolio/johnmataa`)
    alert('Portfolio link copied!')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back, John! 👋</h1>
            <p className="text-blue-100 mt-1">Your portfolio is {completionPercentage}% complete. Keep going!</p>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="/portfolio"
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View Portfolio
            </a>
            <button
              onClick={copyShareLink}
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Projects</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">5</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FolderIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+2 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Documents</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">8</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">2 expiring soon</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">124</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+18% this week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completion</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{completionPercentage}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{completionItems.length - completedCount} items left</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a
                href="/projects"
                className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <PlusIcon className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 mt-2">Add Project</span>
              </a>
              <a
                href="/documents"
                className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 mt-2">Upload Doc</span>
              </a>
              <a
                href="/portfolio"
                className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <PencilIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 mt-2">Edit Portfolio</span>
              </a>
              <button
                onClick={copyShareLink}
                className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <ShareIcon className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 mt-2">Share Link</span>
              </button>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
              <a href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentProjects.map((project, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                    {project.image ? (
                      <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <FolderIcon className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                    project.status === 'Completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Alerts */}
          {expiringDocs.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-yellow-800 flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                  Expiring Soon
                </h2>
                <a href="/documents" className="text-sm text-yellow-700 hover:text-yellow-800 font-medium">
                  Manage Documents
                </a>
              </div>
              <div className="space-y-3">
                {expiringDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-700">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{doc.expiresIn} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h2>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">{completedCount} of {completionItems.length} complete</span>
                <span className="font-medium text-blue-600">{completionPercentage}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {completionItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className={`text-sm ${item.completed ? 'text-gray-500' : 'text-gray-900'}`}>
                    {item.label}
                  </span>
                  {item.completed ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {completionPercentage < 100 && (
              <a
                href="/portfolio"
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Complete Profile
              </a>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.detail}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Tips */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <SparklesIcon className="w-8 h-8 mb-3 text-purple-200" />
            <h3 className="font-semibold mb-2">Pro Tip</h3>
            <p className="text-sm text-purple-100 leading-relaxed">
              Add at least 3 projects with screenshots to make your portfolio stand out to potential employers!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}