import Layout from './components/layout/Layout'

function App() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">$45,678</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Orders</h3>
            <p className="text-2xl font-bold text-gray-900">456</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Growth</h3>
            <p className="text-2xl font-bold text-gray-900">+12%</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-600">
            This is a sample dashboard with a collapsible sidebar. Click the arrow in the sidebar to toggle between expanded and collapsed states.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default App
