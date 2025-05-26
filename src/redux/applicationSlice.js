// src/redux/application/applicationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk: fetch tất cả applications
export const fetchEmployerApplications = createAsyncThunk(
  "applications/fetchEmployerApplications",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // lấy token từ localStorage
      const response = await axios.get("http://localhost:5000/api/employer/applications/job-posts/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.applications; // vì res.json({ applications }) từ backend
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
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:5000/api/employer/applications/detail-applications/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
       console.log("API Response:", response.data);
      if (response.data.success) {
        return response.data.application;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch application details');
      }
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
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `http://localhost:5000/api/employer/manager/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return { 
        applicationId, 
        status,
        success: response.data.success,
        message: response.data.message
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
