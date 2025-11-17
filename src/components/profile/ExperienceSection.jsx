/**
 * ExperienceSection Component
 * Displays user's work experience with CRUD operations
 */

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Building2,
} from 'lucide-react';
import { format } from 'date-fns';

const ExperienceSection = React.memo(({
  experiences,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
}) => {
  // Memoized handlers to prevent re-renders
  const handleEdit = useCallback((exp) => {
    onEditExperience(exp);
  }, [onEditExperience]);

  const handleDelete = useCallback((expId) => {
    onDeleteExperience(expId);
  }, [onDeleteExperience]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          Work Experience
        </h2>
        <Button
          onClick={onAddExperience}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Experience
        </Button>
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`relative pl-8 ${
                index !== experiences.length - 1
                  ? 'pb-6 border-l-2 border-gray-200'
                  : ''
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    exp.is_current
                      ? 'bg-green-500 ring-4 ring-green-100'
                      : 'bg-blue-500 ring-4 ring-blue-100'
                  }`}
                ></div>
              </div>

              {/* Experience Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-600 font-medium mt-1">
                      <Building2 size={16} />
                      <span>{exp.company_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {exp.is_current && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Current
                      </Badge>
                    )}
                    {/* Action Buttons - Show on hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                        aria-label="Edit experience"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        aria-label="Delete experience"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date and Location */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {format(new Date(exp.start_date), 'MMM yyyy')} -{' '}
                      {exp.is_current
                        ? 'Present'
                        : format(new Date(exp.end_date), 'MMM yyyy')}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 border border-dashed border-gray-300 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No work experience added yet</p>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={onAddExperience}
          >
            <Plus size={16} className="mr-2" />
            Add Experience
          </Button>
        </div>
      )}
    </div>
  );
});

ExperienceSection.displayName = 'ExperienceSection';

export default ExperienceSection;
