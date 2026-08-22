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

export const fetchPlatformRevenueThunk = createAsyncThunk(
  "platformRevenue/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(API_ENDPOINTS.ADMIN_PLATFORM_REVENUE);
      const emptyPeriod = {
        grossRevenue: 0,
        mentorShare: 0,
        platformRevenue: 0,
        actualMentorPayouts: 0,
        paymentCount: 0,
      };
      return {
        allTime: data?.allTime ?? emptyPeriod,
        thisMonth: data?.thisMonth ?? emptyPeriod,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load platform revenue.")
      );
    }
  }
);

export const fetchPlatformRevenueTimeseriesThunk = createAsyncThunk(
  "platformRevenue/fetchTimeseries",
  async (days = 30, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(
        API_ENDPOINTS.ADMIN_PLATFORM_REVENUE_TIMESERIES,
        { params: { days } }
      );
      return data?.series ?? [];
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load revenue trend.")
      );
    }
  }
);
