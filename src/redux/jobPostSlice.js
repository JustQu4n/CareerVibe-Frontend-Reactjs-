// src/redux/jobPostSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { EMPLOYER_POST_API_ENDPOINT } from "@/utils/data";// Adjust the import path as necessary

// --- Thunk: Fetch job posts by employer ---
export const fetchJobPostsByEmployer = createAsyncThunk(
  "jobPosts/fetchByEmployer",
  async (employerId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.user?.token;

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


// --- Slice ---
const jobPostSlice = createSlice({
  name: "jobPosts",
  initialState: {
    jobs: [],
    filteredJobs: [],
    loading: false,
    error: null,
  },
  reducers: {
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
export const { clearJobPosts, clearJobPostsError, filterJobPostsByTitle } =
  jobPostSlice.actions;

// Export reducer
export default jobPostSlice.reducer;
