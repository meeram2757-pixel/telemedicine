import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { loadAuthState, saveAuthState } from "../utils/localStorage";

const preloadedState = {
  auth: loadAuthState() || {
    accessToken: null,
    refreshToken: null,
    role: null,
    isProfileSetup: false,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveAuthState(store.getState().auth);
});
