import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../util/axios";
import { API_ENDPOINTS } from "../../config/api";

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage;

export const fetchCategoryChangeRequestsThunk = createAsyncThunk(
  "categoryChangeRequests/fetchAll",
  async ({ page, limit, status }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(
        API_ENDPOINTS.ADMIN_CATEGORY_CHANGE_REQUESTS,
        { params: { page, limit, status } }
      );
      return {
        requests: data?.requests ?? [],
        pagination: {
          page: data?.pagination?.page ?? page,
          limit: data?.pagination?.limit ?? limit,
          total: data?.pagination?.total ?? 0,
          totalPages: data?.pagination?.totalPages ?? 0,
        },
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load category change requests.")
      );
    }
  }
);

export const decideCategoryChangeRequestThunk = createAsyncThunk(
  "categoryChangeRequests/decide",
  async ({ requestId, decision, adminNote }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(
        API_ENDPOINTS.ADMIN_DECIDE_CATEGORY_CHANGE_REQUEST(requestId),
        { decision, adminNote }
      );
      return data?.message || `Request ${decision} successfully.`;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, `Failed to ${decision} request.`)
      );
    }
  }
);
