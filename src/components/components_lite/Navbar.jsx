import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { BriefcaseBusiness, BellRing } from "lucide-react";
import { FileUser } from "lucide-react";
import { CircleUser } from "lucide-react";
import { Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios"; // Import axios
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
      }
    } catch (error) {
      console.error("Axios error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      toast.error("Error logging out. Please try again.");
    }
  };
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
            {/* <span className="text-[#140f5f]"> Career </span>{" "}
            <span className="text-[#000000]">Vibe</span> */}
            <img
              src="https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0"
              alt="Logo"
              className="w-32 mx-auto"
            />
          </h1>
        </div>
        <div className="flex items-center gap-10">
          <ul className="flex font-semibold text-lg items-center gap-6">
            {user && user.role === "Recruiter" ? (
              <>
                <li>
                  <Link to={"/admin/companies"}>Companies</Link>
                </li>
                <li>
                  <Link to={"/admin/jobs"}>Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  {" "}
                  <Link to={"/Home"}>Home</Link>
                </li>
                <li>
                  {" "}
                  <Link to={"/Browse"}>Browse</Link>{" "}
                </li>
                <li>
                  {" "}
                  <Link to={"/"}>Jobs</Link>
                </li>
                <li>
                  {" "}
                  <Link to={"/cv-tools"}>Career Tools</Link>
                </li>
                <li>
                  {" "}
                  <Link to={"/RecruiteSite"}>Recruiter site</Link>
                </li>
                <li>
                  {" "}
                  <Link to={"/Creator"}>About</Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className=" flex items-center gap-2">
              <Link to={"/login"}>
                {" "}
                <Button variant="outline">Login</Button>
              </Link>
              <Link to={"/register"}>
                {" "}
                <Button className="bg-blue-600  hover:bg-blue-700">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Notification Bell (Added) */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <BellRing className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold">
                      3
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-100">
                  <div className="p-4">
                    <h2 className="font-semibold mb-2">Notifications</h2> 
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">  
                        <span>New job application received</span>
                        <span className="text-xs text-gray-500">2 mins ago</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>New message from recruiter</span>
                        <span className="text-xs text-gray-500">5 mins ago</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Interview scheduled for next week</span>
                        <span className="text-xs text-gray-500">10 mins ago</span>
                      </li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <div className="flex items-center gap-3">
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        className="object-cover"
                        src={
                          user?.jobseeker?.avatar ||
                          "https://avatar.iran.liara.run/public/boy"
                        }
                        alt="@shadcn"
                      />
                    </Avatar>
                  </PopoverTrigger>
                  <div>
                    <h3 className="font-semibold">
                      {user?.jobseeker?.full_name || user?.employer?.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user?.role === "job_seeker" ? "JobSeeker" : "Recruiter"}
                    </p>
                  </div>
                </div>
                <PopoverContent className="w-80">
                  <div className="flex items-center gap-4 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        className="object-cover"
                        src={
                          user?.jobseeker?.avatar ||
                          user?.employer?.avatar ||
                          "https://avatar.iran.liara.run/public/boy"
                        }
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {user?.jobseeker?.full_name ||
                          user?.employer?.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col my-2 text-gray-600  ">
                    {user && user.role === "job_seeker" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer ">
                        <CircleUser size={28} strokeWidth={1.75} />
                        <Button variant="link">
                          {" "}
                          <Link to={"/profile"}> Profile</Link>{" "}
                        </Button>
                      </div>
                    )}
                    {user && user.role === "job_seeker" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <FileUser size={28} strokeWidth={1.75} />
                        <Button variant="link">
                          {" "}
                          <Link to={"/jobseeker-applications"}>
                            {" "}
                            Manager Applications
                          </Link>{" "}
                        </Button>
                      </div>
                    )}
                    {user && user.role === "employer" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <Building2 size={28} strokeWidth={1.75} />
                        <Button variant="link">
                          {" "}
                          <Link to={"/admin/companies"}>
                            {" "}
                            Your Company
                          </Link>{" "}
                        </Button>
                      </div>
                    )}
                    {user?.role === "employer" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <BriefcaseBusiness size={28} strokeWidth={1.75} />
                        <Button variant="link">
                          {" "}
                          <Link to={"/admin/jobs"}> Your Job Posts</Link>{" "}
                        </Button>
                      </div>
                    )}
                    {user && user.role === "employer" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <FileUser size={28} strokeWidth={1.75} />
                        <Button variant="link">
                          {" "}
                          <Link to={"/admin/jobs/applicants"}>
                            Management Application
                          </Link>{" "}
                        </Button>
                      </div>
                    )}

                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut size={28} strokeWidth={1.75}></LogOut>
                      <Button onClick={logoutHandler} variant="link">
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
