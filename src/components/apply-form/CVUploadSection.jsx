import React, { useRef } from 'react';
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
  const fileInputRef = useRef(null);

  const handleRemove = () => {
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Call parent remove handler
    onRemove();
  };
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Resume/CV <span className="text-red-500">*</span>
      </label>
      
      <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
        cvFile ? 'border-gray-300 bg-gray-50' : 'border-gray-300 bg-white'
      }`}>
        {!cvFile ? (
          <div className="text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drop your CV here or click to browse
            </p>
            <div className="relative inline-block">
              <button type="button" className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOC, DOCX (max 3MB)
            </p>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{cvName}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(cvSize)}</p>
                </div>
                <button 
                  type="button"
                  onClick={handleRemove}
                  className="text-gray-500 hover:text-red-600 transition-colors text-xs font-medium flex-shrink-0"
                >
                  Remove
                </button>
              </div>
              {cvProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-gray-900 h-1 rounded-full transition-all duration-300" 
                    style={{ width: `${cvProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVUploadSection;
