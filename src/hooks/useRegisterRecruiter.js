/**
 * Custom Hook: useRegisterRecruiter
 * Encapsulates recruiter registration form logic and state management
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading, setUser } from '@/redux/authSlice';
import { registerRecruiter } from '@/services/authService';
import { searchCompaniesByName } from '@/services/companyService';
import { AUTH_MESSAGES, ROUTES } from '@/constants';

/**
 * useRegisterRecruiter Hook
 * @returns {Object} Registration form state and handlers
 */
export const useRegisterRecruiter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    repassword: '',
    company_name: '',
    company_address: '',
    company_domain: '',
    file: null,
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Company search state
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Handle input change
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Handle file change
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous URL to avoid memory leaks
      if (formData.file instanceof File) {
        URL.revokeObjectURL(formData.file);
      }
      
      setFormData((prev) => ({ ...prev, file }));
    }
  }, [formData.file]);

  /**
   * Cleanup file URL on unmount
   */
  useEffect(() => {
    return () => {
      if (formData.file instanceof File) {
        URL.revokeObjectURL(formData.file);
      }
    };
  }, [formData.file]);

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
   * Search companies with debounce
   */
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (formData.company_name.length >= 2) {
        setIsSearching(true);
        try {
          const matches = await searchCompaniesByName(formData.company_name);
          setCompanySuggestions(matches);
          setShowCompanyDropdown(true);
        } catch (error) {
          console.error('Error searching companies:', error);
          setCompanySuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowCompanyDropdown(false);
        setCompanySuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [formData.company_name]);

  /**
   * Handle company selection from dropdown
   */
  const handleCompanySelect = useCallback((company) => {
    setFormData((prev) => ({
      ...prev,
      company_name: company.name,
      company_domain: company.email_domain || '',
      company_address: company.address || '',
      company_logo: company.logo || '',
    }));
    setSelectedCompany(company);
    setShowCompanyDropdown(false);
  }, []);

  /**
   * Reset company selection
   */
  const resetCompanySelection = useCallback(() => {
    setSelectedCompany(null);
    setFormData((prev) => ({
      ...prev,
      company_domain: '',
      company_address: '',
      company_logo: '',
    }));
  }, []);

  /**
   * Handle company name input change
   */
  const handleCompanyNameChange = useCallback((e) => {
    handleInputChange(e);
    resetCompanySelection();
  }, [handleInputChange, resetCompanySelection]);

  /**
   * Validate step 1 (Personal info)
   */
  const validateStepOne = useCallback(() => {
    if (!formData.fullname.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      toast.error('Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.repassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  }, [formData]);

  /**
   * Validate step 2 (Company info)
   */
  const validateStepTwo = useCallback(() => {
    if (!formData.company_name.trim()) {
      toast.error('Please enter company name');
      return false;
    }
    
    // If not using existing company, require other fields
    if (!selectedCompany) {
      if (!formData.company_domain.trim()) {
        toast.error('Please enter company domain');
        return false;
      }
      if (!formData.company_address.trim()) {
        toast.error('Please enter company address');
        return false;
      }
    }
    
    return true;
  }, [formData, selectedCompany]);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (currentStep === 1 && validateStepOne()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStepTwo()) {
      setCurrentStep(3);
    }
  }, [currentStep, validateStepOne, validateStepTwo]);

  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!validateStepOne() || !validateStepTwo()) {
      return;
    }

    // Prepare form data
    const submitData = new FormData();
    submitData.append('full_name', formData.fullname);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    
    if (selectedCompany) {
      submitData.append('company_id', selectedCompany._id);
      submitData.append('is_existing_company', 'true');
    } else {
      submitData.append('company_name', formData.company_name);
      submitData.append('company_domain', formData.company_domain);
      submitData.append('company_address', formData.company_address);
    }
    
    if (formData.file) {
      submitData.append('logo', formData.file);
    }

    try {
      setIsSubmitting(true);
      dispatch(setLoading(true));
      
      // Call register API
      const response = await registerRecruiter(submitData);
      
      if (response.success) {
        const userData = response.data?.user;
        
        if (userData) {
          // Construct full user data
          const fullUserData = {
            ...userData,
            employer: response.data?.employer,
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
          toast.success(response.message || AUTH_MESSAGES.REGISTER_SUCCESS);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || AUTH_MESSAGES.REGISTER_FAILED;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  }, [formData, selectedCompany, validateStepOne, validateStepTwo, dispatch, navigate]);

  return {
    // Form data
    formData,
    
    // UI state
    showPassword,
    showConfirmPassword,
    currentStep,
    isSubmitting,
    
    // Company search state
    companySuggestions,
    showCompanyDropdown,
    selectedCompany,
    isSearching,
    
    // Handlers
    handleInputChange,
    handleFileChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleCompanyNameChange,
    handleCompanySelect,
    resetCompanySelection,
    nextStep,
    prevStep,
    handleSubmit,
  };
};

export default useRegisterRecruiter;
