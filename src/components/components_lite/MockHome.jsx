import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRegBookmark, FaMapMarkerAlt } from "react-icons/fa";
import {
  BriefcaseBusiness,
  Building2,
  UsersRound,
  Rss,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const allJobs = useSelector((state) => state.jobs?.allJobs || []);
  const stats = [
    {
      icon: <BriefcaseBusiness size={24} className="text-blue-600" />,
      value: "1,75,324",
      label: "Live Job",
    },
    {
      icon: <Building2 size={24} className="text-blue-600" />,
      value: "97,354",
      label: "Companies",
    },
    {
      icon: <UsersRound size={24} className="text-blue-600" />,
      value: "38,47,154",
      label: "Candidates",
    },
    {
      icon: <Rss size={24} className="text-blue-600" />,
      value: "7,532",
      label: "New Jobs",
    },
  ];
  const { user } = useSelector((state) => state.auth);

  // State for recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("User ID:", user?.jobseeker?.id);
  // Fetch recommendations when component mounts or user changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      // Only fetch if user is logged in
      if (!user?.jobseeker?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:8000/recommend/${user?.jobseeker?.id}`
        );

        // Filter recommendations with score > 0
        const filteredRecommendations = response.data.recommendations.filter(
          (rec) => rec.score > 0
        );

        setRecommendations(filteredRecommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  // Find job details from recommendations
  const getRecommendedJobs = () => {
    if (!recommendations.length) return [];

    return recommendations
      .map((rec) => {
        // Find the full job details from allJobs using job_id
        const jobDetails = allJobs.find((job) => job._id === rec.job_id);

        // Return combined data - recommendation info + job details
        return {
          ...rec,
          ...jobDetails,
        };
      })
      .filter((job) => job.title); // Filter out any jobs that couldn't be found
  };

  const recommendedJobs = getRecommendedJobs();

  return (
    <div className="max-w-7xl mx-auto bg-gray-50 text-gray-800">
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Find a job that suits your{" "}
              <span className="text-blue-600">interest</span> & skills.
            </h1>
            <p className="mb-6 text-gray-600">
              Explore careers that align with your values and strengths.
              Discover your best-fit position now.
            </p>
            <div className="flex gap-4">
              <Input
                placeholder="Job title, keyword..."
                className="flex-1 h-12"
              />
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <Input placeholder="Your location" className="pl-10 h-12" />
              </div>
              <Button className="h-12 bg-blue-500">Find Job</Button>
            </div>
            <div className="mt-6">
              <p>
                Suggestion:{" "}
                <span className="text-blue-600">Software Engineer</span>,{" "}
                <span className="text-blue-600">Data Analyst</span>,{" "}
                <span className="text-blue-600">Product Manager</span>
              </p>
            </div>
          </div>
          <div>
            <img
              src="/src/assets/Illustration.png"
              alt="Job search"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-10 py-10 bg-white">
        {stats.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="border p-6 bg-blue-100 rounded-lg">{item.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-blue-600">{item.value}</h2>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="bg-white px-6 py-14">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How JobPilot Works
        </h2>
        {/* <div className="flex flex-col md:flex-row justify-around items-center gap-12">
                    {[
                            ['Create Account', 'Sign up and get started with ease.'],
                            ['Upload CV/Resume', 'Showcase your skills and experience.'],
                            ['Find Suitable Job', 'Discover opportunities tailored for you.'],
                            ['Apply for Job', 'Take the next step in your career.'],
                    ].map(([title, desc], i) => (
                            <div key={i} className="text-center max-w-xs">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center text-blue-600 text-xl font-bold">
                                            {i + 1}
                                    </div>
                                    <h3 className="font-semibold text-lg mb-3 text-gray-700">{title}</h3>
                                    <p className="text-sm text-gray-500">{desc}</p>
                            </div>
                    ))}
            </div> */}
        <img src="/src/assets/Process (1).png" alt="" />
      </section>
      {/* Recommend Jobs */}
      {user?.jobseeker?.id ? (
        <section className="bg-blue-50 px-6 py-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Recommended Jobs For You
          </h2>

          {isLoading && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading recommendations...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}

          {!isLoading && !error && recommendedJobs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p>No recommended jobs found for your profile.</p>
              <p className="mt-2">
                Try updating your profile or exploring all jobs below.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {recommendedJobs.map((job, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/view-job-detail/${job._id}`)}
                className="flex items-center bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    job.company_id?.logo || "/src/assets/default-company.png"
                  }
                  alt={`${job.company_id?.name || "Company"} logo`}
                  className="w-16 h-16 object-cover rounded-md mr-6"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-xl text-gray-800">
                      {job.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
                      {job.job_type}
                    </span>
                    <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                      {Math.round(job.score * 100)}% Match
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    {job.location}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <FaRegBookmark
                    size={20}
                    className="text-gray-400 cursor-pointer"
                  />
                  <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Feature Jobs */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Feature Jobs</h2>

            <div className="flex space-x-2">
              <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-md">
                {/* <ChevronLeft className="h-5 w-5" /> */}
              </button>
              <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md">
                {/* <ChevronRight className="h-5 w-5" /> */}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Job Card 1 */}
            {allJobs.map((job, idx) => (
              <div key={idx}
              onClick={() => navigate(`/view-job-detail/${job._id}`)} className="border border-red-300 rounded-lg p-4 bg-white shadow-sm relative hover:shadow-md transition">
                {/* HOT Badge */}
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                  HOT
                </div>

                {/* Time posted */}
                <p className="text-gray-500 text-sm mb-1">Posted 3 hours ago</p>

                {/* Job title */}
                <h2 className="text-lg font-semibold mb-2">
                 {job.title}
                </h2>

                {/* Company */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded">
                    <img src={job.company_id.logo} alt="" />
                  </div>
                  <span className="font-medium">{job.company_id.name}</span>
                </div>


                {/* Position */}
                <div className="mb-2 text-sm">
                  <a href="#" className="text-gray-700 underline">
                  {job.address}
                  </a>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>At office</span>
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 px-3 py-1 text-sm rounded-full text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Top Companies */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Top Companies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="p-6 border rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg text-gray-700">
                Company Name
              </h3>
              <p className="text-sm text-gray-500 mb-4">Location</p>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Open Positions
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-100 px-6 py-12">
        <h2 className="text-2xl font-bold text-center mb-10">
          Clients Testimonial
        </h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-md shadow-md text-center"
            >
              <p className="italic mb-4">“Lorem ipsum dolor sit amet...”</p>
              <div className="font-semibold">John Doe</div>
              <div className="text-sm text-gray-500">UX/UI Designer</div>
            </div>
          ))}
        </div>
      </section>

      {/* Register CTA */}
      <section className="px-6 py-12 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-md p-6 text-center">
          <h3 className="font-bold mb-2">Become a Candidate</h3>
          <p className="text-sm text-gray-500 mb-4">
            Register now to explore thousands of jobs.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Register Now
          </button>
        </div>
        <div className="bg-blue-600 text-white p-6 rounded-md text-center">
          <h3 className="font-bold mb-2">Become an Employer</h3>
          <p className="text-sm mb-4">
            Hire the best talents for your company.
          </p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md">
            Register Now
          </button>
        </div>
      </section>
    </div>
  );
}
