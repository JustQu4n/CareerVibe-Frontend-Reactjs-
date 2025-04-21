import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";


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
        const ChangeFilehandler = (e) => {
          setInput({ ...input, file: e.target.files?.[0] });
        };
      
        const submitHandler = async (e) => {
          e.preventDefault();
      
          try {
            dispatch(setLoading(true)); // Start loading
            const res = await axios.post(
              `${USER_API_ENDPOINT}/login-employer`,
              input,
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );
            if (res.data.success) {
              console.log("Full response data:", res.data); // Log the entire response
      
              // Access the nested user data correctly
              const userData = res.data.data?.user;
              console.log("User data extracted:", userData);
      
              if (userData) {
                // Also include the jobSeeker data to have full profile info
                const fullUserData = {
                  ...userData,
                  employer: res.data.data?.employer,
                  token: res.data.data?.token,
                };
                console.log("Full user data:", fullUserData); // Log the full user data
      
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
            toast.error("Login failed");
          } finally {
            dispatch(setLoading(false)); // End loading
          }
        };
      
        useEffect(() => {
          if (user) {
            navigate("/");
          }
        }, []);
  // return (
  //   <div>
  //     <Navbar />
  //     <div className="p-10 text-black bg-blue-50 pb-12 h-full rounded-l-2xl">
  //       <h1 className="text-4xl font-bold mb-6">
  //         Tuyển dụng dễ dàng cùng FindJob
  //       </h1>
  //       <p className="text-lg">
  //         Chúng tôi giúp nhà tuyển dụng kết nối nhanh chóng với ứng viên tiềm
  //         năng trong lĩnh vực IT. Nền tảng hỗ trợ đăng tin tuyển dụng, quản lý
  //         ứng viên và hơn thế nữa.
  //       </p>
  //      <Link to={"/login-recruiter"}><h1>Login Recruiter</h1></Link>
  //     </div>
  //   </div>
  // );
  return (
    <div>
      <Navbar></Navbar>

      <form onSubmit={submitHandler}>
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
          <div className=" m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="flex-1  text-center hidden lg:flex">
              <div
                className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0')",
                }}
              ></div>
            </div>
            <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
              <div>
                <img
                  src="https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0"
                  alt="Logo"
                  className="w-32 mx-auto"
                />
              </div>
              <div className="mt-12 flex flex-col items-center">
                <h1 className="text-2xl xl:text-2xl font-bold">
                  Login for Employee
                </h1>
                <div className="w-full flex-1 mt-8">
                  <div className="mx-auto max-w-lg">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="Email"
                    />
                    <div className="relative w-full mt-5">
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
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
                          <span className="ml-3">Login...</span>
                        </>
                      ) : (
                        <span className="ml-3">Login</span>
                      )}
                    </button>
                    <div className="flex place-content-between mt-1">
                      <p className="mt-2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                        <Link to="/forgot-password">Forgot Password?</Link>
                      </p>
                      <p className="mt-2 text-xs text-blue-600 hover:text-gray-700 cursor-pointer">
                        <Link to="/register-recruiter">Create new Account</Link>
                      </p>
                    </div>
                  </div>

                  <div className="my-12 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                      Or sign up with
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center transition duration-300 hover:shadow-lg focus:outline-none">
                      <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </button>

                    <button className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center transition duration-300 hover:shadow-lg focus:outline-none">
                      <svg className="w-6 h-6" viewBox="0 0 32 32">
                        <path
                          fillRule="evenodd"
                          d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by templatana's{" "}
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Terms of Service
                    </a>{" "}
                    and its{" "}
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

          </div>
        </div>
      </form>
    </div>
  );
};

export default RecruiterSite;
