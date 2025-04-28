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

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
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
      });
  },
});

export default applicationSlice.reducer;
