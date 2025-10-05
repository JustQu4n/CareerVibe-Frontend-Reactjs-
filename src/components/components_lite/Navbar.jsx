import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  LogOut,
  Star,
  User2,
  BellRing,
  FileUser,
  CircleUser,
  FileText,
  X,
  MessageSquare,
  Calendar,
  Menu,
  X as Close,
} from "lucide-react";
import { BriefcaseBusiness } from "lucide-react";
import { Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios"; // Import axios
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";
import ThemeToggle from "./ThemeToggle";

const NavLink = ({ to, children }) => (
  <Link to={to} className="nav-link text-sm md:text-base px-1 py-1">
    {children}
  </Link>
);

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (res && res.data && res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      } else {
        console.error("Error logging out:", res.data);
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Axios error:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  const primaryLinks = (
    <>
      {user && user.role === "Recruiter" ? (
        <>
          <li>
            <NavLink to="/admin/companies">Companies</NavLink>
          </li>
          <li>
            <NavLink to="/admin/jobs">Jobs</NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/Home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/Browse">Browse</NavLink>
          </li>
          <li>
            <NavLink to="/">Jobs</NavLink>
          </li>
          <li>
            <NavLink to="/cv-tools">Career Tools</NavLink>
          </li>
          <li>
            <NavLink to="/RecruiteSite">Recruiter site</NavLink>
          </li>
          <li>
            <NavLink to="/Creator">About</NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="CareerVibe home" className="flex items-center">
              <img
                src="/vite.svg"
                alt="CareerVibe"
                className="h-8 w-auto sm:h-10"
              />
              <span className="ml-2 hidden md:inline text-lg font-semibold text-gray-800">
                CareerVibe
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            <ul className="flex items-center gap-8">{primaryLinks}</ul>
          </nav>

          <div className="flex items-center gap-4">
            {!user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">
                    <span className="font-semibold">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transform hover:-translate-y-0.5 transition-transform">
                    <span className="font-semibold">Register</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <ThemeToggle className="hidden sm:inline-flex" />

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      aria-label="Open notifications"
                      className="relative p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <BellRing className="h-6 w-6 text-gray-600" />
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-[10px] text-white font-bold">
                        3
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0 shadow-lg border-gray-200 overflow-hidden">
                    {/* ...existing notification content... */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Notifications</h2>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">3 new</span>
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Mark all as read</button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      <div className="divide-y divide-gray-100">
                        <div className="relative py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <FileText className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-gray-900 mr-2">New job application received</p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">2 mins ago</span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">A new candidate has applied for Front-end Developer position</p>
                              <div className="mt-2 flex items-center justify-between">
                                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">View application</button>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* other notifications */}
                        <div className="relative py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="h-9 w-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                <MessageSquare className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-gray-900 mr-2">New message from recruiter</p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">5 mins ago</span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">John Smith sent you a message about your application</p>
                            </div>
                          </div>
                        </div>
                        <div className="relative py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="h-9 w-9 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Calendar className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-gray-900 mr-2">Interview scheduled for next week</p>
                                <span className="text-xs text-gray-500 whitespace-nowrap">10 mins ago</span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">Your interview with Google is scheduled for Monday, 10:00 AM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-center">
                      <button className="text-sm text-gray-600 hover:text-indigo-700 font-medium transition-colors">View all notifications</button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-3 focus:outline-none">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          className="object-cover"
                          src={user?.jobseeker?.avatar || user?.employer?.avatar || "https://avatar.iran.liara.run/public/boy"}
                          alt="profile"
                        />
                      </Avatar>
                      <div className="hidden sm:flex flex-col text-left">
                        <span className="font-semibold text-sm">{user?.jobseeker?.full_name || user?.employer?.full_name}</span>
                        <span className="text-xs text-muted-foreground">{user?.role === "job_seeker" ? "JobSeeker" : "Recruiter"}</span>
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="flex items-center gap-4 space-y-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          className="object-cover"
                          src={user?.jobseeker?.avatar || user?.employer?.avatar || "https://avatar.iran.liara.run/public/boy"}
                          alt="@shadcn"
                        />
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user?.jobseeker?.full_name || user?.employer?.full_name}</h3>
                        <p className="text-sm text-muted-foreground max-w-[200px] truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col my-2 text-gray-600">
                      {user && user.role === "job_seeker" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <CircleUser size={28} strokeWidth={1.75} />
                          <Button variant="link"><Link to="/profile">Profile</Link></Button>
                        </div>
                      )}
                      {user && user.role === "job_seeker" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <FileUser size={28} strokeWidth={1.75} />
                          <Button variant="link"><Link to="/jobseeker-applications">Manager Applications</Link></Button>
                        </div>
                      )}
                      {user && user.role === "job_seeker" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <Star size={28} strokeWidth={1.75} />
                          <Button variant="link"><Link to="/save-items">Your Saved Jobs</Link></Button>
                        </div>
                      )}
                      {user && user.role === "employer" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <Building2 size={28} strokeWidth={1.75} />
                          <Button variant="link"><Link to="/admin/companies">Your Company</Link></Button>
                        </div>
                      )}
                      {user?.role === "employer" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <BriefcaseBusiness size={28} strokeWidth={1.75} />
                          <Button variant="link"><Link to="/admin/jobs">Your Job Posts</Link></Button>
                        </div>
                      )}
                      {user && user.role === "employer" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <FileUser size={28} strokeWidth={1.75} />
                          <Button variant="link"><Link to="/admin/jobs/applicants">Management Application</Link></Button>
                        </div>
                      )}
                      {user && user.role === "employer" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer">
                          <FileUser size={28} strokeWidth={1.75} />
                          <Button variant="link"><Link to="/admin/jobs/job-matching-dashboard">Managemnt Resumers</Link></Button>
                        </div>
                      )}

                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <LogOut size={28} strokeWidth={1.75} />
                        <Button onClick={logoutHandler} variant="link">Logout</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen((s) => !s)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {!mobileOpen ? <Menu className="h-6 w-6" /> : <Close className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 mobile-panel">
          <div className="px-4 pt-4 pb-6 space-y-4">
            <ul className="flex flex-col gap-3">{primaryLinks}</ul>

            {!user ? (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button className="w-full bg-indigo-600 text-white">Register</Button>
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user?.jobseeker?.avatar || user?.employer?.avatar || "https://avatar.iran.liara.run/public/boy"} />
                  </Avatar>
                  <div>
                    <div className="font-semibold">{user?.jobseeker?.full_name || user?.employer?.full_name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <Button variant="link" onClick={() => navigate('/profile')}>Profile</Button>
                  <Button variant="link" onClick={logoutHandler}>Logout</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
