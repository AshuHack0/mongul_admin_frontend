import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../util/axios";
import { API_ENDPOINTS } from "../../config/api";

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage;

export const fetchMentorsThunk = createAsyncThunk(
  "mentors/fetchAll",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(API_ENDPOINTS.ADMIN_MENTORS, {
        params: { page, limit },
      });

      return {
        mentors: data?.mentors ?? [],
        pagination: {
          page: data?.pagination?.page ?? page,
          limit: data?.pagination?.limit ?? limit,
          total: data?.pagination?.total ?? 0,
          totalPages: data?.pagination?.totalPages ?? 0,
        },
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load mentors."));
    }
  }
);


