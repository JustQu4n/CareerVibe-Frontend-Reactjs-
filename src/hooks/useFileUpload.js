import { useState, useCallback } from 'react';

/**
 * useFileUpload Hook
 * Quản lý CV file upload với progress tracking
 * 
 * @returns {Object} File state và handlers
 */
const useFileUpload = () => {
  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState("");
  const [cvSize, setCvSize] = useState(0);
  const [cvProgress, setCvProgress] = useState(0);

  // Handler: File change - sử dụng useCallback
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file size (max 3MB)
      const maxSize = 3 * 1024 * 1024; // 3MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 3MB limit');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, DOC, and DOCX files are allowed');
        return;
      }

      setCvFile(file);
      setCvName(file.name);
      setCvSize(file.size);
      
      // Simulate upload progress
      setCvProgress(0);
      const interval = setInterval(() => {
        setCvProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }
  }, []);

  // Handler: Remove file - sử dụng useCallback
  const handleRemoveFile = useCallback(() => {
    setCvFile(null);
    setCvName("");
    setCvSize(0);
    setCvProgress(0);
  }, []);

  // Format file size for display
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  return {
    cvFile,
    cvName,
    cvSize,
    cvProgress,
    handleFileChange,
    handleRemoveFile,
    formatFileSize,
  };
};

export default useFileUpload;
