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

    // Password validation (matches backend RegisterDto requirements)
    if (formData.password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.password)) {
      toast.error('Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }

    // Phone validation if provided (matches backend: 10-11 digits)
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ (10-11 số)');
      return;
    }

    // Prepare FormData (backend expects multipart/form-data)
    const submitData = new FormData();
    submitData.append('full_name', formData.fullname);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('role', 'job_seeker');
    
    // Optional fields - only append if they exist
    if (formData.phone) {
      submitData.append('phone', formData.phone);
    }
    if (formData.address) {
      submitData.append('address', formData.address);
    }
    
    // Avatar file
    if (formData.file) {
      submitData.append('avatar', formData.file);
    }

    // Debug: Log FormData contents
    console.log('Submitting registration data:');
    for (let pair of submitData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    
    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      
      // Call register API
      const response = await registerUser(submitData);
      
      console.log('Registration response:', response);
      
      // Backend now returns { success: true, message, user }
      if (response.success) {
        // Show success message - account created but needs verification
        toast.success(response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        
        setTimeout(() => {
          navigate(ROUTES.LOGIN, { 
            state: { 
              email: formData.email,
              message: 'Vui lòng xác thực email trước khi đăng nhập' 
            } 
          });
        }, 1500);
      } else {
        // Handle unsuccessful response
        toast.error(response?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || AUTH_MESSAGES.REGISTER_FAILED;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [formData, passwordStrength, dispatch, navigate]);

  return {
    // Form data
    formData,
    errors,
    
    // UI state
    imagePreview,
    showPassword,
    showConfirmPassword,
    formStep,
    passwordStrength,
    isSubmitting,
    
    // Handlers
    handleInputChange,
    handleFileChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    nextStep,
    prevStep,
    handleSubmit,
  };
};

export default useRegister;
