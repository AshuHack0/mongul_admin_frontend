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

export const fetchCategoriesThunk = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.get(API_ENDPOINTS.CATEGORIES);
      return data?.categories ?? [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to load categories."));
    }
  }
);

export const addCategoryThunk = createAsyncThunk(
  "categories/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.post(API_ENDPOINTS.ADD_CATEGORY, payload);
      return {
        message: data?.message || "Category added successfully.",
        category: data?.category ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add category.")
      );
    }
  }
);

export const uploadCategoryIconThunk = createAsyncThunk(
  "categories/uploadIcon",
  async ({ categoryId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("icon", file);

      const { data } = await privateApi.post(
        API_ENDPOINTS.UPLOAD_CATEGORY_ICON(categoryId),
        formData
      );
      return {
        message: data?.message || "Category icon uploaded successfully.",
        category: data?.category ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to upload category icon.")
      );
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  "categories/update",
  async ({ categoryId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(
        API_ENDPOINTS.UPDATE_CATEGORY(categoryId),
        payload
      );
      return data?.message || "Category updated successfully.";
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update category.")
      );
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  "categories/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.delete(
        API_ENDPOINTS.DELETE_CATEGORY(categoryId)
      );
      return data?.message || "Category deleted successfully.";
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete category.")
      );
    }
  }
);

export const addSubcategoryThunk = createAsyncThunk(
  "subcategories/add",
  async ({ categoryId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.post(
        API_ENDPOINTS.ADD_SUBCATEGORY(categoryId),
        payload
      );
      return data?.message || "Subcategory added successfully.";
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to add subcategory.")
      );
    }
  }
);

export const updateSubcategoryThunk = createAsyncThunk(
  "subcategories/update",
  async ({ subcategoryId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.put(
        API_ENDPOINTS.UPDATE_SUBCATEGORY(subcategoryId),
        payload
      );
      return data?.message || "Subcategory updated successfully.";
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update subcategory.")
      );
    }
  }
);

export const deleteSubcategoryThunk = createAsyncThunk(
  "subcategories/delete",
  async (subcategoryId, { rejectWithValue }) => {
    try {
      const { data } = await privateApi.delete(
        API_ENDPOINTS.DELETE_SUBCATEGORY(subcategoryId)
      );
      return data?.message || "Subcategory deleted successfully.";
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete subcategory.")
      );
    }
  }
);
