/**
 * Custom Hook: useRecruiterLogin
 * Encapsulates recruiter login form logic and state management
 * 
 * @description
 * This hook manages the state and logic for recruiter authentication,
 * providing a clean separation of concerns from the UI component.
 * 
 * Features:
 * - Form state management
 * - Password visibility toggle
 * - Form validation
 * - API integration
 * - Redux state updates
 * - Navigation handling
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading, setUser } from '@/redux/authSlice';
import { loginRecruiter } from '@/services/authService';
import { ROUTES } from '@/constants';

/**
 * useRecruiterLogin Hook
 * @returns {Object} Login form state and handlers
 */
export const useRecruiterLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Form state - managed separately for better performance
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   * Optimized with useCallback to prevent unnecessary re-renders in child components
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Toggle password visibility
   * Memoized to maintain referential equality across renders
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Handle form submission
   * Processes login request and manages state updates
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      
      // Call recruiter login API (now using same endpoint as jobseeker)
      const response = await loginRecruiter(formData);
      
<<<<<<< HEAD
      // Backend returns: { message, user: { user_id, email, full_name, roles, employer: { employer_id, company } }, accessToken, refreshToken }
      if (response.user && response.user.roles?.includes('employer')) {
        // Store tokens in localStorage
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('token', response.accessToken); // For backward compatibility
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        
=======
      console.log('Recruiter login response:', response);
      
      // Backend returns: { message, user: { user_id, email, full_name, roles, employer: { employer_id, company } }, accessToken, refreshToken }
      if (response.user && response.user.roles?.includes('employer')) {
>>>>>>> 45acdd1b9640aa7de6bd078fe8d1b5c1c79e67e4
        // Construct full user data with employer and company info
        const fullUserData = {
          ...response.user,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        };
        
        // Update Redux store
        dispatch(setUser(fullUserData));
        
<<<<<<< HEAD
        toast.success('Login successful!');

        setTimeout(() => {
=======
        console.log('User data saved to Redux:', fullUserData);
        console.log('Navigating to /admin/dashboard...');
        
        // Show success message and redirect to admin dashboard
        toast.success(response.message || 'Login successful');
        
        // Small delay for better UX (allows toast to be visible)
        setTimeout(() => {
          console.log('Executing navigate to /admin/dashboard');
>>>>>>> 45acdd1b9640aa7de6bd078fe8d1b5c1c79e67e4
          navigate('/admin/dashboard');
        }, 500);
      } else {
        toast.error('Invalid account type. Please use employer account.');
      }
    } catch (error) {
<<<<<<< HEAD
=======
      console.error('Recruiter login error:', error);
      // Extract error message from response or use default
>>>>>>> 45acdd1b9640aa7de6bd078fe8d1b5c1c79e67e4
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      // Always reset loading states
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [formData, dispatch, navigate]);

  return {
    // Form data
    formData,
    
    // UI state
    showPassword,
    isSubmitting,
    
    // Handlers - memoized for performance
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  };
};

export default useRecruiterLogin;
