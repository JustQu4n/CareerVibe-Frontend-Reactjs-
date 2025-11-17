import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build URL with optional keyword parameter
        const keyword = searchedQuery || '';
        const url = keyword 
          ? `${JOB_API_ENDPOINT}?keyword=${encodeURIComponent(keyword)}`
          : JOB_API_ENDPOINT;
        
        const res = await axios.get(url, {
          withCredentials: true,
        });
        console.log("API Response Job:", res.data);
        
        // New API structure: { data: [...], meta: {...} }
        if (res.data?.data) {
          dispatch(setAllJobs(res.data.data));
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [dispatch, searchedQuery]);

  return { loading, error };
};

export default useGetAllJobs;
