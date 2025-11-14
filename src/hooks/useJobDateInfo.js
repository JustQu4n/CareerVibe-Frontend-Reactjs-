import { useMemo } from 'react';
import { format } from 'date-fns';

/**
 * useJobDateInfo Hook
 * Custom hook để tính toán thông tin ngày tháng của job
 * 
 * @param {string} expiresAt - Ngày hết hạn
 * @returns {Object} - { daysRemaining, expirationColor, formatDate }
 */
const useJobDateInfo = (expiresAt) => {
  /**
   * Tính số ngày còn lại đến khi job hết hạn
   */
  const daysRemaining = useMemo(() => {
    if (!expiresAt) return null;

    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, [expiresAt]);

  /**
   * Màu sắc cho thông báo hết hạn
   * Đỏ nếu còn ít hơn 7 ngày, xanh nếu còn nhiều hơn
   */
  const expirationColor = useMemo(() => {
    return daysRemaining && daysRemaining < 7 ? 'text-red-600' : 'text-green-600';
  }, [daysRemaining]);

  /**
   * Format date string thành định dạng readable
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'd MMMM, yyyy');
  };

  return {
    daysRemaining,
    expirationColor,
    formatDate,
  };
};

export default useJobDateInfo;
