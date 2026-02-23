import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and not a retry request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

                const refreshToken = localStorage.getItem("refresh");
                if (refreshToken) {
                  try {
                    const response = await axios.post("/api/auth/refresh/", {
                      refresh: refreshToken,
                    });
                    const { access } = response.data;          
          localStorage.setItem("access", access);
          
          // Update the header of the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh token is invalid or expired
          console.error("Refresh token failed", refreshError);
          // Here you would trigger a logout action
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = '/login'; // Force redirect
          return Promise.reject(refreshError);
        }
      } else {
        console.error("No refresh token available");
        window.location.href = '/login'; // Force redirect
      }
    }

    return Promise.reject(error);
  }
);


export default api;