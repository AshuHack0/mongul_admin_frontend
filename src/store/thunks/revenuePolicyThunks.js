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

export const fetchRevenuePolicyThunk = createAsyncThunk(
  "revenuePolicy/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(API_ENDPOINTS.ADMIN_REVENUE_POLICY);
      return data?.policy ?? data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load revenue policy.")
      );
    }
  }
);

export const updateRevenuePolicyThunk = createAsyncThunk(
  "revenuePolicy/update",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(
        API_ENDPOINTS.ADMIN_REVENUE_POLICY,
        payload
      );
      return {
        message: data?.message || "Revenue policy updated successfully.",
        policy: data?.policy ?? data?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update revenue policy.")
      );
    }
  }
);
