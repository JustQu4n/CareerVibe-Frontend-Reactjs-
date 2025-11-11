/**
 * ImageUpload Component
 * Reusable image upload with preview
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Upload, User } from 'lucide-react';

const ImageUpload = React.memo(({
  imagePreview,
  onFileChange,
  label = 'Profile Picture',
  acceptedFormats = 'image/*',
  maxSizeText = 'JPG, PNG or GIF. Max size 2MB.',
  disabled = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="image-upload"
            className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Avatar
          </label>
          <input
            id="image-upload"
            type="file"
            accept={acceptedFormats}
            onChange={onFileChange}
            disabled={disabled}
            className="sr-only"
          />
          <p className="text-xs text-gray-500 mt-1">{maxSizeText}</p>
        </div>
      </div>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

ImageUpload.propTypes = {
  imagePreview: PropTypes.string,
  onFileChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  acceptedFormats: PropTypes.string,
  maxSizeText: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ImageUpload;
