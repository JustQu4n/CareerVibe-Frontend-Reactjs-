import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import { experienceService } from '@/services/experienceService';

const ExperienceModal = ({ 
  isOpen, 
  onClose, 
  experience = null, 
  onSuccess 
}) => {
  const isEditMode = !!experience;

  const [formData, setFormData] = useState({
    company_name: '',
    title: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (experience) {
      setFormData({
        company_name: experience.company_name || '',
        title: experience.title || '',
        location: experience.location || '',
        start_date: experience.start_date ? experience.start_date.split('T')[0] : '',
        end_date: experience.end_date ? experience.end_date.split('T')[0] : '',
        is_current: experience.is_current || false,
        description: experience.description || '',
      });
    } else {
      resetForm();
    }
  }, [experience, isOpen]);

  const resetForm = () => {
    setFormData({
      company_name: '',
      title: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear end_date if is_current is checked
    if (name === 'is_current' && checked) {
      setFormData(prev => ({ ...prev, end_date: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.is_current && !formData.end_date) {
      newErrors.end_date = 'End date is required (or mark as current position)';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        end_date: formData.is_current ? null : formData.end_date,
      };

      if (isEditMode) {
        await experienceService.updateExperience(experience.id, dataToSubmit);
        toast.success('Experience updated successfully!');
      } else {
        await experienceService.createExperience(dataToSubmit);
        toast.success('Experience added successfully!');
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error(error.message || 'Failed to save experience');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="w-6 h-6 text-blue-600" />
            {isEditMode ? 'Edit Work Experience' : 'Add Work Experience'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update your work experience details' 
              : 'Add a new work experience to your profile'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-gray-700 font-semibold">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g., Tech Company Inc."
              className={errors.company_name ? 'border-red-500' : ''}
            />
            {errors.company_name && (
              <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-semibold">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior Developer"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700 font-semibold">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Ho Chi Minh City"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-gray-700 font-semibold">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className={errors.start_date ? 'border-red-500' : ''}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-gray-700 font-semibold">
                End Date {!formData.is_current && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={formData.is_current}
                className={errors.end_date ? 'border-red-500' : ''}
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Is Current Position */}
          <div className="flex items-center space-x-2">
            <input
              id="is_current"
              name="is_current"
              type="checkbox"
              checked={formData.is_current}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label 
              htmlFor="is_current" 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              I currently work here
            </Label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-semibold">
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your role, responsibilities, and achievements..."
              className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white resize-none"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>{isEditMode ? 'Update' : 'Add'} Experience</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceModal;
