import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'security', label: 'Security' },
];

export default function Settings() {
  const [tab, setTab] = useState('profile');

  const [profile, setProfile] = useState({ fullname: '', email: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  const [preferences, setPreferences] = useState({ theme: 'system', language: 'en' });

  const [notifications, setNotifications] = useState({ email: true, push: true });

  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Handler for avatar selection
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for profile save
  const saveProfile = () => {
    setErrors({});
    
    if (!profile.fullname?.trim()) {
      setErrors({ fullname: 'Full name is required' });
      return;
    }
    if (!profile.email?.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    toast.success('Profile updated successfully!');
  };

  // Handler for preferences save
  const savePreferences = () => {
    toast.success('Preferences saved successfully!');
  };

  // Handler for notifications save
  const saveNotifications = () => {
    toast.success('Notification settings updated!');
  };

  // Handler for password change
  const changePassword = () => {
    if (!security.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!security.newPassword) {
      toast.error('New password is required');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (security.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    toast.success('Password changed successfully!');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  
  // theme options
  const themeOptions = [
    { key: 'system', label: 'System' },
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your profile, preferences, and account security</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <div className="bg-white rounded-lg shadow p-4 sticky top-6">
            <nav className="space-y-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-3 ${tab === t.key ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-700' : 'hover:bg-gray-50'}`}>
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="md:col-span-9">
          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {avatarPreview || profile.avatar ? (
                        <img src={avatarPreview || profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl text-gray-400">👤</span>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                    >
                      Change Avatar
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={profile.fullname}
                      onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
                      placeholder="Your full name"
                      className={errors.fullname ? 'border-red-500' : ''}
                    />
                    {errors.fullname && <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>}
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="your.email@example.com"
                      type="email"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700">
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
         

          {/* Preferences Tab */}
          {tab === 'preferences' && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-lg font-semibold">Preferences</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Theme</Label>
                  <div className="mt-2 flex items-center gap-2">
                    {themeOptions.map((opt) => (
                      <button key={opt.key} onClick={() => setPreferences({ ...preferences, theme: opt.key })} className={`px-3 py-1 rounded-md border ${preferences.theme === opt.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Language</Label>
                  <select className="w-full mt-2 p-2 border rounded-md" value={preferences.language} onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}>
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={savePreferences} className="bg-indigo-600 hover:bg-indigo-700">
                  Save preferences
                </Button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {tab === 'notifications' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications by email</p>
                  </div>
                  <input type="checkbox" checked={!!notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push notifications</p>
                    <p className="text-sm text-gray-500">Browser & in-app notifications</p>
                  </div>
                  <input type="checkbox" checked={!!notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={saveNotifications} className="bg-indigo-600 hover:bg-indigo-700">
                  Save settings
                </Button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === 'security' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Security</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current password</Label>
                  <Input value={security.currentPassword} onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })} placeholder="Current password" type="password" />
                </div>

                <div>
                  <Label>New password</Label>
                  <Input value={security.newPassword} onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })} placeholder="New password" type="password" />
                </div>

                <div>
                  <Label>Confirm new password</Label>
                  <Input value={security.confirmPassword} onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })} placeholder="Confirm new password" type="password" />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={changePassword} className="bg-indigo-600 hover:bg-indigo-700">
                  Change password
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
