import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../util/axios";
import { API_ENDPOINTS } from "../../config/api";

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

export const fetchDashboardStatsThunk = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(API_ENDPOINTS.ADMIN_DASHBOARD_STATS);
      return data?.data || data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load dashboard statistics.")
      );
    }
  }
);
