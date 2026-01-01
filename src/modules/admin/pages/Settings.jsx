import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Globe,
  Palette,
  Bell,
  Lock,
  User,
  Mail,
  Shield,
  Moon,
  Sun,
  Monitor,
  Check,
  ChevronRight,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';

const Settings = () => {
  // State management
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    applications: true,
    messages: true,
    updates: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    activityStatus: true
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'account', label: 'Account', icon: User }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: Monitor, description: 'Follows system preference' }
  ];

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Language</h3>
            <p className="text-sm text-gray-500">Select your preferred language</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === lang.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-gray-900">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Auto Save */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Save className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Auto Save</h3>
              <p className="text-sm text-gray-500">Automatically save changes</p>
            </div>
          </div>
          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              autoSave ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <motion.div
              animate={{ x: autoSave ? 28 : 2 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </div>

      {/* Sound */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-purple-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-purple-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sound Effects</h3>
              <p className="text-sm text-gray-500">Play sounds for notifications</p>
            </div>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              soundEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <motion.div
              animate={{ x: soundEnabled ? 28 : 2 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Theme</h3>
            <p className="text-sm text-gray-500">Choose your interface theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <motion.button
                key={themeOption.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTheme(themeOption.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  theme === themeOption.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === themeOption.id ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      theme === themeOption.id ? 'text-indigo-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{themeOption.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{themeOption.description}</p>
                  </div>
                  {theme === themeOption.id && (
                    <Check className="w-5 h-5 text-indigo-600 mt-2" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Color Accent */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Accent Color</h3>
        <div className="flex gap-3">
          {['blue', 'purple', 'pink', 'green', 'orange', 'red'].map((color) => (
            <button
              key={color}
              className={`w-12 h-12 rounded-lg bg-${color}-500 hover:scale-110 transition-transform border-2 border-transparent hover:border-gray-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Manage how you receive notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications.email ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: notifications.email ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Browser push notifications</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications.push ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: notifications.push ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Text message alerts</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications.sms ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: notifications.sms ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Applications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">New Applications</p>
                <p className="text-sm text-gray-500">Notify when you receive applications</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, applications: !notifications.applications })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications.applications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: notifications.applications ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Messages */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Messages</p>
                <p className="text-sm text-gray-500">Direct messages from candidates</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, messages: !notifications.messages })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications.messages ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: notifications.messages ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Updates */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Product Updates</p>
                <p className="text-sm text-gray-500">New features and improvements</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, updates: !notifications.updates })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                notifications.updates ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: notifications.updates ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
            <p className="text-sm text-gray-500">Control your privacy settings</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile Visibility */}
          <div className="py-4 border-b border-gray-100">
            <label className="block font-medium text-gray-900 mb-3">Profile Visibility</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public - Anyone can view</option>
              <option value="private">Private - Only me</option>
              <option value="connections">Connections only</option>
            </select>
          </div>

          {/* Show Email */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Show Email Address</p>
                <p className="text-sm text-gray-500">Display email on public profile</p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy({ ...privacy, showEmail: !privacy.showEmail })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                privacy.showEmail ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: privacy.showEmail ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Show Phone */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Show Phone Number</p>
                <p className="text-sm text-gray-500">Display phone on public profile</p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy({ ...privacy, showPhone: !privacy.showPhone })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                privacy.showPhone ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: privacy.showPhone ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {/* Activity Status */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Activity Status</p>
                <p className="text-sm text-gray-500">Show when you're online</p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy({ ...privacy, activityStatus: !privacy.activityStatus })}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                privacy.activityStatus ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: privacy.activityStatus ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              <span className="font-medium text-gray-900">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              <span className="font-medium text-gray-900">Two-Factor Authentication</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Account Management</h3>
            <p className="text-sm text-gray-500">Manage your account settings</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              <span className="font-medium text-gray-900">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              <span className="font-medium text-gray-900">Email Preferences</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50 transition-all group">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-400 group-hover:text-red-600" />
              <span className="font-medium text-red-600">Delete Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'appearance' && renderAppearanceSettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
              {activeTab === 'privacy' && renderPrivacySettings()}
              {activeTab === 'account' && renderAccountSettings()}
            </motion.div>

            {/* Save Button */}
            <div className="mt-6 flex items-center justify-end gap-4">
              <button className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
