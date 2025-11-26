import { useState } from 'react'
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  LinkIcon,
  PaintBrushIcon,
  CameraIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  avatar: string
  company: string
  jobTitle: string
  location: string
  website: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  projectUpdates: boolean
  documentReminders: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
}

interface IntegrationStatus {
  github: boolean
  google: boolean
  linkedin: boolean
  slack: boolean
}

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: UserCircleIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon }
]

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Mataa',
    email: 'john.mataa@example.com',
    phone: '+260 97 1234567',
    bio: 'Full-stack developer passionate about building great user experiences.',
    avatar: '',
    company: 'OnboardFlow',
    jobTitle: 'Software Developer',
    location: 'Lusaka, Zambia',
    website: 'https://johnmataa.dev'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    documentReminders: true,
    weeklyDigest: false,
    marketingEmails: false
  })

  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    github: true,
    google: false,
    linkedin: false,
    slack: false
  })

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 1000)
  }

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your personal details and public profile</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-medium">
                        {profile.firstName[0]}{profile.lastName[0]}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <CameraIcon className="w-4 h-4 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-gray-500">{profile.jobTitle} at {profile.company}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={profile.jobTitle}
                      onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500 mt-1">Choose how you want to receive updates</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                    { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified when your projects are updated' },
                    { key: 'documentReminders', label: 'Document Reminders', description: 'Receive reminders for expiring documents' },
                    { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of your activity' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive news and promotional content' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <ToggleSwitch
                        enabled={notifications[item.key as keyof NotificationSettings]}
                        onChange={() => setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof NotificationSettings]
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your password and account security</p>
                </div>

                {/* Change Password */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Windows • Chrome</p>
                          <p className="text-xs text-gray-500">Current session • Lusaka, ZM</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-900">Delete Account</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Connected Integrations</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your connected services and applications</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'github', name: 'GitHub', description: 'Import projects from your GitHub repositories', icon: '🐙', color: 'bg-gray-900' },
                    { key: 'google', name: 'Google', description: 'Sign in with Google and sync calendar', icon: '🔵', color: 'bg-blue-500' },
                    { key: 'linkedin', name: 'LinkedIn', description: 'Import profile data and share portfolio', icon: '💼', color: 'bg-blue-700' },
                    { key: 'slack', name: 'Slack', description: 'Receive notifications in Slack', icon: '💬', color: 'bg-purple-600' }
                  ].map((integration) => (
                    <div key={integration.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center text-2xl`}>
                          {integration.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{integration.name}</p>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIntegrations({
                          ...integrations,
                          [integration.key]: !integrations[integration.key as keyof IntegrationStatus]
                        })}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          integrations[integration.key as keyof IntegrationStatus]
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {integrations[integration.key as keyof IntegrationStatus] ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500 mt-1">Customize the look and feel of your dashboard</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    {[
                      { value: 'light', label: 'Light', preview: 'bg-white border-2' },
                      { value: 'dark', label: 'Dark', preview: 'bg-gray-900' },
                      { value: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === option.value
                            ? 'border-blue-600 ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`h-12 rounded-md mb-3 ${option.preview} border border-gray-200`} />
                        <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Note:</span> Dark mode and System theme are coming soon!
                  </p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}