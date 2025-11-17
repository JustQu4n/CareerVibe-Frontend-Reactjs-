// src/redux/slices/jobseekerApplicationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api.config';

// Thunk để fetch applications từ API history-applications
export const fetchJobseekerApplications = createAsyncThunk(
  'jobseekerApplications/fetchJobseekerApplications',
  async (jobseekerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        return rejectWithValue({ message: 'No authentication token found. Please login again.' });
      }
      
      const response = await axios.get(API_ENDPOINTS.APPLICATIONS.JOBSEEKER_HISTORY(jobseekerId), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      return {
        applications: response.data.data || [],
        total: response.data.total || 0
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch applications';
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const jobseekerApplicationsSlice = createSlice({
  name: 'jobseekerApplications',
  initialState: {
    applications: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Clear applications
    clearApplications: (state) => {
      state.applications = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobseekerApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobseekerApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
        state.total = action.payload.total;
      })
      .addCase(fetchJobseekerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.applications = [];
        state.total = 0;
      });
  },
});

export const { clearApplications } = jobseekerApplicationsSlice.actions;

export default jobseekerApplicationsSlice.reducer;
