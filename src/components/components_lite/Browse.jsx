import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import JobCard from "./JobCard";
import { List, Grid3x3 } from "lucide-react";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("list");
  const [filter, setFilter] = useState("All");

  const filteredJobs = allJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || job.type === filter)
  );

  const tags = ["All", "Full Time", "Remote", "Contract Base", "Temporary"];
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  return (
    <div>
      <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      <div className="max-w-6xl mx-auto space-y-6 mt-5">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                    Job Title
                    </label>
                    <input
                    type="text"
                    placeholder="e.g. Web Developer"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute top-9 left-3 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                      />
                    </svg>
                    </div>
                  </div>


                  {/* Location Input */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Da Nang, Remote"
                className="w-full border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <div className="absolute top-9 left-3 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Category
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Find Job Button */}
            <div className="flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Find Jobs
              </button>
            </div>
          </div>
        </div>
              {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex items-center space-x-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`text-sm px-3 py-1 rounded-full border ${
                filter === tag ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMode('list')}
            className={`p-2 rounded ${mode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setMode('grid')}
            className={`p-2 rounded ${mode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            <Grid3x3 size={18} />
          </button>
        </div>
      </div>
        {/* Job List */}
        <div
          className={
            mode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "space-y-4"
          }
        >
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} mode={mode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
