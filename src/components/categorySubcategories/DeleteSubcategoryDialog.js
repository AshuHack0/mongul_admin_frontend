import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteSubcategoryDialog = ({
  open,
  subcategory,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Delete Subcategory</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2">
          Are you sure you want to delete{" "}
          <Typography component="span" fontWeight={600}>
            {subcategory?.name ?? "this subcategory"}
          </Typography>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSubcategoryDialog;
