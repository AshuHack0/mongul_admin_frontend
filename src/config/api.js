export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8086";

export const API_V1_ENDPOINTS = {
  SEND_ADMIN_OTP: `${API_BASE_URL}/api/v1/auth/login/send-otp`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/v1/auth/login/verify-otp`,
  GOOGLE_LOGIN: `${API_BASE_URL}/api/v1/auth/login/google`,
  SEND_REGISTER_OTP: `${API_BASE_URL}/api/v1/auth/register/send-otp`,
  REGISTER_VERIFY_OTP: `${API_BASE_URL}/api/v1/auth/register/verify-otp`,
  CURRENT_USER: `${API_BASE_URL}/api/v1/user/me`,
  ADMIN_MENTOR_APPLICATIONS: `${API_BASE_URL}/api/v1/admin/mentor-applications`,
  ADMIN_MENTORS: `${API_BASE_URL}/api/v1/admin/mentors`,

  ADMIN_MENTOR_APPLICATION_BY_ID: (applicationId) =>
    `${API_BASE_URL}/api/v1/admin/mentor-application/${applicationId}`,
  ADMIN_UPDATE_MENTOR_APPLICATION_STATUS: (applicationId) =>
    `${API_BASE_URL}/api/v1/admin/mentor-application/${applicationId}`,
  
  CATEGORIES: `${API_BASE_URL}/api/v1/category`,
  ADD_CATEGORY: `${API_BASE_URL}/api/v1/category/add-category`,
  UPDATE_CATEGORY: (categoryId) =>
    `${API_BASE_URL}/api/v1/category/update-category/${categoryId}`,
  DELETE_CATEGORY: (categoryId) =>
    `${API_BASE_URL}/api/v1/category/delete-category/${categoryId}`,
  UPLOAD_CATEGORY_ICON: (categoryId) =>
    `${API_BASE_URL}/api/v1/category/upload-icon/${categoryId}`,
  ADD_SUBCATEGORY: (categoryId) =>
    `${API_BASE_URL}/api/v1/category/add-subcategory/${categoryId}`,
  UPDATE_SUBCATEGORY: (subcategoryId) =>
    `${API_BASE_URL}/api/v1/category/update-subcategory/${subcategoryId}`,
  DELETE_SUBCATEGORY: (subcategoryId) =>
    `${API_BASE_URL}/api/v1/category/delete-subcategory/${subcategoryId}`,

  ADMIN_CATEGORY_CHANGE_REQUESTS: `${API_BASE_URL}/api/v1/admin/category-change-requests`,
  ADMIN_DECIDE_CATEGORY_CHANGE_REQUEST: (requestId) =>
    `${API_BASE_URL}/api/v1/admin/category-change-requests/${requestId}`,

  ADMIN_PLANS: `${API_BASE_URL}/api/v1/admin/plans`,
  ADMIN_PLAN_BY_ID: (planId) => `${API_BASE_URL}/api/v1/admin/plans/${planId}`,

  ADMIN_REVENUE_POLICY: `${API_BASE_URL}/api/v1/admin/revenue-policy`,
  ADMIN_PLATFORM_REVENUE: `${API_BASE_URL}/api/v1/admin/platform-revenue`,
  ADMIN_PLATFORM_REVENUE_TIMESERIES: `${API_BASE_URL}/api/v1/admin/platform-revenue/timeseries`,

  SURVEYS: `${API_BASE_URL}/api/v1/survey`,
  BLOGS: `${API_BASE_URL}/api/v1/blog`,
  BLOG_BY_ID: (id) => `${API_BASE_URL}/api/v1/blog/${id}`,
};

export const API_ENDPOINTS = API_V1_ENDPOINTS;