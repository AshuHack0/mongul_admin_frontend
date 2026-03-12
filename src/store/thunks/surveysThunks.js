import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../util/axios";
import { API_ENDPOINTS } from "../../config/api";

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage;

export const fetchSurveysThunk = createAsyncThunk(
  "surveys/fetchAll",
  async ({ page, limit, type }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (type) params.type = type;

      const { data } = await privateApi.get(API_ENDPOINTS.SURVEYS, { params });

      return {
        surveys: data?.surveys ?? [],
        total: data?.total ?? 0,
        page: data?.page ?? page,
        limit: data?.limit ?? limit,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load surveys.")
      );
    }
  }
);
