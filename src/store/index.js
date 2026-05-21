import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import healthLogsReducer from "./healthLogsSlice";
import { loadAuthState, saveAuthState, loadHealthLogsState, saveHealthLogsState } from "../utils/localStorage";

const preloadedState = {
  auth: loadAuthState() || {
    accessToken: null,
    refreshToken: null,
    role: null,
    isProfileSetup: false,
  },
  healthLogs: loadHealthLogsState() || {
    logs: [],
    status: "idle",
    error: null,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    healthLogs: healthLogsReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveAuthState(store.getState().auth);
  saveHealthLogsState(store.getState().healthLogs);
});
