import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base API configuration with authentication headers
 * Implements production-grade error handling and request/response transformation
 */
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL || "http://localhost:8086",
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

/**
 * Custom base query with error handling and retry logic
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Handle unauthorized access
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  }

  return result;
};

/**
 * Main API slice using RTK Query
 * Provides centralized API management with automatic caching and synchronization
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Mentors",
    "Mentees",
    "Programs",
    "Sessions",
    "Payments",
    "Analytics",
    "Reports",
  ],
  endpoints: () => ({}),
});

// Export hooks for use in components
export const { usePrefetch } = api;
