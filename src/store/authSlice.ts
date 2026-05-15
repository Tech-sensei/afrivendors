import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import http, { redirectToSignIn } from "@/lib/http";
import type { AuthState, User } from "@/types/auth";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoadingUser: false,
};

// ─── Async Thunk ─────────────────────────────────────────────────────────────

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get("/users/me");
      // Handle both wrapped { data: {...} } and flat response shapes
      return data?.data ?? data;
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401) {
        return rejectWithValue({ is401: true });
      }
      if (status === 403) {
        redirectToSignIn();
        return rejectWithValue({ isForbiddenPortal: true });
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoadingUser = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoadingUser = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoadingUser = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoadingUser = false;
        // If 401, clear auth entirely (token is invalid)
        if ((action.payload as any)?.is401 || (action.payload as any)?.isForbiddenPortal) {
          state.user = null;
          state.isAuthenticated = false;
        }
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
