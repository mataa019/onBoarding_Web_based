import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: string | React.ReactNode
  trend?: {
    value: string
    type: 'increase' | 'decrease'
  }
  iconBgColor?: string
  iconTextColor?: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  iconBgColor = 'bg-blue-100',
  iconTextColor = 'text-blue-600' 
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {typeof icon === 'string' ? (
              <span className={`${iconTextColor} text-xl`}>{icon}</span>
            ) : (
              <div className={iconTextColor}>{icon}</div>
            )}
          </div>
        )}
      </div>
      {trend && (
        <p className={`text-sm mt-2 ${
          trend.type === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.type === 'increase' ? '↑' : '↓'} {trend.value}
        </p>
      )}
    </div>
  )
}