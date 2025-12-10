import { CodeBracketIcon, LinkIcon } from '@heroicons/react/24/outline'

export function ProjectsLink() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CodeBracketIcon className="w-5 h-5 mr-2 text-blue-600" />
            Projects
          </h3>
          <p className="text-sm text-gray-500 mt-1">View your portfolio projects</p>
        </div>
        <a
          href="/projects"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          View Projects
          <LinkIcon className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  )
}
