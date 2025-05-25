// src/redux/jobPostSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { EMPLOYER_POST_API_ENDPOINT } from "@/utils/data";// Adjust the import path as necessary

// --- Thunk: Fetch job posts by employer ---
export const fetchJobPostsByEmployer = createAsyncThunk(
  "jobPosts/fetchByEmployer",
  async (employerId, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return rejectWithValue("Authentication required.");

      const res = await axios.get(
        `${EMPLOYER_POST_API_ENDPOINT}/${employerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return res.data.jobs;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs");
    }
  }
);

// --- Thunk: Create a job post ---
export const createJobPost = createAsyncThunk(
  "jobPosts/create",
  async (jobData, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return rejectWithValue("Authentication required.");

      const res = await axios.post(
        "http://localhost:5000/api/employer/jobposts",
        jobData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );

      return res.data.job;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job post"
      );
    }
  }
);

// --- Thunk: Update a job post ---
export const updateJobPostById = createAsyncThunk(
  "jobPosts/updateById",
  async ({ jobId, updatedData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.user?.token;

      const res = await axios.put(
        `http://localhost:5000/api/employer/jobposts/${jobId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      return res.data.updatedJob;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update job");
    }
  }
);

// --- Thunk: Delete a job post ---
export const deleteJobPostById = createAsyncThunk(
  "jobPosts/deleteById",
  async ({ jobId, user_id, company_id }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.user?.token;

      const url = `http://localhost:5000/api/employer/jobposts/${jobId}?user_id=${user_id}&company_id=${company_id}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      return jobId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete job");
    }
  }
);
// Thunk to fetch related job posts
export const fetchRelatedJobs = createAsyncThunk(
  "job/fetchRelatedJobs",
  async (jobId, { rejectWithValue }) => {
    try {
      // Make the API request
      const response = await axios.get(
        `http://localhost:5000/api/job-posts/jobs/${jobId}/related`, 
        {
          withCredentials: true
        }
      );
      
      // Check if the response is successful
      if (response.data.success) {
        console.log("Related jobs fetched successfully:", response.data.relatedJobs);
        return response.data.relatedJobs;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch related jobs");
      }
    } catch (error) {
      console.error("Error fetching related jobs:", error);
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while fetching related jobs"
      );
    }
  }
);

// --- Slice ---
const jobPostSlice = createSlice({
  name: "jobPosts",
  initialState: {
    jobs: [],
    filteredJobs: [],
    initialState: [],
    relatedJobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    addJobPost: (state, action) => {
      state.push(action.payload);
    },
        setRelatedJobs: (state, action) => {
      state.relatedJobs = action.payload;
    },
    clearJobPosts: (state) => {
      state.jobs = [];
      state.filteredJobs = [];
    },
    clearJobPostsError: (state) => {
      state.error = null;
    },
    filterJobPostsByTitle: (state, action) => {
      const keyword = action.payload.toLowerCase();
      state.filteredJobs = state.jobs.filter((job) =>
        job.title.toLowerCase().includes(keyword)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchJobPostsByEmployer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobPostsByEmployer.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        state.filteredJobs = action.payload;
      })
      .addCase(fetchJobPostsByEmployer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRelatedJobs.pending, (state) => {
        state.loadingRelated = true;
        state.errorRelated = null;
      })
      .addCase(fetchRelatedJobs.fulfilled, (state, action) => {
        state.loadingRelated = false;
        state.relatedJobs = action.payload;
      })
      .addCase(fetchRelatedJobs.rejected, (state, action) => {
        state.loadingRelated = false;
        state.errorRelated = action.payload;
      })
      // Add these to your extraReducers builder chain
.addCase(createJobPost.fulfilled, (state, action) => {
  state.loading = false;
  state.jobs.push(action.payload);
  state.filteredJobs = state.jobs;
})
.addCase(createJobPost.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
      // Update
      .addCase(updateJobPostById.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.jobs.findIndex((job) => job._id === updated._id);
        if (index !== -1) {
          state.jobs[index] = updated;
        }
        state.filteredJobs = state.jobs;
      })
      .addCase(updateJobPostById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteJobPostById.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.jobs = state.jobs.filter((job) => job._id !== deletedId);
        state.filteredJobs = state.filteredJobs.filter((job) => job._id !== deletedId);
      })
      .addCase(deleteJobPostById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearJobPosts, clearJobPostsError, filterJobPostsByTitle, addJobPost } =
  jobPostSlice.actions;

// Export reducer
export default jobPostSlice.reducer;
