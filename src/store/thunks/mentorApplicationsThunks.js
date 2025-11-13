import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../util/axios";
import { API_ENDPOINTS } from "../../config/api";

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage;

export const fetchMentorApplicationsThunk = createAsyncThunk(
  "mentorApplications/fetchAll",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(
        API_ENDPOINTS.ADMIN_MENTOR_APPLICATIONS,
        {
          params: { page, limit },
        }
      );

      return {
        applications: data?.applications ?? [],
        pagination: {
          page: data?.pagination?.page ?? page,
          limit: data?.pagination?.limit ?? limit,
          total: data?.pagination?.total ?? 0,
          totalPages: data?.pagination?.totalPages ?? 0,
        },
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load mentor applications.")
      );
    }
  }
);

export const approveMentorApplicationThunk = createAsyncThunk(
  "mentorApplications/approve",
  async (applicationId, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(
        API_ENDPOINTS.ADMIN_UPDATE_MENTOR_APPLICATION_STATUS(applicationId),
        {
          status: "approved",
        }
      );
      return data?.message || "Application approved successfully.";
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to approve mentor application.")
      );
    }
  }
);

export const fetchMentorApplicationByIdThunk = createAsyncThunk(
  "mentorApplications/fetchById",
  async (applicationId, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(
        API_ENDPOINTS.ADMIN_MENTOR_APPLICATION_BY_ID(applicationId)
      );

      return data?.application ?? data ?? {};
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load mentor application details.")
      );
    }
  }
);

export const rejectMentorApplicationThunk = createAsyncThunk(
  "mentorApplications/reject",
  async ({ applicationId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(
        API_ENDPOINTS.ADMIN_UPDATE_MENTOR_APPLICATION_STATUS(applicationId),
        {
          status: "rejected",
          reason,
        }
      );
      return data?.message || "Application rejected successfully.";
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to reject mentor application.")
      );
    }
  }
);
