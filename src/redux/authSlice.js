import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

// Export the actions
export const { setLoading, setUser, logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Export the authSlice if needed
export const authSliceReducer = authSlice.reducer;
