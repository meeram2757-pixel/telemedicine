const AUTH_STORAGE_KEY = "auth";

const normalizeState = (state) => ({
  accessToken: state?.accessToken ?? state?.accesstoken ?? state?.access_token ?? null,
  refreshToken: state?.refreshToken ?? state?.refresh_token ?? null,
  role: state?.role ?? null,
  isProfileSetup: Boolean(state?.isProfileSetup),
});

export const saveAuthState = (state) => {
  const normalized = normalizeState(state);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));
};

export const loadAuthState = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearAuthState = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const HEALTH_LOGS_STORAGE_KEY = "healthLogs";

export const saveHealthLogsState = (state) => {
  localStorage.setItem(HEALTH_LOGS_STORAGE_KEY, JSON.stringify(state));
};

export const loadHealthLogsState = () => {
  const stored = localStorage.getItem(HEALTH_LOGS_STORAGE_KEY);
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};
