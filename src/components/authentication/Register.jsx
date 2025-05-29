import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components_lite/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { 
  AtSign, 
  User, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  CheckCircle2, 
  X,
  Plus
} from "lucide-react";

const Register = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    repassword: "",
    file: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [formStep, setFormStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const popularSkills = [
    "React", "NodeJS", "Docker", "SQL", 
    "MongoDB", "AWS", "Python", "JavaScript"
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  // Track password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    
    // Length check
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    return Math.min(score, 4);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const addPopularSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };
  
  const ChangeFilehandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
    
    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateStepOne = () => {
    if (!input.fullname || !input.email || !input.phone || !input.address) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!input.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStepOne()) {
      setFormStep(2);
    }
  };

  const prevStep = () => {
    setFormStep(1);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (input.password !== input.repassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      toast.error("Please choose a stronger password");
      return;
    }

    if (skills.length === 0) {
      toast.warning("Adding at least one skill is recommended");
    }

    const formData = new FormData();
    formData.append("full_name", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phone", input.phone);
    formData.append("address", input.address);
    formData.append("skills", JSON.stringify(skills));
    if (input.file) {
      formData.append("avatar", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/register-jobseeker`,
        formData,
        {
          withCredentials: true
        }
      );
      
      if (res.data.success) {
        // Extract user data from response
        const userData = res.data.data?.user;
        
        if (userData) {
          // Create a complete user object with all needed data
          const fullUserData = {
            ...userData,
            jobseeker: res.data.data?.jobSeeker,
            token: res.data.data?.token,
          };
          
          // Save user to Redux
          dispatch(setUser(fullUserData));
          
          // Navigate to home page
          navigate("/");
          toast.success("Registration successful! Welcome to CareerVibe");
        } else {
          // Fallback if user data is missing
          navigate("/login");
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Form */}
            <div className="w-full md:w-3/5 p-6 sm:p-8">
              <div className="flex justify-center mb-4">
                <img src="/src/assets/logo.png" alt="CareerVibe" className="h-10" />
              </div>
              
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                <p className="text-gray-600 mt-1">Join thousands of job seekers finding their dream careers</p>
              </div>
              
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      1
                    </div>
                    <div className={`h-1 w-16 ${formStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      2
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-2">
                  <div className="text-xs text-gray-600 w-24 text-center">Personal Info</div>
                  <div className="text-xs text-gray-600 w-24 text-center">Account Setup</div>
                </div>
              </div>
              
              <form onSubmit={submitHandler} className="space-y-4">
                {formStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="fullname"
                            name="fullname"
                            type="text"
                            required
                            value={input.fullname}
                            onChange={changeEventHandler}
                            className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <AtSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={input.email}
                            onChange={changeEventHandler}
                            className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            required
                            value={input.phone}
                            onChange={changeEventHandler}
                            className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            required
                            value={input.address}
                            onChange={changeEventHandler}
                            className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="123 Main St, City, Country"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Continue to Account Setup
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {formStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={input.password}
                            onChange={changeEventHandler}
                            className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                        
                        {/* Password strength indicator */}
                        {input.password && (
                          <div className="mt-2">
                            <div className="flex gap-1">
                              {[...Array(4)].map((_, index) => (
                                <div 
                                  key={index} 
                                  className={`h-1.5 flex-1 rounded-full ${
                                    index < passwordStrength 
                                      ? passwordStrength === 1 ? 'bg-red-500' 
                                        : passwordStrength === 2 ? 'bg-orange-500'
                                        : passwordStrength === 3 ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                      : 'bg-gray-200'
                                  }`}
                                ></div>
                              ))}
                            </div>
                            <p className="text-xs mt-1 text-gray-600">
                              {passwordStrength === 0 && "Enter a password"}
                              {passwordStrength === 1 && "Password is weak"}
                              {passwordStrength === 2 && "Password is fair"}
                              {passwordStrength === 3 && "Password is good"}
                              {passwordStrength === 4 && "Password is strong"}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="repassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="repassword"
                            name="repassword"
                            type={showPassword ? "text" : "password"}
                            required
                            value={input.repassword}
                            onChange={changeEventHandler}
                            className={`pl-10 w-full py-3 px-4 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              input.password && input.repassword && input.password !== input.repassword 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </div>
                        {input.password && input.repassword && input.password !== input.repassword && (
                          <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Picture
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <label 
                              htmlFor="avatar-upload" 
                              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Avatar
                            </label>
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              onChange={ChangeFilehandler}
                              className="sr-only"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, PNG or GIF. Max size 2MB.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Skills
                        </label>
                        <div className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 flex flex-wrap gap-2 min-h-[48px] transition-colors">
                          {skills.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                              {skill}
                              <button
                                type="button"
                                className="ml-1.5 text-blue-600 hover:text-blue-800"
                                onClick={() => removeSkill(index)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          <input
                            className="flex-grow bg-transparent outline-none text-sm px-2 py-1"
                            type="text"
                            placeholder="Type skill and press Enter"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                          />
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1.5">Popular skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {popularSkills.map((skill, index) => (
                              <button
                                key={index}
                                type="button"
                                className="px-2 py-1 text-xs border border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-full flex items-center"
                                onClick={() => addPopularSkill(skill)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex space-x-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="w-1/2 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-1/2 flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
            
            {/* Right Side - Info/Branding */}
            <div className="hidden md:block md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M38.9,-66.5C53.5,-59.8,70.4,-54.9,77.7,-43.5C85,-32.1,82.8,-14,79.3,2.1C75.7,18.1,70.8,32.2,62.6,44.4C54.3,56.6,42.7,66.8,29.1,73.4C15.6,80,0.2,82.9,-14.6,79.5C-29.4,76.1,-43.6,66.2,-56.7,54.3C-69.8,42.3,-81.9,28.2,-84.8,12.5C-87.7,-3.3,-81.4,-20.7,-72.2,-35.8C-63,-50.9,-50.9,-63.6,-37.3,-70.9C-23.7,-78.2,-8.5,-79.9,2.4,-83.9C13.3,-87.9,24.4,-94.2,35.9,-85.9C47.4,-77.6,59.3,-54.8,60.1,-41.9C60.9,-29,50.6,-25.9,38.9,-19.7C27.1,-13.5,13.6,-4.3,4.9,5.1C-3.7,14.5,-7.4,24.1,-8.4,43.9C-9.3,63.8,-7.3,94,-17.8,102.4C-28.2,110.9,-51.2,97.6,-58.7,79.1C-66.1,60.6,-58.1,36.9,-59.8,16.2C-61.5,-4.4,-73,-22.1,-71.5,-36.4C-70,-50.7,-55.6,-61.7,-41.4,-67.8C-27.3,-73.9,-13.6,-75,-0.8,-73.5C11.9,-72.1,23.8,-68,38.9,-66.5Z" transform="translate(100 100)" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <img src="/src/assets/logo-white.png" alt="CareerVibe" className="h-8" />
                </div>
                
                <h2 className="text-3xl font-bold mb-6">Start Your Career Journey Today</h2>
                <p className="text-blue-100 mb-8">
                  Join thousands of professionals who have found their dream jobs through CareerVibe. Our AI-powered platform matches your skills with the perfect opportunities.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Personalized Job Recommendations</h3>
                      <p className="text-blue-100 text-sm">Get job matches based on your skills, experience, and preferences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Easy Application Process</h3>
                      <p className="text-blue-100 text-sm">Apply to jobs with just one click using your CareerVibe profile</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Career Development Tools</h3>
                      <p className="text-blue-100 text-sm">Access resources to help you grow professionally</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                    <div>
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <p className="text-sm text-blue-100">UX Designer at Adobe</p>
                    </div>
                  </div>
                  <p className="italic text-blue-50">
                    "CareerVibe helped me find my dream job in just 2 weeks! The platform is intuitive and the job matches were spot on with my skills and career goals."
                  </p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 opacity-10">
                <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M39.5,-65.3C50.4,-57.9,58.4,-45.8,62.9,-32.9C67.4,-20,68.5,-6.2,68,8.1C67.6,22.4,65.7,37.2,58.4,49.8C51.1,62.4,38.5,72.8,23.8,77.7C9.1,82.6,-7.7,82,-23.1,77.4C-38.5,72.8,-52.6,64.2,-63.1,51.8C-73.6,39.4,-80.6,23.1,-80.6,7C-80.5,-9.1,-73.4,-25,-64.3,-38.7C-55.3,-52.4,-44.2,-63.8,-31.2,-70.2C-18.2,-76.6,-3.2,-77.9,9.8,-73.8C22.7,-69.8,45.5,-60.5,39.5,-53.5C33.6,-46.5,8.9,-42,0.9,-40.6C-7.1,-39.2,-0.7,-40.9,7.6,-38.8C15.9,-36.8,26.2,-31,39.5,-33.6C52.7,-36.2,69,-47.3,67.8,-52.9C66.6,-58.6,47.8,-58.8,33.5,-65.4C19.1,-72,9.6,-85.1,-0.7,-86.3C-11,-87.4,-22.1,-76.6,-32.2,-66.2C-42.4,-55.9,-51.8,-46.1,-55.4,-34.6C-59,-23.1,-56.9,-10,-57.3,3.8C-57.8,17.6,-60.8,32.9,-55.7,42.5C-50.5,52.1,-37.2,56,-25.3,61.7C-13.4,67.4,-2.9,74.8,3.6,71.2C10,67.7,12.3,53.1,19.6,47.4C26.9,41.7,39.1,44.9,44.9,41C50.7,37.1,50.1,26.1,52.4,17.8C54.7,9.5,59.9,3.9,61.4,-2.8C62.9,-9.4,60.6,-17.1,58,-25.3C55.3,-33.5,52.3,-42.2,45.7,-47.7C39,-53.3,28.7,-55.8,19.7,-62.7C10.8,-69.7,3.2,-81.1,-6.1,-83.7C-15.5,-86.3,-26.6,-80.2,-37.5,-73.2C-48.3,-66.2,-58.8,-58.4,-62.9,-47.3C-67,-36.3,-64.7,-22.1,-65.3,-8.2C-65.8,5.8,-69.2,19.4,-66.3,31C-63.4,42.6,-54.2,52.2,-43.6,61C-33,69.8,-21,77.7,-7.4,79.9C6.2,82.1,21.4,78.6,31.4,69.8C41.3,61,46.1,46.9,54.5,35.4C62.9,23.9,74.9,15,77.2,3.8C79.6,-7.5,72.3,-21,66.1,-34.9C59.9,-48.7,54.8,-62.9,44.5,-67.8C34.3,-72.8,19,-68.5,3.8,-74.7C-11.3,-80.9,-26.4,-97.5,-35.6,-97.8C-44.9,-98.1,-48.4,-82.2,-56.3,-69.9C-64.3,-57.7,-76.8,-49.1,-78.9,-37.6C-81,-26,-72.8,-11.6,-68.7,1.5C-64.6,14.6,-64.7,26.4,-61.6,38.6C-58.4,50.7,-52.1,63.1,-42.3,68.8C-32.4,74.6,-19.1,73.7,-6.5,72.5C6.1,71.3,18.2,69.8,32.5,68.7C46.8,67.7,63.3,67.1,67.9,58.4C72.5,49.7,65.3,33,65.1,19.4C64.9,5.8,71.7,-4.8,72.5,-16.1C73.3,-27.4,68.1,-39.4,59.4,-48.8C50.8,-58.2,38.7,-65,29.3,-75.8C20,-86.6,13.4,-101.3,2.7,-103C-8,-104.6,-22.9,-93.2,-31.9,-79.3C-40.9,-65.5,-43.9,-49.2,-51.5,-36.3C-59,-23.4,-71.1,-13.9,-74.8,-2.1C-78.6,9.7,-74,23.8,-64.9,32.4C-55.9,41,-42.3,44.2,-31.5,52.1C-20.7,60.1,-12.6,72.9,-2.4,76.4C7.9,79.9,20.2,74.1,30.9,66.3C41.5,58.6,50.6,49,56.2,37.4C61.9,25.8,64.1,12.3,63.8,-0.9C63.5,-14.2,60.7,-27.1,54.9,-38.6C49.1,-50.1,40.3,-60.1,29.7,-66.7C19,-73.3,6.4,-76.6,-7.4,-79.3C-21.1,-82,-36,-84.2,-43.9,-77.2C-51.8,-70.3,-52.6,-54.3,-55.8,-40.8C-59,-27.3,-64.5,-16.3,-63.3,-6.2C-62.1,3.9,-54.2,12.9,-52.4,27.2C-50.7,41.5,-55.1,61,-48.4,67.2C-41.7,73.4,-23.8,66.2,-7.3,64.7C9.2,63.2,24.2,67.5,38.1,63.8C52,60.1,64.8,48.5,69.8,34.5C74.8,20.5,72,4.1,70.9,-13.1C69.8,-30.2,70.3,-48.1,63.1,-61.2C55.8,-74.3,40.8,-82.6,27.2,-83.3C13.7,-84,1.6,-77,-9.8,-70.8C-21.2,-64.7,-32,-59.3,-44.3,-53.9C-56.7,-48.4,-70.6,-42.9,-73.7,-33.5C-76.7,-24.1,-68.8,-10.7,-67.3,2.7C-65.7,16,-70.4,29.3,-65.9,36.6C-61.4,43.9,-47.7,45.2,-36.2,49.4C-24.8,53.6,-15.6,60.8,-4.2,66.4C7.1,72,20.6,76.1,32.1,71.5C43.6,66.9,53.1,53.7,60.2,40.4C67.4,27.1,72.1,13.6,73.3,-0.1C74.4,-13.8,71.9,-27.7,65.2,-38C58.5,-48.3,47.7,-55,38.3,-64.5C28.9,-73.9,21,-86,8.2,-89.3C-4.6,-92.5,-22.4,-86.8,-38.4,-79.4C-54.5,-72,-68.8,-62.9,-69.9,-49.3C-71,-35.8,-59,-17.9,-59.2,-0.1C-59.5,17.7,-72.1,35.4,-71.2,49.8C-70.3,64.2,-55.8,75.2,-41,74.3C-26.2,73.3,-11.1,60.4,2.3,54.4C15.8,48.5,27.6,49.6,43.3,47.9C59.1,46.3,78.8,42,85.2,31.1C91.6,20.2,84.6,2.7,80.8,-13.8C77,-30.4,76.5,-46,68,-55.1C59.5,-64.2,43.1,-66.8,31.6,-74.9C20.1,-83.1,13.5,-96.8,2.5,-100.5C-8.5,-104.2,-24,-97.9,-37.7,-90.3C-51.5,-82.8,-63.6,-74.1,-67.5,-62C-71.4,-49.9,-67.2,-34.4,-66.8,-20.2C-66.4,-6,-69.8,7,-69.5,21.4C-69.1,35.9,-65.1,51.9,-55.6,62.8C-46.2,73.7,-31.4,79.5,-16.4,79.6C-1.4,79.8,13.9,74.3,27.8,67.5C41.6,60.7,54.1,52.7,61.8,41.2C69.5,29.8,72.3,15,76.6,-0.6C80.8,-16.1,86.4,-32.2,80.2,-42.2C73.9,-52.2,55.8,-56.1,40.6,-57.8C25.4,-59.6,13.1,-59.2,-0.1,-59.3C-13.3,-59.4,-27.6,-60,-36.7,-54.3C-45.8,-48.6,-49.8,-36.7,-55.5,-25.2C-61.2,-13.7,-68.7,-2.7,-68.1,8.3C-67.6,19.3,-59.1,30.3,-48.9,37.8C-38.7,45.3,-26.8,49.2,-14.7,53.8C-2.6,58.4,9.7,63.7,20.2,61.5C30.7,59.2,39.5,49.4,47.9,38.9C56.3,28.5,64.4,17.4,65.3,5.1C66.2,-7.2,60,-20.6,52.2,-32C44.4,-43.4,35,-52.8,24.1,-59.7C13.3,-66.6,1.1,-71,-12.3,-73.8C-25.7,-76.7,-40.3,-78.1,-52.4,-72.2C-64.5,-66.3,-74.1,-53.2,-74.8,-39.6C-75.6,-26,-67.5,-12,-65.3,1.6C-63.1,15.2,-66.7,28.5,-64.2,41.4C-61.7,54.4,-53,67.1,-41.5,73.3C-30,79.6,-15,79.4,-1.8,76.8C11.4,74.2,22.9,69.2,35,64.2C47.2,59.2,60.1,54.1,69.7,44.3C79.3,34.5,85.7,19.9,84.6,5.9C83.6,-8.1,75.1,-21.5,70.1,-37.5C65.1,-53.5,63.6,-72.1,53.5,-79.1C43.5,-86,24.9,-81.4,8.1,-82C-8.6,-82.6,-23.6,-88.4,-39.3,-86.7C-55,-85.1,-71.4,-76,-80.5,-62.3C-89.6,-48.6,-91.4,-30.3,-91.5,-12.7C-91.6,4.9,-89.9,22,-82.7,36.1C-75.6,50.3,-63,61.6,-48.8,68.2C-34.5,74.8,-18.7,76.8,-4.1,74.9C10.5,73.1,23.7,67.5,34.7,59.5C45.7,51.5,54.4,41.1,60.7,29.4C67,17.7,70.9,4.7,74.7,-10.3C78.5,-25.2,82.2,-42.1,77.1,-55.9C72,-69.7,58.1,-80.3,43.1,-83.3C28.1,-86.2,12,-81.5,-2.3,-76.6C-16.5,-71.8,-28.9,-66.8,-42.7,-62.2C-56.5,-57.5,-71.7,-53.2,-78,-43.7C-84.2,-34.1,-81.6,-19.3,-79.7,-5.9C-77.8,7.5,-76.6,19.5,-72.2,31.3C-67.8,43.1,-60.2,54.6,-49.6,60.9C-38.9,67.2,-25.3,68.3,-12.8,70.6C-0.4,72.9,11,76.3,23.8,74.6C36.7,72.9,51,66.1,60.9,55.4C70.8,44.8,76.3,30.3,77.6,15.3C78.8,0.4,75.9,-14.9,70.8,-29.4C65.7,-43.9,58.4,-57.6,47.6,-69.9C36.8,-82.2,22.5,-93.2,8.3,-93.3C-5.9,-93.4,-19.1,-82.7,-32,-73.6C-44.9,-64.6,-57.5,-57.2,-65,-46.2C-72.6,-35.2,-75.1,-20.7,-76.1,-6.3C-77.1,8,-76.7,22.2,-68.5,30.3C-60.4,38.4,-44.6,40.4,-32.2,47.1C-19.8,53.8,-10.8,65.2,0.5,66.1C11.8,67,25.4,57.4,36,48.6C46.6,39.8,54.1,31.9,59.5,22" transform="translate(100 100)" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;