import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components_lite/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { AtSign, LockKeyhole, Eye, EyeOff, ChevronRight, Building2, Users, Briefcase } from "lucide-react";

const RecruiterSite = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/login-employer`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        const userData = res.data.data?.user;
        
        if (userData) {
          const fullUserData = {
            ...userData,
            employer: res.data.data?.employer,
            company: res.data.data?.company,
            token: res.data.data?.token,
          };
          
          dispatch(setUser(fullUserData));

          setTimeout(() => {
            navigate("/");
            toast.success("Login successful");
          }, 300);
        } else {
          toast.warning("User data not found in response");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
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
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left side - Hero content */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke="white" strokeWidth="2" 
                    d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 
                    79.5-69-63M-24 -199L1 -155M-88 -85L-80 -131M1 -155L162 -80M1 -155L-80 -131M1 -155L-69 -63M1 -155L101 -30M1 -155L162 
                    -80M162 -80L294 -63M162 -80L251 -161M162 -80L176 -272M162 -80L294 -63M176 -272L251 -161M-88 -85L-80 -131M-88 -85L-42 
                    -79M-88 -85L-38 -169M-88 -85L1 -155M-69 -63L1 -155M-69 -63L101 -30M-69 -63L-88 -85M101 -30L1 -155M101 -30L162 -80M101 
                    -30L251 -161M101 -30L294 -63M251 -161L294 -63M251 -161L176 -272M-80 -131L1 -155M-80 -131L-42 -79M-80 -131L-38 -169M-38 
                    -169L-42 -79M-38 -169L1 -155M-38 -169L-80 -131M294 -63L162 -80M294 -63L101 -30M-42 -79L-88 -85M-42 -79L-80 -131M-42 -79L-38 -169"
                  />
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold">CareerVibe Recruiters</h2>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Hire the best talent for your team</h1>
                <p className="text-blue-100 mb-8 text-lg">
                  Access our pool of qualified candidates and streamline your hiring process with our powerful recruitment tools.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Access top talent</h3>
                      <p className="text-blue-100">Connect with thousands of qualified professionals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Streamlined hiring</h3>
                      <p className="text-blue-100">Post jobs, review applications, and manage candidates in one place</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="italic text-sm text-blue-50 mb-4">
                    "CareerVibe has transformed our recruitment process. We've reduced our time-to-hire by 40% and found exceptional candidates."
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <h4 className="font-medium">Sarah Thompson</h4>
                      <p className="text-xs text-blue-200">HR Director, TechGrowth Inc.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm"></div>
              </div>
            </div>
            
            {/* Right side - Login form */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <img 
                    src="/src/assets/logo.png" 
                    alt="CareerVibe" 
                    className="h-10 mx-auto mb-4"
                  />
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back, recruiter</h2>
                  <p className="text-gray-600 mt-1">Sign in to access your recruitment dashboard</p>
                </div>
                
                <form onSubmit={submitHandler} className="space-y-6">
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
                        autoComplete="email"
                        required
                        value={input.email}
                        onChange={changeEventHandler}
                        className="pl-10 w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockKeyhole className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
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
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full flex justify-center items-center py-2.5 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                          fill="#4285F4"
                        />
                      </svg>
                      Google
                    </button>
                    
                    <button
                      type="button"
                      className="w-full flex justify-center items-center py-2.5 px-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                          fill="currentColor"
                        />
                      </svg>
                      GitHub
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have a recruiter account?{" "}
                    <Link to="/register-recruiter" className="font-medium text-blue-600 hover:text-blue-800">
                      Sign up now <ChevronRight className="inline h-4 w-4" />
                    </Link>
                  </p>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <p className="text-xs text-center text-gray-500">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterSite;