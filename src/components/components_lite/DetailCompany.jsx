import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Calendar, Users, Briefcase, Building } from 'lucide-react';
import { Navbar } from '../navbar';
import Footer from './Footer';
import JobCard from './JobCard'; // Assuming you have a JobCard component

const DetailCompany = () => {
  const { id } = useParams(); // Get company ID from URL params
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/employer/companies/${id}/details`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setCompanyData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch company details');
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
        setError('An error occurred while fetching company details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5">
          <Navbar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5">
          <Navbar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 rounded-lg max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Company</h2>
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // No data state
  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5">
          <Navbar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No company information available</p>
        </div>
      </div>
    );
  }
  
  const company = companyData.company;
  const jobPosts = companyData.jobPosts || [];
  const benefits = [
    "Competitive salary package",
    "Flexible work arrangements",
    "Professional development opportunities",
    "Collaborative work environment",
  ];
  
  const benefitsToShow = showAllBenefits ? benefits : benefits.slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-600">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span>Find Employers</span>
              <span className="mx-2">/</span>
              <span>{company.name}</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Background Image Banner */}
      <div
        className="w-full h-64 bg-cover bg-center relative"
        style={{ backgroundColor: "#1DA1F2" }} // Twitter blue color as fallback
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="text-white">
            <h2 className="text-3xl font-bold">{company.name}</h2>
            <p className="text-lg">{company.industries || "Technology"}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center overflow-hidden mr-4">
                <img src={company.logo} alt={company.name} className="w-16 h-16 object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                <p className="text-gray-600">{jobPosts[0]?.industries || "Technology"}</p>
              </div>
            </div>
            <button className="mt-4 md:mt-0 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center hover:bg-blue-600 transition-colors">
              View Open Position
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {company.description || "No company description available."}
            </p>
          </div>

          {/* Company Benefits */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefitsToShow.map((benefit, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 mr-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            {benefits.length > 4 && (
              <button 
                className="mt-4 text-blue-500 font-medium hover:text-blue-700 transition-colors"
                onClick={() => setShowAllBenefits(!showAllBenefits)}
              >
                {showAllBenefits ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Company Info */}
            <div className="w-full md:w-2/3 pr-0 md:pr-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">Founded In</h4>
                      <p className="text-gray-900 font-medium">
                        {new Date(company.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                      <Building className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">Organization Type</h4>
                      <p className="text-gray-900 font-medium">Private Company</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">Team Size</h4>
                      <p className="text-gray-900 font-medium">{jobPosts.length > 5 ? "50+" : "10-50"} Employees</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4">
                      <Briefcase className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">Industry Types</h4>
                      <p className="text-gray-900 font-medium">{jobPosts[0]?.industries || "Technology"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="w-full md:w-1/3 mt-6 md:mt-0">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="text-blue-500">{company.email_domain}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="text-gray-900">Contact via email</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Website</h4>
                      <p className="text-blue-500">{company.email_domain?.split('@')[1] || "Not provided"}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <p className="text-gray-900">{company.address}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Open Positions</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                {jobPosts.length > 0 ? (
                  jobPosts.map((job) => (
                   <JobCard  index={job._id} job={job} />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No open positions available at the moment.</p>
                )}
              </div>
              {jobPosts.length > 0 && (
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center text-blue-500 font-medium hover:text-blue-700 transition-colors">
                    View All Open Positions
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DetailCompany;