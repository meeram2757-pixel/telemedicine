const API_URLS = {
  LOGIN: "/login",
  REQUEST_OTP: "/request-otp",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  SIGNUP: "/signup",
  GET_PROFILE: "/patient",
  SAVE_PROFILE: "/patient",
  HEALTH_LOGS: "/health-log",
  HEALTH_LOG: (id) => `/health-log/${id}`,
  GENERATE_UPLOAD_URLS: "/files/generate-upload-urls",
  GENERATE_DOWNLOAD_URLS: "/files/generate-download-urls",
  DELETE_FILE: "/files/delete-object",
};

export default API_URLS;
