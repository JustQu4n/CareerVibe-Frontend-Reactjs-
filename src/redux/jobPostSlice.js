// src/redux/jobPostSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/api/client';
import { EMPLOYER_POST_API_ENDPOINT } from '@/utils/data'; // Adjust the import path as necessary

// --- Thunk: Fetch job posts by employer ---
export const fetchJobPostsByEmployer = createAsyncThunk(
  "jobPosts/fetchByEmployer",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth?.user?.token || localStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem('access_token');

      if (!token) {
        console.warn('fetchJobPostsByEmployer: no auth token found in state or localStorage');
        return rejectWithValue("Authentication required.");
      }

      // Use new endpoint: GET /api/employer/job-posts with pagination
      const { page = 1, limit = 10 } = params;
      const url = `${EMPLOYER_POST_API_ENDPOINT}?page=${page}&limit=${limit}`;
      const res = await apiClient.get(url);

      // Normalize jobs array
      const jobs = res.data.jobs || res.data.data || [];

      // Normalize pagination metadata into a predictable shape
      const rawPagination = res.data.pagination || res.data.meta || res.data.pagination_meta || res.data.metaData || null;

      let pagination = null;
      if (rawPagination) {
        const currentPage = Number(rawPagination.currentPage ?? rawPagination.page ?? rawPagination.page_number ?? rawPagination.pageNum ?? rawPagination.page_num ?? 1) || 1;
        const limit = Number(rawPagination.limit ?? rawPagination.per_page ?? rawPagination.pageSize ?? rawPagination.page_size ?? 10) || 10;
        const total = Number(rawPagination.total ?? rawPagination.totalItems ?? rawPagination.count ?? rawPagination.total_count ?? 0) || 0;
        const totalPages = Number(rawPagination.totalPages ?? rawPagination.total_pages ?? Math.ceil(total / limit) ?? 1) || Math.max(1, Math.ceil(total / limit));

        pagination = { currentPage, limit, total, totalPages };
      }

      // Return both jobs array and normalized pagination metadata
      return { jobs, pagination };
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
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

      if (!token) return rejectWithValue("Authentication required.");

      // Validate title length
      if (!jobData.title || jobData.title.trim().length < 5) {
        return rejectWithValue("Title must be at least 5 characters long");
      }

      const { deadline, ...createPayload } = jobData;
      
      const payload = {
        ...createPayload,
        expires_at: jobData.expires_at ? new Date(jobData.expires_at).toISOString() : null,
      };

      const res = await apiClient.post(EMPLOYER_POST_API_ENDPOINT, payload);

      return res.data.jobPost || res.data.job || res.data.data || res.data;
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
      const token = auth.user?.token || localStorage.getItem("accessToken") || localStorage.getItem("token");

      const res = await apiClient.patch(`${EMPLOYER_POST_API_ENDPOINT}/${jobId}`, updatedData);

      return res.data.updatedJob || res.data;
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
      const token = auth.user?.token || localStorage.getItem("accessToken") || localStorage.getItem("token");

      const url = `${EMPLOYER_POST_API_ENDPOINT}/${jobId}`;

      await apiClient.delete(url);

      return jobId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete job");
    }
  }
);
// Related jobs are fetched directly in the UI component; removed thunk from slice

// --- Slice ---
const jobPostSlice = createSlice({
  name: "jobPosts",
  initialState: {
    jobs: [],
    filteredJobs: [],
    pagination: null,
    loading: false,
    error: null,
  },
  reducers: {
    addJobPost: (state, action) => {
      state.push(action.payload);
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
        state.jobs = Array.isArray(action.payload.jobs) ? action.payload.jobs : [];
        state.filteredJobs = Array.isArray(action.payload.jobs) ? action.payload.jobs : [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobPostsByEmployer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.jobs = [];
        state.filteredJobs = [];
      })
      // related jobs are now fetched on the component level
      // Add these to your extraReducers builder chain
.addCase(createJobPost.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(createJobPost.fulfilled, (state, action) => {
  state.loading = false;
  state.jobs.unshift(action.payload);
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
