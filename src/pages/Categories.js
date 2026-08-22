import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  uploadCategoryIconThunk,
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
  // PNG icon upload state — kept separate from categoryForm since it's a
  // file, not a plain field, and is saved via its own upload request.
  const [iconFile, setIconFile] = useState(null);
  const [iconPreviewUrl, setIconPreviewUrl] = useState(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Tracks the object URL we created for the local preview, so we revoke
  // exactly that (never the remote iconImage URL loaded from the category).
  const objectUrlRef = useRef(null);

  const clearIconPreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setIconFile(null);
    setIconPreviewUrl(null);
  }, []);

  useEffect(() => {
    // Revoke any pending local preview URL when the component unmounts.
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

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
    clearIconPreview();
    setCategoryModalOpen(true);
  }, [clearIconPreview]);

  const handleCloseCategoryModal = useCallback(() => {
    if (!savingCategory) {
      setCategoryModalOpen(false);
      clearIconPreview();
    }
  }, [savingCategory, clearIconPreview]);

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
    clearIconPreview();
    setIconPreviewUrl(category.iconImage ?? null);
    setCategoryModalOpen(true);
  }, [clearIconPreview]);

  const handleIconFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      event.target.value = ""; // allow re-selecting the same file later
      if (!file) return;

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const previewUrl = URL.createObjectURL(file);
      objectUrlRef.current = previewUrl;
      setIconFile(file);
      setIconPreviewUrl(previewUrl);
    },
    []
  );

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

      let message;
      let categoryId = activeCategoryId;

      if (categoryModalMode === "edit") {
        message = await dispatch(
          updateCategoryThunk({ categoryId: activeCategoryId, payload })
        ).unwrap();
      } else {
        const created = await dispatch(addCategoryThunk(payload)).unwrap();
        message = created.message;
        categoryId = created.category?._id ?? null;
      }

      // Icon upload is a separate request against the now-known categoryId —
      // its failure shouldn't undo the category save, just surface its own error.
      if (iconFile && categoryId) {
        setUploadingIcon(true);
        try {
          await dispatch(
            uploadCategoryIconThunk({ categoryId, file: iconFile })
          ).unwrap();
        } catch (iconError) {
          setError(
            `Category saved, but the icon upload failed: ${iconError}`
          );
        } finally {
          setUploadingIcon(false);
        }
      }

      setCategoryForm(DEFAULT_CATEGORY_FORM);
      clearIconPreview();
      await fetchCategories();
      if (message) {
        setSuccessMessage(message);
      }
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
        iconPreviewUrl={iconPreviewUrl}
        onIconFileChange={handleIconFileChange}
        uploadingIcon={uploadingIcon}
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

