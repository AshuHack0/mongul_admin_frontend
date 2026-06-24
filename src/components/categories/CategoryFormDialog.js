import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

const CategoryFormDialog = ({
  open,
  mode,
  categoryForm,
  onChange,
  onClose,
  onSubmit,
  saving,
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
                label="Icon"
                fullWidth
                value={categoryForm.icon}
                onChange={onChange("icon")}
              />
              <TextField
                label="Color"
                fullWidth
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving
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
