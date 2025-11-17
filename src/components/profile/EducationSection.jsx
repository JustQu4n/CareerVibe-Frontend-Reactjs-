/**
 * EducationSection Component
 * Displays user's education with CRUD operations
 */

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Award,
} from 'lucide-react';
import { format } from 'date-fns';

const EducationSection = React.memo(({
  educations,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
}) => {
  // Memoized handlers
  const handleEdit = useCallback((edu) => {
    onEditEducation(edu);
  }, [onEditEducation]);

  const handleDelete = useCallback((eduId) => {
    onDeleteEducation(eduId);
  }, [onDeleteEducation]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          Education
        </h2>
        <Button
          onClick={onAddEducation}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Education
        </Button>
      </div>

      {educations.length > 0 ? (
        <div className="space-y-6">
          {educations.map((edu, index) => (
            <div
              key={edu.id}
              className={`relative pl-8 ${
                index !== educations.length - 1
                  ? 'pb-6 border-l-2 border-gray-200'
                  : ''
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 -translate-x-1/2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    edu.is_current
                      ? 'bg-green-500 ring-4 ring-green-100'
                      : 'bg-blue-500 ring-4 ring-blue-100'
                  }`}
                ></div>
              </div>

              {/* Education Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-blue-600 font-medium mt-1">
                      {edu.school}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {edu.is_current && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Studying
                      </Badge>
                    )}
                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                        aria-label="Edit education"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        aria-label="Delete education"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3">
                  {edu.field && (
                    <div className="flex items-center gap-1">
                      <Award size={14} />
                      <span>{edu.field}</span>
                    </div>
                  )}
                  {edu.grade && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">GPA: {edu.grade}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {format(new Date(edu.start_date), 'MMM yyyy')} -{' '}
                      {edu.is_current
                        ? 'Present'
                        : format(new Date(edu.end_date), 'MMM yyyy')}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                    {edu.description}
                  </p>
                )}

                {/* Activities */}
                {edu.activities && edu.activities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      ACTIVITIES:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {edu.activities.map((activity, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs"
                        >
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 border border-dashed border-gray-300 text-center">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">
            No education information added yet
          </p>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={onAddEducation}
          >
            <Plus size={16} className="mr-2" />
            Add Education
          </Button>
        </div>
      )}
    </div>
  );
});

EducationSection.displayName = 'EducationSection';

export default EducationSection;
