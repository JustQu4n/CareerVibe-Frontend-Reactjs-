import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import employerService from '@/modules/admin/services/employerService';
import { toast } from 'react-toastify';
import { X, Save, Loader2, Building2, Globe, Users, Calendar, Mail, Phone, MapPin, Upload, Image } from 'lucide-react';

export default function CompanyUpdateModal({ profile, onClose, onSuccess }) {
  const company = profile?.company || {};
  console.log('Profile in CompanyUpdateModal:', profile);
  console.log('Editing company:', company);
  console.log('Company ID check - _id:', company._id, 'id:', company.id);
  
  // Extract company ID from various possible locations
  const companyId = company._id || company.id || company.company_id || profile?.company_id || '';
  console.log('Extracted company ID:', companyId);
  
  const [formData, setFormData] = useState({
    company_id: companyId,
    name: company.name || '',
    industry: company.industry || '',
    overview: company.overview || '',
    benefits: company.benefits || '',
    vision: company.vision || '',
    mission: company.mission || '',
    innovation: company.innovation || '',
    sustainability: company.sustainability || '',
    location: company.location || '',
    website: company.website || '',
    employees_range: company.employees_range || '',
    founded_at: company.founded_at || '',
    logo_url: company.logo_url || '',
    contact_address: company.contact_address || '',
    contact_email: company.contact_email || '',
    contact_phone: company.contact_phone || ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // basic, details, contact
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(company.logo_url || '');
  const fileRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Please upload JPG, PNG or GIF image');
      return;
    }

    const companyId = formData.company_id;
    console.log('Uploading avatar for company ID:', companyId);
    if (!companyId) {
      toast.error('Company ID is required to upload avatar');
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploading(true);

    const fd = new FormData();
    fd.append('avatar', file);

    try {
      const res = await employerService.updateCompanyAvatar(companyId, fd);
      const data = res.data || res;
      const logoUrl = data?.logo_url || data?.avatar_url || data?.avatar;
      
      // Update form data with new logo URL
      setFormData(prev => ({ ...prev, logo_url: logoUrl }));
      setAvatarPreview(logoUrl);
      toast.success(res.message || 'Company logo updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to upload logo');
      setAvatarPreview(formData.logo_url || '');
    } finally {
      setUploading(false);
      setTimeout(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      }, 3000);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim().length === 0) {
      setError('Company name is required');
      return false;
    }
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      setError('Website must be a valid URL (http:// or https://)');
      return false;
    }
    if (formData.contact_email && !formData.contact_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Contact email must be valid');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const companyId = formData.company_id;
    console.log('Saving company ID:', companyId);
    if (!companyId) {
      setError('Company ID is required to update');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Only send non-empty fields
      const payload = {};
      Object.keys(formData).forEach(key => {
        // Skip company_id in payload as it's in URL
        if (key !== 'company_id' && formData[key] && formData[key].toString().trim() !== '') {
          payload[key] = formData[key];
        }
      });

      const res = await employerService.updateCompany(companyId, payload);
      toast.success(res.message || 'Company updated successfully!');
      onSuccess(res.data || res);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to update company';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'details', label: 'Details', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Update Company Information</h3>
                  <p className="text-sm text-white/80">Manage your company profile</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
              >
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Logo Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-6">
                    {/* Logo Preview */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                        {avatarPreview ? (
                          <img 
                            src={avatarPreview} 
                            alt="Company logo" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-gray-300" />
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading || !formData.company_id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload Logo
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF. Max 2MB. {!formData.company_id && 'Company ID required first.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company ID
                    </label>
                    <input
                      type="text"
                      value={formData.company_id}
                      readOnly
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Auto-detected from profile"
                    />
                    <p className="text-xs text-gray-500 mt-1">Read-only field</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="ACME Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Software, Finance, Healthcare..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employees Range
                    </label>
                    <select
                      value={formData.employees_range}
                      onChange={(e) => handleChange('employees_range', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select range</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-500">101-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Founded Date
                    </label>
                    <input
                      type="date"
                      value={formData.founded_at}
                      onChange={(e) => handleChange('founded_at', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => handleChange('logo_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://cdn.example/logo.png"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overview
                  </label>
                  <textarea
                    value={formData.overview}
                    onChange={(e) => handleChange('overview', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief company overview..."
                  />
                </div>
              </motion.div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mission
                  </label>
                  <textarea
                    value={formData.mission}
                    onChange={(e) => handleChange('mission', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Company mission statement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vision
                  </label>
                  <textarea
                    value={formData.vision}
                    onChange={(e) => handleChange('vision', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Company vision..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) => handleChange('benefits', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Employee benefits (one per line)&#10;Example:&#10;Flexible hours&#10;Health insurance&#10;Remote work"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use new lines to separate benefits</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Innovation
                  </label>
                  <textarea
                    value={formData.innovation}
                    onChange={(e) => handleChange('innovation', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="R&D focus, technology innovations..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sustainability
                  </label>
                  <textarea
                    value={formData.sustainability}
                    onChange={(e) => handleChange('sustainability', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Green initiatives, environmental policies..."
                  />
                </div>
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Hanoi, Vietnam"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://acme.example"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="hr@acme.example"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => handleChange('contact_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+84123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Address
                  </label>
                  <textarea
                    value={formData.contact_address}
                    onChange={(e) => handleChange('contact_address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="123 Street, District, City"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Company name is required
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
