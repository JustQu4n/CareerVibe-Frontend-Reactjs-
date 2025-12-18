import React, { useState } from 'react';
import employerService from '@/modules/admin/services/employerService';
import { toast } from 'react-toastify';
import { X, Check, Loader2 } from 'lucide-react';

export default function EmployerProfileEditModal({ profile, onClose, onSuccess }) {
  const [position, setPosition] = useState(profile.position || '');
  const [companyId, setCompanyId] = useState(profile.company?._id || profile.company?.id || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setError(null);
    // basic validation
    if (position && position.length > 100) {
      setError('Position must be shorter than 100 characters');
      return;
    }

    try {
      setSaving(true);
      const payload = {};
      if (position !== profile.position) payload.position = position;
      if (companyId !== (profile.company?._id || profile.company?.id || '')) payload.company_id = companyId || null;

      const res = await employerService.updateProfile(payload);
      const updated = res.data || res;
      toast.success('Profile updated');
      onSuccess(updated);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to update profile';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Employer Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company ID</label>
            <input value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="Enter company id" />
            <p className="text-xs text-gray-400 mt-1">Provide the company id to link. Autocomplete can be added later.</p>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={14} />} {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
