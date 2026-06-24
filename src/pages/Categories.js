import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert, CircularProgress, Stack } from "@mui/material";
import SideBarLayout from "../layout/SideBarLayout";
import CategoriesHeader from "../components/categories/CategoriesHeader";
import CategoriesEmptyState from "../components/categories/CategoriesEmptyState";
import CategoriesList from "../components/categories/CategoriesList";
import CategoryFormDialog from "../components/categories/CategoryFormDialog";
import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";
import {
  fetchCategoriesThunk,
  addCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "../store/thunks/categoriesThunks";

const DEFAULT_CATEGORY_FORM = {
  name: "",
  icon: "",
  color: "",
  order: "",
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [categoryForm, setCategoryForm] = useState(DEFAULT_CATEGORY_FORM);
  const [savingCategory, setSavingCategory] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("create");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextCategories = await dispatch(fetchCategoriesThunk()).unwrap();
      setCategories(nextCategories);
    } catch (message) {
      setError(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryInputChange = (field) => (event) => {
    const { value } = event.target;
    setCategoryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenCreateCategoryModal = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    setCategoryForm(DEFAULT_CATEGORY_FORM);
    setCategoryModalMode("create");
    setActiveCategoryId(null);
    setCategoryModalOpen(true);
  }, []);

  const handleCloseCategoryModal = useCallback(() => {
    if (!savingCategory) {
      setCategoryModalOpen(false);
    }
  }, [savingCategory]);

  const handleOpenEditCategoryModal = useCallback((category) => {
    if (!category) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setCategoryForm({
      name: category.name ?? "",
      icon: category.icon ?? "",
      color: category.color ?? "",
      order:
        category.order !== undefined && category.order !== null
          ? String(category.order)
          : "",
    });
    setCategoryModalMode("edit");
    setActiveCategoryId(category._id ?? null);
    setCategoryModalOpen(true);
  }, []);

  const handlePromptDeleteCategory = useCallback((category) => {
    setError(null);
    setSuccessMessage(null);
    setCategoryToDelete(category);
  }, []);

  const handleCloseDeleteCategoryDialog = useCallback(() => {
    if (!deletingCategory) {
      setCategoryToDelete(null);
    }
  }, [deletingCategory]);

  const handleConfirmDeleteCategory = useCallback(async () => {
    if (!categoryToDelete?._id) {
      return;
    }

    setDeletingCategory(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const message = await dispatch(
        deleteCategoryThunk(categoryToDelete._id)
      ).unwrap();
      setSuccessMessage(message);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (message) {
      setError(message);
    } finally {
      setDeletingCategory(false);
    }
  }, [categoryToDelete, dispatch, fetchCategories]);

  const handleSubmitCategory = async (event) => {
    event.preventDefault();

    if (savingCategory) return;

    const trimmedName = categoryForm.name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    setSavingCategory(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = { name: trimmedName };

      if (categoryForm.icon.trim()) {
        payload.icon = categoryForm.icon.trim();
      }
      if (categoryForm.color.trim()) {
        payload.color = categoryForm.color.trim();
      }

      const orderValue =
        categoryForm.order !== undefined && categoryForm.order !== null
          ? String(categoryForm.order).trim()
          : "";

      if (orderValue !== "") {
        payload.order = orderValue;
      }

      const message = await (categoryModalMode === "edit"
        ? dispatch(
            updateCategoryThunk({ categoryId: activeCategoryId, payload })
          ).unwrap()
        : dispatch(addCategoryThunk(payload)).unwrap());

      setCategoryForm(DEFAULT_CATEGORY_FORM);
      await fetchCategories();
      setSuccessMessage(message);
      setCategoryModalOpen(false);
      setActiveCategoryId(null);
      setCategoryModalMode("create");
    } catch (message) {
      setError(message);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleManageSubcategories = useCallback(
    (category) => {
      if (!category?._id) {
        return;
      }

      navigate(`/categories/${category._id}`);
    },
    [navigate]
  );

  const header = useMemo(
    () => (
      <CategoriesHeader onCreateCategory={handleOpenCreateCategoryModal} />
    ),
    [handleOpenCreateCategoryModal]
  );

  const content = useMemo(() => {
    if (loading) {
      return (
        <Stack alignItems="center" py={6}>
          <CircularProgress size={32} />
        </Stack>
      );
    }

    if (!categories.length) {
      return (
        <CategoriesEmptyState onCreateCategory={handleOpenCreateCategoryModal} />
      );
    }

    return (
      <CategoriesList
        categories={categories}
        onManageSubcategories={handleManageSubcategories}
        onEditCategory={handleOpenEditCategoryModal}
        onDeleteCategory={handlePromptDeleteCategory}
      />
    );
  }, [
    loading,
    categories,
    handleOpenCreateCategoryModal,
    handleManageSubcategories,
    handleOpenEditCategoryModal,
    handlePromptDeleteCategory,
  ]);

  return (
    <SideBarLayout header={header}>
      <Stack spacing={2}>
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            data-testid="categories-error"
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            data-testid="categories-success"
          >
            {successMessage}
          </Alert>
        )}
        {content}
      </Stack>

      <CategoryFormDialog
        open={isCategoryModalOpen}
        mode={categoryModalMode}
        categoryForm={categoryForm}
        onChange={handleCategoryInputChange}
        onClose={handleCloseCategoryModal}
        onSubmit={handleSubmitCategory}
        saving={savingCategory}
      />

      <DeleteCategoryDialog
        open={Boolean(categoryToDelete)}
        category={categoryToDelete}
        onClose={handleCloseDeleteCategoryDialog}
        onConfirm={handleConfirmDeleteCategory}
        loading={deletingCategory}
      />
    </SideBarLayout>
  );
};

export default Categories;

