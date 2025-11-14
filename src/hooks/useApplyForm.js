import { useState, useCallback, useEffect } from 'react';

/**
 * useApplyForm Hook
 * Quản lý state và logic cho application form
 * 
 * @param {Object} user - User object từ Redux
 * @returns {Object} Form state và handlers
 */
const useApplyForm = (user) => {
  const [input, setInput] = useState({
    fullname: user?.jobseeker?.full_name || "",
    phone: user?.jobseeker?.phone || "",
    location: user?.jobseeker?.location || "",
  });

  const [coverLetter, setCoverLetter] = useState("");
  const [remainingChars, setRemainingChars] = useState(500);

  // Update input values khi user object thay đổi
  useEffect(() => {
    setInput({
      fullname: user?.jobseeker?.full_name || "",
      phone: user?.jobseeker?.phone || "",
      location: user?.jobseeker?.location || "",
    });
  }, [user]);

  // Handler: Change input fields - sử dụng useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handler: Change cover letter - sử dụng useCallback
  const handleCoverLetterChange = useCallback((e) => {
    const text = e.target.value;
    setCoverLetter(text);
    setRemainingChars(500 - text.length);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setInput({
      fullname: user?.jobseeker?.full_name || "",
      phone: user?.jobseeker?.phone || "",
      location: user?.jobseeker?.location || "",
    });
    setCoverLetter("");
    setRemainingChars(500);
  }, [user]);

  return {
    input,
    coverLetter,
    remainingChars,
    handleInputChange,
    handleCoverLetterChange,
    resetForm,
  };
};

export default useApplyForm;
