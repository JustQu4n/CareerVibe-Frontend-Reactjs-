import React from 'react';
import { Upload, FileText } from 'lucide-react';

/**
 * CVUploadSection Component
 * File upload với progress tracking
 * 
 * @param {Object} props
 * @param {File} props.cvFile - Current CV file
 * @param {string} props.cvName - CV filename
 * @param {number} props.cvSize - CV file size
 * @param {number} props.cvProgress - Upload progress (0-100)
 * @param {Function} props.onFileChange - File change handler
 * @param {Function} props.onRemove - Remove file handler
 * @param {Function} props.formatFileSize - Format file size function
 */
const CVUploadSection = ({ 
  cvFile, 
  cvName, 
  cvSize, 
  cvProgress, 
  onFileChange, 
  onRemove, 
  formatFileSize 
}) => {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <FileText className="mr-2 h-5 w-5 text-blue-600" />
        Resume/CV
      </h4>
      
      <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        cvFile ? 'border-green-300 bg-green-50' : 'border-blue-200 bg-blue-50'
      }`}>
        {!cvFile ? (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-700 font-medium mb-2">
              Drag and drop your CV here, or
            </p>
            <div className="relative inline-block">
              <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Browse Files
              </button>
              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Supported formats: PDF, DOC, DOCX (max 3MB)
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center mr-3 border border-gray-200">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h5 className="font-medium text-gray-900">{cvName}</h5>
                    <p className="text-sm text-gray-500">{formatFileSize(cvSize)}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={onRemove}
                    className="text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                    style={{ width: `${cvProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {cvProgress < 100 ? 'Uploading...' : 'Upload complete'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CVUploadSection);
