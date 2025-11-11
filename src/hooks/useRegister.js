/**
 * Custom Hook: useRegister
 * Encapsulates registration form logic and state management
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading, setUser } from '@/redux/authSlice';
import { registerUser } from '@/services/authService';
import { validateRegisterForm, checkPasswordStrength } from '@/validations/authValidation';
import { AUTH_MESSAGES, ROUTES } from '@/constants';

/**
 * useRegister Hook
 * @returns {Object} Registration form state and handlers
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    repassword: '',
    file: null,
  });
  
  // UI state
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [formStep, setFormStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle input change
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Update password strength
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  }, [errors]);

  /**
   * Handle file change
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }, []);

  /**
   * Cleanup preview URL
   */
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Toggle confirm password visibility
   */
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  /**
   * Handle skill input
   */
  const handleSkillKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills((prev) => [...prev, skillInput.trim()]);
      }
      setSkillInput('');
    }
  }, [skillInput, skills]);

  /**
   * Remove skill
   */
  const removeSkill = useCallback((index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Add popular skill
   */
  const addPopularSkill = useCallback((skill) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  }, [skills]);

  /**
   * Validate step one
   */
  const validateStepOne = useCallback(() => {
    if (!formData.fullname || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  }, [formData]);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (validateStepOne()) {
      setFormStep(2);
    }
  }, [validateStepOne]);

  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    setFormStep(1);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.repassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Check password strength
    if (passwordStrength < 2) {
      toast.error('Please choose a stronger password');
      return;
    }

    // Warn about skills
    if (skills.length === 0) {
      toast.warning('Adding at least one skill is recommended');
    }

    // Prepare form data
    const submitData = new FormData();
    submitData.append('full_name', formData.fullname);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('phone', formData.phone);
    submitData.append('address', formData.address);
    submitData.append('skills', JSON.stringify(skills));
    
    if (formData.file) {
      submitData.append('avatar', formData.file);
    }

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      
      // Call register API
      const response = await registerUser(submitData);
      
      if (response.success) {
        const userData = response.data?.user;
        
        if (userData) {
          // Construct full user data
          const fullUserData = {
            ...userData,
            jobseeker: response.data?.jobSeeker,
            token: response.data?.token,
          };
          
          // Update Redux store
          dispatch(setUser(fullUserData));
          
          // Navigate to home
          toast.success('Registration successful! Welcome to CareerVibe');
          setTimeout(() => {
            navigate(ROUTES.HOME);
          }, 300);
        } else {
          // Fallback
          navigate(ROUTES.LOGIN);
          toast.success(response.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || AUTH_MESSAGES.REGISTER_FAILED;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [formData, skills, passwordStrength, dispatch, navigate]);

  return {
    // Form data
    formData,
    errors,
    
    // UI state
    imagePreview,
    showPassword,
    showConfirmPassword,
    skillInput,
    skills,
    formStep,
    passwordStrength,
    isSubmitting,
    
    // Setters
    setSkillInput,
    
    // Handlers
    handleInputChange,
    handleFileChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSkillKeyDown,
    removeSkill,
    addPopularSkill,
    nextStep,
    prevStep,
    handleSubmit,
  };
};

export default useRegister;
