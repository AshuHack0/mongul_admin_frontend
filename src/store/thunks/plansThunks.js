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

// Admin "plans" endpoints return every plan regardless of isActive —
// this is deliberately unfiltered so the admin can see the true DB state
// (unlike the mentee-facing plan list, which only shows active plans).
export const fetchPlansThunk = createAsyncThunk(
  "plans/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(API_ENDPOINTS.ADMIN_PLANS);
      return data?.plans ?? data?.data ?? [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load plans."));
    }
  }
);

export const createPlanThunk = createAsyncThunk(
  "plans/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.post(API_ENDPOINTS.ADMIN_PLANS, payload);
      return {
        message: data?.message || "Plan created successfully.",
        plan: data?.plan ?? data?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create plan."));
    }
  }
);

export const updatePlanThunk = createAsyncThunk(
  "plans/update",
  async ({ planId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(
        API_ENDPOINTS.ADMIN_PLAN_BY_ID(planId),
        payload
      );
      return {
        message: data?.message || "Plan updated successfully.",
        plan: data?.plan ?? data?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update plan."));
    }
  }
);
