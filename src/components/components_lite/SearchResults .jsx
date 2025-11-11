import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaRegBookmark, FaArrowLeft } from "react-icons/fa";
import { Building2, MapPin } from "lucide-react";
import axios from "axios";
import { Navbar } from "../navbar";
import Footer from "./Footer";
import JobCard from "./JobCard";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const title = searchParams.get("title") || "";
  const location = searchParams.get("location") || "";
    console.log("Search Params:", { title, location });
  
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:5000/api/job-posts/search`, {
          params: {
            title,
            location
          }
        });
        
        setSearchResults(response.data.data || []);
        console.log("Search Results:", response.data.data);
      } catch (error) {
        console.error("Search error:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [title, location]);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-600">
            {title && location ? (
              <>Showing jobs for <span className="font-semibold">"{title}"</span> in <span className="font-semibold">"{location}"</span></>
            ) : title ? (
              <>Showing jobs for <span className="font-semibold">"{title}"</span></>
            ) : location ? (
              <>Showing jobs in <span className="font-semibold">"{location}"</span></>
            ) : (
              <>Showing all jobs</>
            )}
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading search results...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-xl text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Return to Home
            </button>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2">No jobs found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any jobs matching your search criteria. Try adjusting your search terms.
            </p>
            <button 
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Back to Search
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-700 font-medium">{searchResults.length} jobs found</p>
            
            <div className="space-y-6">
              {searchResults.map((job) => (
                <JobCard key={job.id} job={job}  />
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}