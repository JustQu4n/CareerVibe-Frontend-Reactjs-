// src/redux/slices/jobseekerApplicationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk để fetch applications
export const fetchJobseekerApplications = createAsyncThunk(
  'jobseekerApplications/fetchJobseekerApplications',
  async (jobseekerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/jobseeker/applications/all-applications/${jobseekerId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
      return response.data.applications; // dữ liệu trả về từ API
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const jobseekerApplicationsSlice = createSlice({
  name: 'jobseekerApplications',
  initialState: {
    applications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobseekerApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobseekerApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchJobseekerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default jobseekerApplicationsSlice.reducer;
