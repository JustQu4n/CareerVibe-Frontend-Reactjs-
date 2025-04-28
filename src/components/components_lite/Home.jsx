import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import Hero from "./Hero";
import JobCategoriesAndTrends from "./JobCategoriesAndTrends";

const Home = () => {
  const { loading, error } = useGetAllJobs(); // Trigger data fetch
  const jobs = useSelector((state) => state.jobs.allJobs); // Access Redux state

  console.log("Jobs in Component:", { loading, error, jobs }); // Log to check state
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      { /*<Header />*/}
      <Hero />
      <JobCategoriesAndTrends />
      {/* <Categories /> */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <ClipLoader color="#2563eb" size={50} />
          <span className="ml-3 text-blue-600 font-medium">Loading jobs...</span>
        </div>
      )}
      {error && <p className="text-red-500 text-center py-5">Error: {error}</p>}
      {!loading && !error && <LatestJobs jobs={jobs} />}
      <Footer />
    </div>
  );
};

export default Home;
