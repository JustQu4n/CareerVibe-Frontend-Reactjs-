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
import { Badge } from '@/components/ui/badge';
import { Loader2, GraduationCap, X, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { educationService } from '@/services/educationService';

const EducationModal = ({ 
  isOpen, 
  onClose, 
  education = null, 
  onSuccess 
}) => {
  const isEditMode = !!education;

  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    grade: '',
    start_date: '',
    end_date: '',
    is_current: false,
    activities: [],
    description: '',
  });

  const [activityInput, setActivityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (education) {
      setFormData({
        school: education.school || '',
        degree: education.degree || '',
        field: education.field || '',
        grade: education.grade || '',
        start_date: education.start_date ? education.start_date.split('T')[0] : '',
        end_date: education.end_date ? education.end_date.split('T')[0] : '',
        is_current: education.is_current || false,
        activities: education.activities || [],
        description: education.description || '',
      });
    } else {
      resetForm();
    }
  }, [education, isOpen]);

  const resetForm = () => {
    setFormData({
      school: '',
      degree: '',
      field: '',
      grade: '',
      start_date: '',
      end_date: '',
      is_current: false,
      activities: [],
      description: '',
    });
    setActivityInput('');
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

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activityInput.trim()]
      }));
      setActivityInput('');
    }
  };

  const handleRemoveActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const handleActivityKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddActivity();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.school.trim()) {
      newErrors.school = 'School name is required';
    }

    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.is_current && !formData.end_date) {
      newErrors.end_date = 'End date is required (or mark as currently studying)';
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
        // Only include activities if not empty
        activities: formData.activities.length > 0 ? formData.activities : undefined,
        // Only include optional fields if they have values
        field: formData.field.trim() || undefined,
        grade: formData.grade.trim() || undefined,
        description: formData.description.trim() || undefined,
      };

      if (isEditMode) {
        await educationService.updateEducation(education.id, dataToSubmit);
        toast.success('Education updated successfully!');
      } else {
        await educationService.createEducation(dataToSubmit);
        toast.success('Education added successfully!');
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error(error.message || 'Failed to save education');
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
            <GraduationCap className="w-6 h-6 text-blue-600" />
            {isEditMode ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update your education details' 
              : 'Add a new education to your profile'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Name */}
          <div className="space-y-2">
            <Label htmlFor="school" className="text-gray-700 font-semibold">
              School/University <span className="text-red-500">*</span>
            </Label>
            <Input
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="e.g., Ho Chi Minh University of Technology"
              className={errors.school ? 'border-red-500' : ''}
            />
            {errors.school && (
              <p className="text-red-500 text-xs mt-1">{errors.school}</p>
            )}
          </div>

          {/* Degree */}
          <div className="space-y-2">
            <Label htmlFor="degree" className="text-gray-700 font-semibold">
              Degree <span className="text-red-500">*</span>
            </Label>
            <Input
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="e.g., Bachelor of Science"
              className={errors.degree ? 'border-red-500' : ''}
            />
            {errors.degree && (
              <p className="text-red-500 text-xs mt-1">{errors.degree}</p>
            )}
          </div>

          {/* Field & Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field" className="text-gray-700 font-semibold">
                Field of Study
              </Label>
              <Input
                id="field"
                name="field"
                value={formData.field}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade" className="text-gray-700 font-semibold">
                Grade/GPA
              </Label>
              <Input
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g., 3.8/4.0"
              />
            </div>
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

          {/* Is Current */}
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
              I am currently studying here
            </Label>
          </div>

          {/* Activities */}
          <div className="space-y-2">
            <Label htmlFor="activity_input" className="text-gray-700 font-semibold">
              Activities & Societies
            </Label>
            <div className="flex gap-2">
              <Input
                id="activity_input"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                onKeyPress={handleActivityKeyPress}
                placeholder="e.g., Programming Club"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddActivity}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
            {formData.activities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.activities.map((activity, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 px-3 py-1"
                  >
                    {activity}
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(index)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
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
              placeholder="Describe your specialization, achievements, or relevant coursework..."
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
                <>{isEditMode ? 'Update' : 'Add'} Education</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EducationModal;
