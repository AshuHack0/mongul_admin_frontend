import { createSlice } from "@reduxjs/toolkit";
import {
  initializeAuthAsync,
  loginAsync,
  googleLoginAsync,
  logoutAsync,
  sendOtpAsync,
  sendRegisterOtpAsync,
  registerAsync,
} from "../thunks/authThunks";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("authToken");
      state.error = null;
    },
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(initializeAuthAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        // User is already extracted in the thunk
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(initializeAuthAsync.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    builder
      .addCase(googleLoginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleLoginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    builder
      .addCase(sendOtpAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(sendOtpAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(sendRegisterOtpAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(sendRegisterOtpAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(sendRegisterOtpAsync.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      });

    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { logout, setError } = authSlice.actions;

export default authSlice.reducer;
