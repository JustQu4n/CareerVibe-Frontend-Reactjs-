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
import { Loader2, FolderGit2, ExternalLink, Github } from 'lucide-react';
import { toast } from 'react-toastify';
import { projectService } from '@/services/projectService';

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  project = null, 
  onSuccess 
}) => {
  const isEditMode = !!project;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: false,
    project_url: '',
    repo_url: '',
    company_name: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        role: project.role || '',
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        end_date: project.end_date ? project.end_date.split('T')[0] : '',
        is_current: project.is_current || false,
        project_url: project.project_url || '',
        repo_url: project.repo_url || '',
        company_name: project.company_name || '',
      });
    } else {
      resetForm();
    }
  }, [project, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      role: '',
      start_date: '',
      end_date: '',
      is_current: false,
      project_url: '',
      repo_url: '',
      company_name: '',
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

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.is_current && !formData.end_date) {
      newErrors.end_date = 'End date is required (or mark as ongoing project)';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    // Validate URLs if provided
    if (formData.project_url && !isValidUrl(formData.project_url)) {
      newErrors.project_url = 'Please enter a valid URL (e.g., https://example.com)';
    }

    if (formData.repo_url && !isValidUrl(formData.repo_url)) {
      newErrors.repo_url = 'Please enter a valid URL (e.g., https://github.com/user/repo)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
        // Only include optional fields if they have values
        description: formData.description.trim() || undefined,
        role: formData.role.trim() || undefined,
        project_url: formData.project_url.trim() || undefined,
        repo_url: formData.repo_url.trim() || undefined,
        company_name: formData.company_name.trim() || undefined,
      };

      if (isEditMode) {
        await projectService.updateProject(project.id, dataToSubmit);
        toast.success('Project updated successfully!');
      } else {
        await projectService.createProject(dataToSubmit);
        toast.success('Project added successfully!');
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Failed to save project');
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
            <FolderGit2 className="w-6 h-6 text-blue-600" />
            {isEditMode ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update your project details' 
              : 'Add a new project to your profile'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-semibold">
              Project Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., E-commerce Website"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Role & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 font-semibold">
                Your Role
              </Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Full Stack Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name" className="text-gray-700 font-semibold">
                Company/Client
              </Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g., Freelance Project"
              />
            </div>
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
              placeholder="Describe the project, your contributions, and technologies used..."
              className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white resize-none"
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
              This is an ongoing project
            </Label>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_url" className="text-gray-700 font-semibold flex items-center gap-1">
                <ExternalLink size={14} />
                Project URL
              </Label>
              <Input
                id="project_url"
                name="project_url"
                type="url"
                value={formData.project_url}
                onChange={handleChange}
                placeholder="https://demo-project.com"
                className={errors.project_url ? 'border-red-500' : ''}
              />
              {errors.project_url && (
                <p className="text-red-500 text-xs mt-1">{errors.project_url}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo_url" className="text-gray-700 font-semibold flex items-center gap-1">
                <Github size={14} />
                Repository URL
              </Label>
              <Input
                id="repo_url"
                name="repo_url"
                type="url"
                value={formData.repo_url}
                onChange={handleChange}
                placeholder="https://github.com/user/project"
                className={errors.repo_url ? 'border-red-500' : ''}
              />
              {errors.repo_url && (
                <p className="text-red-500 text-xs mt-1">{errors.repo_url}</p>
              )}
            </div>
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
                <>{isEditMode ? 'Update' : 'Add'} Project</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
