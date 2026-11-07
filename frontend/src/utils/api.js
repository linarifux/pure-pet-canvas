import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // CRITICAL: This allows the browser to accept and send the HTTP-only JWT cookie
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: You can add interceptors here later to handle global 401 errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized (e.g., dispatch logout)
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
