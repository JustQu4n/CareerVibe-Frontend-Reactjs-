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
      
      // New API structure: { message, user, accessToken, refreshToken }
      if (response.user && response.accessToken) {
        // Check role to prevent employer accounts from logging into jobseeker site
        const rawRoles = response.user.roles || [];
        const primaryRole = (response.user.role || rawRoles[0] || '').toString().toLowerCase();

        // If role indicates employer/recruiter, block login on this UI
        if (primaryRole.includes('employ') || primaryRole.includes('recruit') || primaryRole === 'employer' || primaryRole === 'recruiter') {
          toast.error('This account is registered as an employer. Please sign in via the employer portal.');
          setIsSubmitting(false);
          dispatch(setLoading(false));
          return;
        }

        // Construct full user data with token
        const fullUserData = {
          ...response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
          // Extract user info from new structure
          id: response.user.user_id,
          email: response.user.email,
          fullname: response.user.full_name,
          phone: response.user.phone,
          role: primaryRole || 'jobseeker',
          avatar_url: response.user.avatar_url,
          // Add job_seeker_id from jobSeeker object
          job_seeker_id: response.user.jobSeeker?.job_seeker_id,
          jobSeeker: response.user.jobSeeker, // Keep full jobSeeker data
        };

        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        // Update Redux store
        dispatch(setUser(fullUserData));

        // Show success message
        toast.success(response.message || AUTH_MESSAGES.LOGIN_SUCCESS);

        // Small delay for better UX
        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 300);
      } else {
        toast.warning(AUTH_MESSAGES.USER_DATA_NOT_FOUND);
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
