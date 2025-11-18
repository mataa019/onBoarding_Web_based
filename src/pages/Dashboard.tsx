import React from 'react'
import { UsersIcon, CurrencyDollarIcon, ShoppingBagIcon, } from '@heroicons/react/24/outline'
import StatsCard from '../components/StatsCard'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          New Item
        </button>
      </div>

      {/* Stats Cards - Now using reusable component */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="1,234"
          icon={<UsersIcon className="w-6 h-6" />}
          trend={{ value: "+12% from last month", type: "increase" }}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
        />
        
        <StatsCard
          title="Revenue"
          value="$12,345"
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          trend={{ value: "+8% from last month", type: "increase" }}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
        />
        
        <StatsCard
          title="Orders"
          value="856"
          icon={<ShoppingBagIcon className="w-6 h-6" />}
          trend={{ value: "-3% from last month", type: "decrease" }}
          iconBgColor="bg-yellow-100"
          iconTextColor="text-yellow-600"
        />
        
        <StatsCard 
          title="Growth" 
          value="23.5%" 
          icon="🚀"
          trend={{ value: "+5% from last month", type: "increase" }}
          iconBgColor="bg-purple-100"
          iconTextColor="text-purple-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">JM</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">John Mataa created a new project</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium">AS</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Alice Smith completed a task</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-medium">BD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Bob Davis uploaded 3 files</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}