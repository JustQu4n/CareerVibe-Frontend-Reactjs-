import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_ENDPOINT, USER_API_ENDPOINT } from "@/utils/data";
//import { toast } from "sonner";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";

const RegisterRecruiter = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    password: "",
    repassword: "",
    company_name: "",
    company_adress: "",
    company_domain: "",
    file: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading } = useSelector((store) => store.auth);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const ChangeFilehandler = (e) => {
    if (input.file) {
      // Revoke the previous URL to avoid memory leaks
      URL.revokeObjectURL(input.file.preview);
    }

    if (e.target.files?.[0]) {
      setInput({
        ...input,
        file: e.target.files[0],
      });
    }
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
    if(selectedCompany) {
      formData.append("company_id", selectedCompany._id);
      formData.append("is_existing_company", "true");
    } else {
      formData.append("company_name", input.company_name);
      formData.append("company_domain", input.company_domain);
      formData.append("company_address", input.company_adress);
    }
    
    if (input.file) {
      formData.append("logo", input.file);
    }
    console.log(
      formData.forEach((value, key) => {
        console.log(key, value);
      })
    );
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_ENDPOINT}/register-employer`,
        formData,
        {
          withCredentials: true,
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
            jobseeker: res.data.data?.employer,
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
  }, [user, navigate]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input.company_name.length >= 2) {
        axios.get(`${COMPANY_API_ENDPOINT}/name`).then((res) => {
          const allCompanies = res.data.data;
          const matches = allCompanies.filter((c) =>
            c.name.toLowerCase().includes(input.company_name.toLowerCase())
          );
          setSuggestions(matches);
          setShowDropdown(true);
        });
      } else {
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [input.company_name]); // debounce 300ms

  const handleSelect = (company) => {
    setInput((prev) => ({
      ...prev,
      company_name: company.name,
      company_domain: company.email_domain || "",
      company_adress: company.address || "",
      company_logo: company.logo || "",
    }));
    setSelectedCompany(company);
    setShowDropdown(false);
  };
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
                  {step === 1 && "Thông tin nhà tuyển dụng"}
                  {step === 2 && "Thông tin công ty"}
                  {step === 3 && ""}
                </h1>
                <div className="w-full flex-1 mt-8">
                  {step === 1 && (
                    <>
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

                        {/* <div className="mt-5">
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
                        </div> */}

                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        >
                          Tiếp theo
                        </button>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="relative mb-5">
                        <input
                          className="w-full px-5 py-4 rounded-lg mb-2 font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                          type="text"
                          name="company_name"
                          onChange={(e) => {
                            changeEventHandler(e);
                            setSelectedCompany(null); // Reset selected company when typing
                          }}
                          value={input.company_name}
                          placeholder="Company Name"
                          autoComplete="off"
                        />
                        {showDropdown && suggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-48 overflow-y-auto rounded shadow-lg">
                            {suggestions.map((company) => (
                              <li
                                key={company._id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-3"
                                onClick={() => handleSelect(company)}
                              >
                                {/* Company Logo */}
                                <div className="w-8 h-8 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                  {company.logo ? (
                                    <img
                                      src={company.logo}
                                      alt={`${company.name} logo`}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "https://via.placeholder.com/32?text=" +
                                          company.name.charAt(0);
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-semibold">
                                      {company.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <span>{company.name}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {selectedCompany ? (
                        // Hiển thị thông tin công ty đã chọn dưới dạng chỉ đọc
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold text-gray-700">
                              Thông tin công ty đã tồn tại
                            </h3>
                            <button
                              type="button"
                              onClick={() => setSelectedCompany(null)}
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              Thay đổi
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <span className="text-gray-600 col-span-1">
                              Domain:
                            </span>
                            <span className="col-span-2 font-medium">
                              {input.company_domain}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <span className="text-gray-600 col-span-1">
                              Địa chỉ:
                            </span>
                            <span className="col-span-2 font-medium">
                              {input.company_adress}
                            </span>
                          </div>

                          {input.company_logo && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              <span className="text-gray-600 col-span-1">
                                Logo:
                              </span>
                              <div className="col-span-2">
                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                  <img
                                    src={input.company_logo}
                                    alt="Company logo"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Hiển thị form nhập thông tin nếu chưa chọn công ty có sẵn
                        <>
                          <input
                            className="w-full px-5 py-4 mb-6 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="text"
                            name="company_domain"
                            onChange={changeEventHandler}
                            value={input.company_domain}
                            placeholder="Company Domain"
                          />
                          <input
                            className="w-full px-5 py-4 mb-6 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="text"
                            name="company_adress"
                            onChange={changeEventHandler}
                            value={input.company_adress}
                            placeholder="Company Address"
                          />

                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload Logo Company
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              name="file"
                              onChange={ChangeFilehandler}
                              className="w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            />
                            {input.file && (
                              <div className="mt-2">
                                <div className="relative w-24 h-24 mx-auto border rounded-lg overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(input.file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onLoad={(e) => {
                                      URL.revokeObjectURL(e.target.src);
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-center mt-1 text-gray-500">
                                  {input.file.name}
                                </p>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between gap-4 mt-5">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="tracking-wide font-semibold bg-gray-500 text-gray-100 w-1/3 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Quay lại
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="w-1/3 py-3 tracking-wide font-semibold bg-indigo-500 text-gray-100 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        >
                          Tiếp theo
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <div className="mx-auto max-w-md text-center">
                        <div className="flex justify-center mb-6">
                          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-16 w-16 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>

                        <h2 className="text-xl font-bold mb-6">
                          Xác nhận thông tin của bạn
                        </h2>

                        <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                            Thông tin cá nhân
                          </h3>
                          <div className="grid grid-cols-3 gap-1 mb-1">
                            <span className="text-gray-600 col-span-1">
                              Họ tên:
                            </span>
                            <span className="font-medium col-span-2">
                              {input.fullname}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-1">
                            <span className="text-gray-600 col-span-1">
                              Email:
                            </span>
                            <span className="font-medium col-span-2">
                              {input.email}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                          <h3 className="font-semibold text-gray-700 border-b pb-2 mb-3">
                            Thông tin công ty
                          </h3>
                          <div className="grid grid-cols-3 gap-1 mb-1">
                            <span className="text-gray-600 col-span-1">
                              Tên công ty:
                            </span>
                            <span className="font-medium col-span-2">
                              {input.company_name}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-1">
                            <span className="text-gray-600 col-span-1">
                              Địa chỉ:
                            </span>
                            <span className="font-medium col-span-2">
                              {input.company_adress}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-1">
                            <span className="text-gray-600 col-span-1">
                              Mô tả:
                            </span>
                            <span className="font-medium col-span-2">
                              {input.company_domain}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1 mb-1">
                            <span className="text-gray-600 col-span-1">
                              Hình ảnh:
                            </span>
                            <span className="font-medium col-span-2 max-w-[300px] truncate">
                              {input.file ? input.file.name : <div className="col-span-2">
                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                  <img
                                    src={input.company_logo}
                                    alt="Company logo"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>}
                            </span>
                            
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-6">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="tracking-wide font-semibold bg-gray-500 text-gray-100 w-1/3 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Quay lại
                          </button>
                          <button
                            type="submit"
                            className="tracking-wide font-semibold bg-indigo-500 text-gray-100 w-1/3 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
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
                                <span className="ml-2">Đang xử lý...</span>
                              </>
                            ) : (
                              <>
                                <span>Xác nhận</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 ml-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-center mt-6 text-1xs text-gray-500">
                    <p>
                      <Link
                        to="/RecruiteSite"
                        className="hover:text-gray-700 text-blue-600"
                      >
                        Already have an account? Login
                      </Link>
                    </p>
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
            {/* <div className="flex-1 text-center hidden lg:flex">
              <div
                className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0')",
                }}
              ></div>
            </div> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterRecruiter;
