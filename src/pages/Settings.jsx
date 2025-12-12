import React, { useEffect, useState, useRef } from 'react';
import apiClient from '@/api/client';
import { useSelector } from 'react-redux';
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
  const { user } = useSelector((s) => s.auth || {});
  const [tab, setTab] = useState('profile');

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState({ fullname: '', email: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});

  const [preferences, setPreferences] = useState({ theme: 'system', language: 'en' });
  const [savingPreferences, setSavingPreferences] = useState(false);

  const [notifications, setNotifications] = useState({ email: true, push: true });
  const [savingNotifications, setSavingNotifications] = useState(false);

  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  // Load initial data
  useEffect(() => {
    const load = async () => {
      setLoadingProfile(true);
      try {
        // Try profile endpoint (fallbacks included)
        let res;
        try {
          res = await apiClient.get('/api/users/me');
        } catch (e) {
          res = await apiClient.get('/api/auth/profile');
        }
        const data = res.data || res;
        const payload = data.data || data;
        const fullname = payload.fullname || payload.full_name || payload.name || '';
        setProfile((p) => ({ ...p, fullname, email: payload.email || '', avatar: payload.avatar || '' }));
        setAvatarPreview(payload.avatar || '');

        // preferences may come from profile.settings
        const prefs = payload.settings || payload.preferences || {};
        setPreferences((prev) => ({ ...prev, ...prefs }));

        // notification settings
        const n = prefs.notifications || {};
        setNotifications((prev) => ({ ...prev, ...n }));
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    load();
  }, []);

  // Save profile
  const saveProfile = async () => {
    // simple validation
    const nextErrors = {};
    if (!profile.fullname || profile.fullname.trim().length < 2) nextErrors.fullname = 'Please enter your full name';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email || !emailRe.test(profile.email)) nextErrors.email = 'Please enter a valid email';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSavingProfile(true);
    try {
      // If there is a file selected, convert to base64 and include it
      let payload = { full_name: profile.fullname, email: profile.email };
      if (avatarFile) {
        const toBase64 = (file) => new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
        const base64 = await toBase64(avatarFile);
        payload.avatar = base64;
      } else if (profile.avatar) {
        payload.avatar = profile.avatar;
      }

      // Try to update canonical user endpoint first
      try {
        await apiClient.patch('/api/users/me', payload);
      } catch (e) {
        await apiClient.patch('/api/auth/profile', payload);
      }

      toast.success('Profile updated');
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    setSavingPreferences(true);
    try {
      // Save locally first
      localStorage.setItem('theme', preferences.theme);
      // send to backend
      await apiClient.patch('/api/users/me/settings', { preferences });
      toast.success('Preferences saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save preferences');
    } finally {
      setSavingPreferences(false);
    }
  };

  // Save notification settings
  const saveNotifications = async () => {
    setSavingNotifications(true);
    try {
      await apiClient.patch('/api/users/me/settings', { preferences: { notifications } });
      toast.success('Notification settings saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save notification settings');
    } finally {
      setSavingNotifications(false);
    }
  };

  // Change password
  const changePassword = async () => {
    if (!security.currentPassword || !security.newPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    setSavingPassword(true);
    try {
      await apiClient.post('/api/auth/change-password', {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
      });
      toast.success('Password updated');
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  // avatar select
  const onSelectAvatar = (file) => {
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setProfile((p) => ({ ...p, avatar: '' }));
    if (fileInputRef.current) fileInputRef.current.value = null;
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
              <h2 className="text-lg font-semibold mb-4">Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full name</Label>
                  <Input
                    aria-label="Full name"
                    value={profile.fullname}
                    onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
                    placeholder="Your full name"
                    className={errors.fullname ? 'border-red-500' : ''}
                  />
                  {errors.fullname && <p className="text-red-600 text-sm mt-1">{errors.fullname}</p>}
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    aria-label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="mt-4">
                <Label>Avatar</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No avatar</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      aria-label="Upload avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => onSelectAvatar(e.target.files?.[0])}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => fileInputRef.current?.click()} className="bg-white border">Choose</Button>
                      <Button onClick={clearAvatar} className="bg-red-50 text-red-600 border">Remove</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={saveProfile} className="bg-indigo-600 hover:bg-indigo-700" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save profile'}</Button>
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
                <Button onClick={savePreferences} className="bg-indigo-600 hover:bg-indigo-700" disabled={savingPreferences}>{savingPreferences ? 'Saving...' : 'Save preferences'}</Button>
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
                <Button onClick={saveNotifications} className="bg-indigo-600 hover:bg-indigo-700" disabled={savingNotifications}>{savingNotifications ? 'Saving...' : 'Save settings'}</Button>
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
                <Button onClick={changePassword} className="bg-indigo-600 hover:bg-indigo-700" disabled={savingPassword}>{savingPassword ? 'Updating...' : 'Change password'}</Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
