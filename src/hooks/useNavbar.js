/**
 * Custom Hook: useNavbar
 * Manages navbar state and business logic
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import { logoutUser } from '@/services/authService';

/**
 * Hook for managing navbar functionality
 * @returns {Object} Navbar state and handlers
 */
const useNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  /**
   * Close mobile menu
   */
  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  /**
   * Handle user logout
   * Includes fallback logic in case backend logout fails
   */
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      // Try to logout via API
      await logoutUser();
      
      // Clear client-side state regardless of API response
      // This ensures user is logged out even if backend fails
      dispatch(setUser(null));
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('persist:root'); // Clear redux-persist
      
      // Navigate to home
      navigate('/');
      
      // Show success message
      toast.success('Logged out successfully');
      
    } catch (error) {
      // Even if API fails, clear client-side state
      // This prevents user from being stuck in logged-in state
      dispatch(setUser(null));
      localStorage.removeItem('token');
      localStorage.removeItem('persist:root');
      
      // Still navigate to home
      navigate('/');
      
      // Show error but still logout client-side
      toast.info('Logged out (session may still be active on server)');
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, navigate, isLoggingOut]);

  /**
   * Navigate to profile (mobile specific)
   */
  const handleNavigateToProfile = useCallback(() => {
    navigate('/profile');
    closeMobileMenu();
  }, [navigate, closeMobileMenu]);

  return {
    mobileOpen,
    isLoggingOut,
    toggleMobileMenu,
    closeMobileMenu,
    handleLogout,
    handleNavigateToProfile,
  };
};

export default useNavbar;
