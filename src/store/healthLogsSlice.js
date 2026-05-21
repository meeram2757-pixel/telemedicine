import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCallWithAuth } from "../api/client";
import API_URLS from "../utils/apiUrls";

// Utility functions copied from useHealthLogs.js
const unwrapLogEntry = (entry) => {
  if (!entry || typeof entry !== "object") return entry;
  if (entry.healthLog && typeof entry.healthLog === "object") {
    return unwrapLogEntry(entry.healthLog);
  }
  if (entry.data && typeof entry.data === "object" && !Array.isArray(entry.data)) {
    return unwrapLogEntry(entry.data);
  }
  return entry;
};

const getLogValue = (entry, ...keys) => {
  if (!entry) return undefined;
  const unwrapped = unwrapLogEntry(entry);
  for (const key of keys) {
    if (unwrapped[key] !== undefined && unwrapped[key] !== null) {
      return unwrapped[key];
    }
  }
  return undefined;
};

const getLogImageUrls = (entry) => {
  const value = getLogValue(entry, "images", "attachments", "photos", "files");
  if (!value) {
    const unwrapped = unwrapLogEntry(entry);
    const fallbackValue = getLogValue(unwrapped, "images", "attachments", "photos", "files");
    if (!fallbackValue) return [];
    return getLogImageUrls({ images: fallbackValue });
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.url) return item.url;
        if (item?.path) return item.path;
        if (item?.src) return item.src;
        return undefined;
      })
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeHealthLogs = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.healthLog)) return payload.data.healthLog;
  if (Array.isArray(payload?.healthLog)) return payload.healthLog;
  if (Array.isArray(payload?.healthLogs)) return payload.healthLogs;
  if (Array.isArray(payload?.data?.healthLogs)) return payload.data.healthLogs;
  if (Array.isArray(payload?.logs)) return payload.logs;
  if (Array.isArray(payload?.data?.logs)) return payload.data.logs;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.data?.response)) return payload.data.response;
  return [];
};

export const fetchHealthLogs = createAsyncThunk(
  "healthLogs/fetchHealthLogs",
  async (_, { rejectWithValue }) => {
    const result = await apiCallWithAuth(API_URLS.HEALTH_LOGS, "GET");

    if (result && typeof result === "object" && result.success === false) {
      return rejectWithValue(result.message || "Unable to load health logs.");
    }

    let loadedLogs = normalizeHealthLogs(result);

    const urlToKeyMap = new Map();
    const keysToFetch = new Set();

    loadedLogs.forEach(log => {
      const images = getLogImageUrls(log);
      images.forEach(url => {
        try {
          if (url && url.startsWith('http')) {
            const parsed = new URL(url);
            const key = decodeURIComponent(parsed.pathname.slice(1));
            urlToKeyMap.set(url, key);
            keysToFetch.add(key);
          }
        } catch (e) {
          console.error("Error parsing URL to extract key:", url, e);
        }
      });
    });

    if (keysToFetch.size > 0) {
      const downloadPayload = {
        expiresIn: 3600,
        keys: Array.from(keysToFetch)
      };

      try {
        const downloadResult = await apiCallWithAuth(API_URLS.GENERATE_DOWNLOAD_URLS, "POST", downloadPayload);
        if (downloadResult && downloadResult.success && downloadResult.data) {
          const presignedMap = new Map();
          
          if (Array.isArray(downloadResult.data)) {
            downloadResult.data.forEach((item, idx) => {
             // change for image key
              if (item && typeof item === 'object' && item.presignedUrl) {
                const key = item.key || downloadPayload.keys[idx];
                presignedMap.set(key, item.presignedUrl);
              } else if (typeof item === 'string') {
                presignedMap.set(downloadPayload.keys[idx], item);
              }
            });
          } else if (typeof downloadResult.data === 'object') {
            Object.entries(downloadResult.data).forEach(([k, v]) => {
              presignedMap.set(k, v && typeof v === 'object' ? v.presignedUrl || v.url : v);
            });
          }

          loadedLogs = loadedLogs.map(log => {
            const entry = log.healthLog || log.data || log;
            if (entry.files && Array.isArray(entry.files)) {
              entry.files = entry.files.map(url => {
                const key = urlToKeyMap.get(url);
                return key && presignedMap.has(key) ? presignedMap.get(key) : url;
              });
            }
            if (entry.images && Array.isArray(entry.images)) {
              entry.images = entry.images.map(url => {
                const key = urlToKeyMap.get(url);
                return key && presignedMap.has(key) ? presignedMap.get(key) : url;
              });
            }
            return log;
          });
        }
      } catch (err) {
        console.error("Failed to fetch download URLs for health logs:", err);
      }
    }

    return loadedLogs;
  }
);

const healthLogsSlice = createSlice({
  name: "healthLogs",
  initialState: {
    logs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthLogs.pending, (state) => {
        // If logs are empty, we can show loading. If they aren't, it's a background refresh.
        if (state.logs.length === 0) {
          state.status = "loading";
        } else {
          state.status = "refreshing";
        }
      })
      .addCase(fetchHealthLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.logs = action.payload;
        state.error = null;
      })
      .addCase(fetchHealthLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default healthLogsSlice.reducer;
