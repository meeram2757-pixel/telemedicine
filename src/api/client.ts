import axios from "axios";
import { store } from "../store";

const Client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const apiCallWithAuth = async (url: string, method: string, data?: any) => {
  try {
    const authState = store.getState().auth;
    const token = authState?.accessToken || authState?.accesstoken || authState?.access_token || authState?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await Client.request({ url, method, data, headers });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Request failed.",
    };
  }
};

const apiCallWithoutAuth = async (url: string, method: string, data?: any) => {
  try {
    const response = await Client.request({ url, method, data });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Request failed.",
    };
  }
};

export { apiCallWithAuth, apiCallWithoutAuth };