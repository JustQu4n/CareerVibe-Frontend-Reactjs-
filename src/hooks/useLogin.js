/**
 * Custom Hook: useLogin
 * Encapsulates login form logic and state management
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading, setUser } from '@/redux/authSlice';
import { loginUser } from '@/services/authService';
import { validateLoginForm } from '@/validations/authValidation';
import { AUTH_MESSAGES, ROUTES } from '@/constants';

/**
 * useLogin Hook
 * @returns {Object} Login form state and handlers
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   * Optimized with useCallback to prevent unnecessary re-renders
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  }, [errors]);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      
      // Call login API
      const response = await loginUser(formData);
      
      if (response.success) {
        const userData = response.data?.user;
        
        if (userData) {
          // Construct full user data with jobseeker info and token
          const fullUserData = {
            ...userData,
            jobseeker: response.data?.jobSeeker,
            token: response.data?.token,
          };
          
          // Update Redux store
          dispatch(setUser(fullUserData));
          
          // Show success message and redirect
          toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);
          
          // Small delay for better UX
          setTimeout(() => {
            navigate(ROUTES.HOME);
          }, 300);
        } else {
          toast.warning(AUTH_MESSAGES.USER_DATA_NOT_FOUND);
        }
      }
    } catch (error) {
      // Error handling
      const errorMessage = error.response?.data?.message || AUTH_MESSAGES.LOGIN_FAILED;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [formData, dispatch, navigate]);

  return {
    // Form data
    formData,
    errors,
    
    // UI state
    showPassword,
    isSubmitting,
    
    // Handlers
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  };
};

export default useLogin;
