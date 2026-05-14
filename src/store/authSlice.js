import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
  role: null,
  isProfileSetup: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role ?? state.role;
      state.isProfileSetup = action.payload.isProfileSetup ?? state.isProfileSetup;
    },
    updateUser(state, action) {
      state.role = action.payload.role ?? state.role;
      state.isProfileSetup = action.payload.isProfileSetup ?? state.isProfileSetup;
    },
    setProfileSetup(state, action) {
      state.isProfileSetup = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.isProfileSetup = false;
    },
  },
});

export const { setCredentials, updateUser, setProfileSetup, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);
export const selectIsProfileSetup = (state) => Boolean(state.auth.isProfileSetup);

export default authSlice.reducer;
