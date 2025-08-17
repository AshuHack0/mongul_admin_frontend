import { createSlice } from "@reduxjs/toolkit";

/**
 * UI slice for managing application UI state
 * Implements production-grade state management with clear separation of concerns
 */
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    // Loading states
    isLoading: false,
    loadingMessage: "",

    // Notification system
    notifications: [],

    // Sidebar state
    sidebarOpen: true,
    sidebarCollapsed: false,

    // Mobile responsiveness
    isMobile: false,
    showMobileDialog: false,

    // Theme preferences
    theme: "light",

    // Modal states
    modals: {
      mentorModal: false,
      userModal: false,
      deleteConfirmModal: false,
    },

    // Pagination state
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    },

    // Search and filters
    search: {
      query: "",
      filters: {},
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  },
  reducers: {
    /**
     * Set loading state
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || "";
    },

    /**
     * Add notification
     */
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: action.payload.type || "info",
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },

    /**
     * Remove notification
     */
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    /**
     * Clear all notifications
     */
    clearNotifications: (state) => {
      state.notifications = [];
    },

    /**
     * Toggle sidebar
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    /**
     * Set sidebar state
     */
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    /**
     * Toggle sidebar collapsed state
     */
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    /**
     * Set mobile state
     */
    setMobileState: (state, action) => {
      state.isMobile = action.payload.isMobile;
      state.showMobileDialog = action.payload.showMobileDialog || false;
    },

    /**
     * Toggle mobile dialog
     */
    toggleMobileDialog: (state) => {
      state.showMobileDialog = !state.showMobileDialog;
    },

    /**
     * Set theme
     */
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    /**
     * Toggle theme
     */
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },

    /**
     * Set modal state
     */
    setModalState: (state, action) => {
      const { modalName, isOpen } = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = isOpen;
      }
    },

    /**
     * Close all modals
     */
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },

    /**
     * Set pagination state
     */
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    /**
     * Set search and filters
     */
    setSearch: (state, action) => {
      state.search = { ...state.search, ...action.payload };
    },

    /**
     * Clear search and filters
     */
    clearSearch: (state) => {
      state.search = {
        query: "",
        filters: {},
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },

    /**
     * Reset UI state to initial values
     */
    resetUI: (state) => {
      state.isLoading = false;
      state.loadingMessage = "";
      state.notifications = [];
      state.modals = {
        mentorModal: false,
        userModal: false,
        deleteConfirmModal: false,
      };
      state.pagination = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
      };
      state.search = {
        query: "",
        filters: {},
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
  },
});

// Export actions
export const {
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setMobileState,
  toggleMobileDialog,
  setTheme,
  toggleTheme,
  setModalState,
  closeAllModals,
  setPagination,
  setSearch,
  clearSearch,
  resetUI,
} = uiSlice.actions;

// Export selectors
export const selectUI = (state) => state.ui;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectNotifications = (state) => state.ui.notifications;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectShowMobileDialog = (state) => state.ui.showMobileDialog;
export const selectTheme = (state) => state.ui.theme;
export const selectModals = (state) => state.ui.modals;
export const selectPagination = (state) => state.ui.pagination;
export const selectSearch = (state) => state.ui.search;

export default uiSlice.reducer;
