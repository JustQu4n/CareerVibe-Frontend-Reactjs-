import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken')
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Accepts either a normalized user object or the raw response from /login
    setUser: (state, action) => {
      const payload = action.payload;

      // Clear user when payload is falsy
      if (!payload) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        return;
      }

      // Extract tokens (support various field names)
      const accessToken = payload.accessToken || payload.token || payload.access_token || payload.user?.accessToken || null;
      const refreshToken = payload.refreshToken || payload.refresh_token || payload.user?.refreshToken || null;

      // The actual user object may be at payload.user or payload itself
      const rawUser = payload.user || payload;

      // Normalize user fields
      const normalized = {
        id: rawUser.user_id || rawUser.id || rawUser.userId || null,
        user_id: rawUser.user_id || rawUser.id || rawUser.userId || null,
        job_seeker_id: rawUser.job_seeker_id || rawUser.jobSeekerId || null,
        jobSeekerId: rawUser.job_seeker_id || rawUser.jobSeekerId || null,
        email: rawUser.email || null,
        fullname: rawUser.full_name || rawUser.fullname || rawUser.name || null,
        avatar: rawUser.avatar || rawUser.avatar_url || rawUser.avatarUrl || null,
        roles: rawUser.roles || (rawUser.role ? [rawUser.role] : []),
        role: (rawUser.roles && rawUser.roles[0]) || rawUser.role || null,
        employer: rawUser.employer || null,
        company: (rawUser.employer && rawUser.employer.company) || rawUser.company || null,
      };

      state.user = normalized;

      // Persist tokens and update state.token
      if (accessToken) {
        state.token = accessToken;
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('token', accessToken); // backward compat
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
    },
  },
});

// Export the actions
export const { setLoading, setUser, setToken, logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Export the authSlice if needed
export const authSliceReducer = authSlice.reducer;