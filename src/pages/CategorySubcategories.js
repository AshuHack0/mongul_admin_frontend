import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import SideBarLayout from "../layout/SideBarLayout";
import CategorySubcategoriesHeader from "../components/categorySubcategories/CategorySubcategoriesHeader";
import CategoryNotFoundCard from "../components/categorySubcategories/CategoryNotFoundCard";
import SubcategoryListSection from "../components/categorySubcategories/SubcategoryListSection";
import SubcategoryFormDialog from "../components/categorySubcategories/SubcategoryFormDialog";
import DeleteSubcategoryDialog from "../components/categorySubcategories/DeleteSubcategoryDialog";
import {
  fetchCategoriesThunk,
  addSubcategoryThunk,
  updateSubcategoryThunk,
  deleteSubcategoryThunk,
} from "../store/thunks/categoriesThunks";

const DEFAULT_FORM_STATE = {
  name: "",
  tags: "",
  order: "",
  bjEnabled: true,
  bjIntro: "",
  bjChecklist: "",
  bjWarning: "",
  bjPhone: "",
};

const parseTags = (value = "") =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const parseChecklist = (value = "") =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const CategorySubcategories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM_STATE);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeSubcategoryId, setActiveSubcategoryId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const [deletingSubcategory, setDeletingSubcategory] = useState(false);

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const categories = await dispatch(fetchCategoriesThunk()).unwrap();
      const foundCategory = categories.find((item) => item._id === categoryId);

      if (!foundCategory) {
        setCategory(null);
        setError("Category not found.");
      } else {
        setCategory(foundCategory);
      }
    } catch (message) {
      setError(message);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  const handleOpenCreateModal = () => {
    setError(null);
    setSuccessMessage(null);
    setForm(DEFAULT_FORM_STATE);
    setModalMode("create");
    setActiveSubcategoryId(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!submitting) {
      setModalOpen(false);
    }
  };

  const handleOpenEditModal = (subcategory) => {
    if (!subcategory) {
      return;
    }

    setError(null);
    setSuccessMessage(null);
    const preCallInfo = subcategory.preCallInfo ?? {};
    setForm({
      name: subcategory.name ?? "",
      tags: Array.isArray(subcategory.tags)
        ? subcategory.tags.join(", ")
        : "",
      order:
        subcategory.order !== undefined && subcategory.order !== null
          ? String(subcategory.order)
          : "",
      bjEnabled: preCallInfo.enabled !== false,
      bjIntro: preCallInfo.introText ?? "",
      bjChecklist: Array.isArray(preCallInfo.checklist)
        ? preCallInfo.checklist.join("\n")
        : "",
      bjWarning: preCallInfo.warningText ?? "",
      bjPhone: preCallInfo.helplinePhone ?? "",
    });
    setModalMode("edit");
    setActiveSubcategoryId(subcategory._id ?? null);
    setModalOpen(true);
  };

  const handlePromptDeleteSubcategory = (subcategory) => {
    setError(null);
    setSuccessMessage(null);
    setSubcategoryToDelete(subcategory);
  };

  const handleCloseDeleteSubcategoryDialog = () => {
    if (!deletingSubcategory) {
      setSubcategoryToDelete(null);
    }
  };

  const handleConfirmDeleteSubcategory = async () => {
    if (!subcategoryToDelete?._id) {
      return;
    }

    setDeletingSubcategory(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const message = await dispatch(
        deleteSubcategoryThunk(subcategoryToDelete._id)
      ).unwrap();
      setSuccessMessage(message);
      setSubcategoryToDelete(null);
      await fetchCategory();
    } catch (message) {
      setError(message);
    } finally {
      setDeletingSubcategory(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleChange = (field) => (event) => {
    const { checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSubmitSubcategory = async (event) => {
    event.preventDefault();

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      setError("Subcategory name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: trimmedName,
        tags: parseTags(form.tags),
        preCallInfo: {
          enabled: Boolean(form.bjEnabled),
          introText: form.bjIntro.trim(),
          checklist: parseChecklist(form.bjChecklist),
          warningText: form.bjWarning.trim(),
          helplinePhone: form.bjPhone.trim(),
        },
      };

      const orderValue =
        form.order !== undefined && form.order !== null
          ? String(form.order).trim()
          : "";

      if (orderValue !== "") {
        payload.order = orderValue;
      }

      const message = await (modalMode === "edit"
        ? dispatch(
            updateSubcategoryThunk({
              subcategoryId: activeSubcategoryId,
              payload,
            })
          ).unwrap()
        : dispatch(
            addSubcategoryThunk({ categoryId, payload })
          ).unwrap());

      setForm(DEFAULT_FORM_STATE);
      setSuccessMessage(message);
      setModalMode("create");
      setActiveSubcategoryId(null);
      setModalOpen(false);
      await fetchCategory();
    } catch (message) {
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const header = useMemo(
    () => (
      <CategorySubcategoriesHeader
        category={category}
        loading={loading}
        onBack={() => navigate("/categories")}
        onCreate={handleOpenCreateModal}
      />
    ),
    [category, loading, navigate, handleOpenCreateModal]
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Stack alignItems="center" py={6}>
          <CircularProgress size={32} />
        </Stack>
      );
    }

    if (!category) {
      return <CategoryNotFoundCard onBack={() => navigate("/categories")} />;
    }

    const subcategories = Array.isArray(category.subcategories)
      ? category.subcategories
      : [];

    return (
      <Stack spacing={3} sx={{ flexGrow: 1 }}>
        <SubcategoryListSection
          subcategories={subcategories}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearSearch={() => setSearchTerm("")}
          onEdit={handleOpenEditModal}
          onDelete={handlePromptDeleteSubcategory}
        />
      </Stack>
    );
  };

  return (
    <SideBarLayout header={header}>
      <Stack
        spacing={2}
        sx={{
          flexGrow: 1,
          minHeight: { xs: "calc(100vh - 160px)", md: "calc(100vh - 180px)" },
        }}
      >
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            data-testid="category-subcategories-error"
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            data-testid="category-subcategories-success"
          >
            {successMessage}
          </Alert>
        )}
        {renderContent()}
      </Stack>

      <SubcategoryFormDialog
        open={modalOpen}
        mode={modalMode}
        form={form}
        onChange={handleInputChange}
        onToggle={handleToggleChange}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSubcategory}
        submitting={submitting}
      />

      <DeleteSubcategoryDialog
        open={Boolean(subcategoryToDelete)}
        subcategory={subcategoryToDelete}
        onClose={handleCloseDeleteSubcategoryDialog}
        onConfirm={handleConfirmDeleteSubcategory}
        loading={deletingSubcategory}
      />
    </SideBarLayout>
  );
};

export default CategorySubcategories;

