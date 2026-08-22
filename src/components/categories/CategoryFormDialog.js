import React from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const CategoryFormDialog = ({
  open,
  mode,
  categoryForm,
  onChange,
  onClose,
  onSubmit,
  saving,
  iconPreviewUrl,
  onIconFileChange,
  uploadingIcon,
}) => {
  const modeIsEdit = mode === "edit";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>{modeIsEdit ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Name"
              required
              fullWidth
              value={categoryForm.name}
              onChange={onChange("name")}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap>
              <TextField
                label="Icon (Ionicons name)"
                fullWidth
                helperText="Used only when no PNG icon is uploaded below"
                value={categoryForm.icon}
                onChange={onChange("icon")}
              />
              <TextField
                label="Color"
                fullWidth
                helperText="Hex color, e.g. #016526"
                value={categoryForm.color}
                onChange={onChange("color")}
              />
            </Stack>
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={categoryForm.order}
              onChange={onChange("order")}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={iconPreviewUrl || undefined}
                variant="rounded"
                sx={{ width: 56, height: 56, bgcolor: categoryForm.color || "#e5e5e5" }}
              >
                {!iconPreviewUrl && (categoryForm.name?.charAt(0)?.toUpperCase() || "?")}
              </Avatar>
              <Stack spacing={0.5}>
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  disabled={saving || uploadingIcon}
                >
                  {iconPreviewUrl ? "Replace PNG Icon" : "Upload PNG Icon"}
                  <input
                    type="file"
                    accept="image/png"
                    hidden
                    onChange={onIconFileChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  {modeIsEdit && !iconPreviewUrl
                    ? "No icon uploaded yet — falls back to the Ionicons name above."
                    : "PNG only. Uploaded after you save the category."}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving || uploadingIcon}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving || uploadingIcon}>
            {saving || uploadingIcon
              ? modeIsEdit
                ? "Saving..."
                : "Adding..."
              : modeIsEdit
              ? "Save Changes"
              : "Add Category"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CategoryFormDialog;
