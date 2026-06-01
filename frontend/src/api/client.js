import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// =========================================
// REQUEST INTERCEPTOR
// =========================================
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("restaurant_access_token");

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Don't set Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// =========================================
// RESPONSE INTERCEPTOR (AUTO REFRESH)
// =========================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {
        const refreshResponse = await apiClient.post("/auth/refresh");


        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem(
          "restaurant_access_token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;



        return apiClient(originalRequest);
      } catch (refreshError) {
      

        localStorage.removeItem("restaurant_access_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;