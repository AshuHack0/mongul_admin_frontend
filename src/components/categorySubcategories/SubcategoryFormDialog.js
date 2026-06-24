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

const SubcategoryFormDialog = ({
  open,
  mode,
  form,
  onChange,
  onClose,
  onSubmit,
  submitting,
}) => {
  const modeIsEdit = mode === "edit";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>{modeIsEdit ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Name"
              required
              fullWidth
              value={form.name}
              onChange={onChange("name")}
            />
            <TextField
              label="Tags (comma separated)"
              fullWidth
              value={form.tags}
              onChange={onChange("tags")}
            />
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={form.order}
              onChange={onChange("order")}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting
              ? modeIsEdit
                ? "Saving..."
                : "Adding..."
              : modeIsEdit
              ? "Save Changes"
              : "Add Subcategory"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SubcategoryFormDialog;
