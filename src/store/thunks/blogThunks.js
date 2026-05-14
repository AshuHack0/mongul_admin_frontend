import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../util/axios";
import { API_ENDPOINTS } from "../../config/api";

const getErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage;

export const fetchBlogsThunk = createAsyncThunk(
  "blogs/fetchAll",
  async ({ page = 1, limit = 10, status } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;

      const { data } = await privateApi.get(API_ENDPOINTS.BLOGS, { params });

      return {
        blogs: data?.blogs ?? [],
        total: data?.pagination?.total ?? 0,
        page: data?.pagination?.page ?? page,
        limit: data?.pagination?.limit ?? limit,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load blogs."));
    }
  }
);

export const fetchBlogByIdThunk = createAsyncThunk(
  "blogs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(API_ENDPOINTS.BLOG_BY_ID(id));
      return data?.blog;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load blog."));
    }
  }
);

export const createBlogThunk = createAsyncThunk(
  "blogs/create",
  async (blogData, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.post(API_ENDPOINTS.BLOGS, blogData);
      return data?.blog;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create blog."));
    }
  }
);

export const updateBlogThunk = createAsyncThunk(
  "blogs/update",
  async ({ id, data: blogData }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(API_ENDPOINTS.BLOG_BY_ID(id), blogData);
      return data?.blog;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update blog."));
    }
  }
);

export const deleteBlogThunk = createAsyncThunk(
  "blogs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await privateApi.delete(API_ENDPOINTS.BLOG_BY_ID(id));
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete blog."));
    }
  }
);
