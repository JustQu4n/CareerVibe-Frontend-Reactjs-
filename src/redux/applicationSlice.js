// src/redux/application/applicationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '@/api/client';

// Thunk: fetch tất cả applications
export const fetchEmployerApplications = createAsyncThunk(
  "applications/fetchEmployerApplications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/employer/application/job-posts/applications');
      return response.data?.data || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Something went wrong");
    }
  }
);

//Thunk for get Detail
export const fetchApplicationDetails = createAsyncThunk(
  'applications/fetchDetails',
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/employer/application/detail-applications/${applicationId}`);
      console.log('Application Details Response:', response.data);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      return rejectWithValue(
        error.response?.data?.message || 'An error occurred while fetching application details'
      );
    }
  }
);

// Thunk for updating application status
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ applicationId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/employer/manager/applications/${applicationId}/status`, { status });

      return {
        applicationId,
        status,
        success: response.data?.success,
        message: response.data?.message,
      };
    } catch (error) {
      console.error("Error updating application status:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  }
);
const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
    updateStatusLoading: false,
    updateStatusError: null,
    applicationDetail: null,
    detailLoading: false,
    detailError: null
  },
  reducers: {
    // reducers riêng nếu cần sau này
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchEmployerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(updateApplicationStatus.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        
        // Find and update the application in the state
        const index = state.applications.findIndex(
          (app) => app._id === action.payload.applicationId
        );
        
        if (index !== -1) {
          state.applications[index].status = action.payload.status;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload;
      })
      .addCase(fetchApplicationDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchApplicationDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.applicationDetail = action.payload;
      })
      .addCase(fetchApplicationDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });
  },
});

export default applicationSlice.reducer;
