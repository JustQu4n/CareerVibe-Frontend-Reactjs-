import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetAllCompanies from "@/hooks/usegetAllCompanies";
import { Link } from "react-router-dom";
import {
  Building,
  MapPin,
  Globe,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  Star,
  Award,
  Image as ImageIcon,
  Heart,
  Share2,
  MessageSquare,
  ChevronDown,
  Search,
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const Companies = () => {
  const { user } = useSelector((state) => state.auth);
  const [input, setInput] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  const toggleFollow = () => setIsFollowing(!isFollowing);
  const toggleShowMore = () => setShowMore(!showMore);
  const dispatch = useDispatch();

  // Example job listings data - in a real app, this would come from an API
  const companyJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "$1,500 - $2,500",
      posted: "2 days ago",
      applicants: 12
    },
    {
      id: 2,
      title: "UX/UI Designer",
      location: "Ho Chi Minh City",
      type: "Full-time",
      salary: "$1,200 - $1,800",
      posted: "1 week ago",
      applicants: 24
    },
    {
      id: 3,
      title: "Backend Engineer",
      location: "Remote",
      type: "Full-time",
      salary: "$1,800 - $2,800",
      posted: "3 days ago",
      applicants: 18
    }
  ];

  // Example company stats
  const companyStats = [
    { label: "Employees", value: "1,000 - 4,999", icon: <Users className="h-5 w-5" /> },
    { label: "Founded", value: "29/01/2000", icon: <Calendar className="h-5 w-5" /> },
    { label: "Industry", value: "Manufacturing", icon: <Briefcase className="h-5 w-5" /> },
    { label: "Revenue", value: "$50M - $100M", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  // Example company benefits
  const companyBenefits = [
    "Flexible working hours",
    "Healthcare insurance",
    "Professional development",
    "Team building activities",
    "Annual bonus",
    "Gym membership"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHeaderExpanded ? 'opacity-30' : 'opacity-10'}`}>
          <img 
            src={user?.company?.banner || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"} 
            alt="Company Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto h-full flex items-end px-4 md:px-6">
          <div className="pb-6 md:pb-8 flex flex-col md:flex-row items-center md:items-end">
            <div className="relative -mb-12 md:-mb-1 z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white p-1 shadow-lg overflow-hidden">
                <img
                  src={user?.company?.logo || "https://via.placeholder.com/150"}
                  alt="Company Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            
            <div className="mt-16 md:mt-0 md:ml-8 text-white flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{user?.company?.name || "Company Name"}</h1>
              <div className="flex items-center mt-1 text-blue-100">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{user?.company?.address || "Address not specified"}</span>
              </div>
            </div>
            
            <div className="mt-4 px-6 md:mt-0 flex gap-4">
              <button 
                onClick={toggleFollow} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isFollowing 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-white text-blue-700 hover:bg-blue-50'
                }`}
              >
                {isFollowing ? <CheckCircle className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
        
        <button 
          className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/30 p-1 rounded-full text-white"
          onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
        >
          <ChevronDown className={`h-5 w-5 transition-transform ${isHeaderExpanded ? 'transform rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm  top-16  border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('about')} 
              className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'about' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => setActiveTab('jobs')} 
              className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Jobs
            </button>
            <button 
              onClick={() => setActiveTab('benefits')} 
              className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'benefits' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Benefits
            </button>
            <button 
              onClick={() => setActiveTab('photos')} 
              className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'photos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Photos
            </button>
            <button 
              onClick={() => setActiveTab('reviews')} 
              className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <>
                {/* Company Overview */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Building className="mr-2 text-blue-600 h-5 w-5" />
                      Company Overview
                    </h2>
                    
                    <div className="prose prose-blue max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {showMore ? 
                          `Được thành lập ngày 29/01/2000, khởi đầu từ một công ty chuyên kinh doanh các sản phẩm vật liệu hàn, kim loại màu...
Qua 20 năm hoạt động, đến nay Kim Tín đã phát triển thành 1 tập đoàn gồm hơn 10 công ty thành viên trải dài từ Bắc đến Nam.

Với các sản phẩm dịch vụ có chất lượng cao và khả năng tài chính lành mạnh, tập đoàn Kim Tín đã có uy tín cả trong và ngoài nước
như là một đối tác tin cậy có trình độ và hiệu quả hoạt động cao. Chính vì thế kết quả kinh doanh của tập đoàn đã liên tục phát triển vững chắc
trong thời gian qua.

Đằng sau sự tăng trưởng mạnh mẽ của Kim Tín là sức mạnh và sự đóng góp của hơn 2.500 cán bộ công nhân viên có trình độ cao, năng động, trẻ trung và nhiệt huyết.
Cùng với mục tiêu "Phát triển Kim Tín trở thành một tập đoàn mạnh trong ngành kim khí và gỗ", Kim Tín đã, đang và sẽ đầu tư hàng loạt các dự án mới
trên khắp cả nước, đạt đến tầm nhìn: "THAY ĐỔI ĐỂ PHÁT TRIỂN VÀ TRƯỜNG TỒN"` 
                          : 
                          `Được thành lập ngày 29/01/2000, khởi đầu từ một công ty chuyên kinh doanh các sản phẩm vật liệu hàn, kim loại màu...`
                        }
                      </p>
                    </div>
                    
                    <button
                      className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      onClick={toggleShowMore}
                    >
                      {showMore ? 'Show Less' : 'Read More'}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showMore ? 'transform rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
                
                {/* Company Values */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Award className="mr-2 text-blue-600 h-5 w-5" />
                      Company Values
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="font-semibold text-gray-800 mb-2">Vision</h3>
                        <p className="text-gray-600 text-sm">
                          "THAY ĐỔI ĐỂ PHÁT TRIỂN VÀ TRƯỜNG TỒN"
                        </p>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                        <h3 className="font-semibold text-gray-800 mb-2">Mission</h3>
                        <p className="text-gray-600 text-sm">
                          "Phát triển Kim Tín trở thành một tập đoàn mạnh trong ngành kim khí và gỗ"
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
                        <p className="text-gray-600 text-sm">
                          Luôn đi đầu trong việc ứng dụng công nghệ và đổi mới sáng tạo
                        </p>
                      </div>
                      
                      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                        <h3 className="font-semibold text-gray-800 mb-2">Sustainability</h3>
                        <p className="text-gray-600 text-sm">
                          Cam kết phát triển bền vững và có trách nhiệm với môi trường
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <Briefcase className="mr-2 text-blue-600 h-5 w-5" />
                      Open Positions
                    </h2>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search positions..."
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {companyJobs.map(job => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <Briefcase className="mr-1 h-4 w-4 text-gray-400" />
                              {job.type}
                            </span>
                            <span className="inline-flex items-center text-sm text-gray-600">
                              <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
                              {job.salary}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="text-gray-500">Posted {job.posted}</div>
                            <div className="text-blue-600 font-medium">{job.applicants} applicants</div>
                          </div>
                          
                          <Link 
                            to={`/jobs/${job.id}`}
                            className="flex items-center justify-center whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 text-center border-t border-gray-100">
                  <Link to="/jobs/company/1" className="text-blue-600 hover:text-blue-800 font-medium">
                    View all jobs at {user?.company?.name || "this company"} →
                  </Link>
                </div>
              </div>
            )}
            
            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Award className="mr-2 text-blue-600 h-5 w-5" />
                    Company Benefits
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {companyBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-800">{benefit}</h3>
                          <p className="text-gray-500 mt-1 text-sm">
                            We value our employees and provide competitive benefits
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <ImageIcon className="mr-2 text-blue-600 h-5 w-5" />
                    Company Photos
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={`https://source.unsplash.com/random/300x200?office,${item}`} 
                          alt="Company" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View all photos →
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <MessageSquare className="mr-2 text-blue-600 h-5 w-5" />
                    Employee Reviews
                  </h2>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 text-center md:text-left flex-1">
                      <div className="text-4xl font-bold text-blue-600 mb-2">4.7</div>
                      <div className="flex items-center justify-center md:justify-start">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                        <Star className="h-5 w-5 text-yellow-400 fill-current opacity-70" />
                      </div>
                      <div className="mt-2 text-sm text-gray-600">Based on 128 reviews</div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-6 flex-1">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">82%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex">
                              {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                              <Star className="h-4 w-4 text-gray-300" />
                            </div>
                            <span className="text-sm text-gray-600">14%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '14%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex">
                              {[1, 2, 3].map((star) => (
                                <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                              {[1, 2].map((star) => (
                                <Star key={star} className="h-4 w-4 text-gray-300" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">3%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '3%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex">
                              {[1, 2].map((star) => (
                                <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                              {[1, 2, 3].map((star) => (
                                <Star key={star} className="h-4 w-4 text-gray-300" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">1%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '1%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {['JD', 'TN', 'AK'][review-1]}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium text-gray-800">
                                {['John Doe', 'Thomas Nguyen', 'Anna Kim'][review-1]}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {['Frontend Developer', 'Product Manager', 'UX Designer'][review-1]}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < (6-review) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mt-2">
                          {[
                            "Great company culture and leadership. Flexible working hours and competitive benefits package. I've learned a lot working with talented colleagues.",
                            "I've been with the company for 3 years and experienced significant professional growth. Management listens to employees and values feedback.",
                            "Positive work environment with good work-life balance. The team is collaborative and supportive. Company events are fun and engaging."
                          ][review-1]}
                        </p>
                        
                        <div className="mt-3 text-sm text-gray-500">
                          Posted {[2, 5, 1][review-1]} months ago
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Read all 128 reviews →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar - Right 1/3 */}
          <div className="space-y-8">
            {/* Company Statistics */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Company Information</h3>
              </div>
              
              <div className="p-6 space-y-5">
                {companyStats.map((stat, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      {stat.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="font-medium text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={user?.company?.domain || "https://example.com"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {user?.company?.domain || "example.com"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Contact Information</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{user?.company?.address || "Company Address"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href={`mailto:${user?.company?.email || "contact@example.com"}`} 
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {user?.company?.email || "contact@example.com"}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Phone</p>
                    <a 
                      href={`tel:${user?.company?.phone || "+1234567890"}`} 
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {user?.company?.phone || "+1234567890"}
                    </a>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <p className="text-sm text-gray-500 mb-3">Connect with us</p>
                  <div className="flex items-center gap-4">
                    <a 
                      href="#" 
                      className="h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a 
                      href="#" 
                      className="h-10 w-10 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a 
                      href="#" 
                      className="h-10 w-10 rounded-lg bg-blue-700 hover:bg-blue-800 flex items-center justify-center text-white transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a 
                      href="#" 
                      className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center text-white transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Similar Companies */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Similar Companies</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((company) => (
                    <div key={company} className="flex items-center">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://source.unsplash.com/random/100x100?logo,${company}`} 
                          alt="Company logo" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                          <Link to={`/companies/${company}`}>
                            {['AcmeCorp', 'TechVision', 'Innovate Inc.'][company-1]}
                          </Link>
                        </h4>
                        <p className="text-sm text-gray-500">
                          {['Manufacturing', 'Technology', 'Software'][company-1]}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/companies" className="text-blue-600 hover:text-blue-800 font-medium">
                    Browse all companies →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;