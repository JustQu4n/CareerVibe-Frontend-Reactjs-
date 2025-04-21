import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
//import { toast } from "sonner";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

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
 
  const [showPassword, setShowPassword] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const popularSkills = [
    "React",
    "NodeJS",
    "Docker",
    "SQL",
    "MongoDB",
    "AWS",
    "Python",
    "JavaScript",
  ];

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

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading } = useSelector((store) => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const ChangeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    if (input.password !== input.repassword) {
      toast.error("Passwords do not match");
      return;
    }

    e.preventDefault();

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
    console.log(
      formData.forEach((value, key) => {
        console.log(key, value);
      })
    );
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
        console.log("Registration successful:", res.data);
        
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
          
          // Navigate to home page instead of login
          navigate("/");
          toast.success("Registration successful! Welcome to JobPortal");
        } else {
          // Fallback if user data is missing
          navigate("/login");
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response
        ? error.response.data.message
        : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Navbar></Navbar>
      <form onSubmit={submitHandler}>
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
          <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
            <div className="lg:w-1/2 xl:w-5/12 p-6">
              <div>
                <img
                  src="https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0"
                  alt="Logo"
                  className="w-32 mx-auto"
                />
              </div>
              <div className="mt-12 flex flex-col items-center">
                <h1 className="text-2xl xl:text-2xl font-bold">
                 Create an new JobSeeker account
                </h1>
                <div className="w-full flex-1 mt-8">
                  <div className="mx-auto max-w-md">
                    <input
                      className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      name="fullname"
                      onChange={changeEventHandler}
                      value={input.fullname}
                      placeholder="Full Name"
                    />
                    <input
                      className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="email"
                      name="email"
                      onChange={changeEventHandler}
                      value={input.email}
                      placeholder="Email"
                    />
                    <input
                      className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="text"
                      name="phone"
                      onChange={changeEventHandler}
                      value={input.phone}
                      placeholder="Phone Number"
                    />
                    <input
                      className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="text"
                      name="address"
                      onChange={changeEventHandler}
                      value={input.address}
                      placeholder="Address"
                    />
                    <div className="relative w-full mt-5">
                      <input
                        className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 01.175-1.875M6.343 6.343A9.953 9.953 0 0112 4c5.523 0 10 4.477 10 10a9.953 9.953 0 01-2.343 6.343M4 4l16 16"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="relative w-full mt-5">
                      <input
                        className="w-full px-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type={showPassword ? "text" : "password"}
                        name="repassword"
                        value={input.repassword}
                        onChange={changeEventHandler}
                        placeholder="Re-Password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 01.175-1.875M6.343 6.343A9.953 9.953 0 0112 4c5.523 0 10 4.477 10 10a9.953 9.953 0 01-2.343 6.343M4 4l16 16"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="mt-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Avatar
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        name="file"
                        onChange={ChangeFilehandler}
                        className="w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      />
                    </div>

                    <label className="block text-sm font-medium text-gray-700 mt-5 mb-1">
                      Skills
                    </label>
                    <div className="w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus-within:outline-none focus-within:border-gray-400 focus-within:bg-white flex flex-wrap gap-2 min-h-[48px]">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-indigo-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                        >
                          {skill}
                          <button
                            type="button"
                            className="ml-2 text-gray-600 hover:text-red-600"
                            onClick={() => removeSkill(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <input
                        className="flex-grow bg-transparent outline-none text-sm px-2 py-1"
                        type="text"
                        placeholder="Type and press Enter"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                      />
                    </div>

                    {/* Gợi ý kỹ năng phổ biến */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {popularSkills.map((skill, index) => (
                        <button
                          key={index}
                          type="button"
                          className="px-3 py-1 text-xs bg-gray-200 hover:bg-indigo-400 hover:text-white rounded-full"
                          onClick={() => addPopularSkill(skill)}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          <span className="ml-3">Registering...</span>
                        </>
                      ) : (
                        <span className="ml-3">Register</span>
                      )}
                    </button>

                    <div className="flex justify-center mt-2 text-1xs text-gray-500">
                      <p>
                        <Link
                          to="/login"
                          className="hover:text-gray-700 text-blue-600"
                        >
                          Already have an account? Login
                        </Link>
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-gray-600 text-center">
                    By signing up, you agree to our{" "}
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center hidden lg:flex">
              <div
                className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
