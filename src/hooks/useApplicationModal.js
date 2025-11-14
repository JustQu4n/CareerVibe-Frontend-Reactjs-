import { useState, useCallback } from 'react';

/**
 * useApplicationModal Hook
 * Custom hook để quản lý application detail modal
 * 
 * @returns {Object} Modal state và handlers
 */
const useApplicationModal = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Handler để mở modal với application data
  const handleOpenModal = useCallback((application) => {
    setSelectedApplication(application);
  }, []);

  // Handler để đóng modal
  const handleCloseModal = useCallback(() => {
    setSelectedApplication(null);
  }, []);

  // Check xem modal có đang mở không
  const isModalOpen = selectedApplication !== null;

  return {
    selectedApplication,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useApplicationModal;
