/**
 * ProjectsSection Component
 * Displays user's projects with CRUD operations
 */

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FolderGit2,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Building2,
  ExternalLink,
  Link as LinkIcon,
} from 'lucide-react';
import { format } from 'date-fns';

const ProjectsSection = React.memo(({
  projects,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) => {
  // Memoized handlers
  const handleEdit = useCallback((project) => {
    onEditProject(project);
  }, [onEditProject]);

  const handleDelete = useCallback((projectId) => {
    onDeleteProject(projectId);
  }, [onDeleteProject]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FolderGit2 className="w-6 h-6 text-blue-600" />
          Projects
        </h2>
        <Button
          onClick={onAddProject}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {project.is_current && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Ongoing
                    </Badge>
                  )}
                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                      aria-label="Edit project"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                      aria-label="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Role */}
              {project.role && (
                <p className="text-sm font-medium text-blue-600 mb-2">
                  {project.role}
                </p>
              )}

              {/* Company */}
              {project.company_name && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Building2 size={14} />
                  <span>{project.company_name}</span>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                <Calendar size={12} />
                <span>
                  {format(new Date(project.start_date), 'MMM yyyy')} -{' '}
                  {project.is_current
                    ? 'Present'
                    : format(new Date(project.end_date), 'MMM yyyy')}
                </span>
              </div>

              {/* Description */}
              {project.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {project.description}
                </p>
              )}

              {/* Links */}
              <div className="flex gap-2 mt-3">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ExternalLink size={12} />
                    Live Demo
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 font-medium"
                  >
                    <LinkIcon size={12} />
                    Repository
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 border border-dashed border-gray-300 text-center">
          <FolderGit2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No projects added yet</p>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={onAddProject}
          >
            <Plus size={16} className="mr-2" />
            Add Project
          </Button>
        </div>
      )}
    </div>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;
