import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const SubcategoryFormDialog = ({
  open,
  mode,
  form,
  onChange,
  onToggle,
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

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                "Before you join" popup
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Shown to a mentee before their request is sent to a mentor.
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(form.bjEnabled)}
                  onChange={onToggle("bjEnabled")}
                />
              }
              label="Show popup for this subcategory"
            />

            <TextField
              label="Intro line"
              placeholder="A plumber will join you on video to diagnose the issue and, where it's safe, walk you through it."
              fullWidth
              multiline
              minRows={2}
              value={form.bjIntro}
              onChange={onChange("bjIntro")}
              disabled={!form.bjEnabled}
            />
            <TextField
              label="Get set up — checklist (one item per line)"
              placeholder={
                "Be near the problem, main shut-off in reach\n" +
                "Good lighting and a steady signal\n" +
                "Phone charged, basic tools nearby"
              }
              fullWidth
              multiline
              minRows={3}
              value={form.bjChecklist}
              onChange={onChange("bjChecklist")}
              disabled={!form.bjEnabled}
            />
            <TextField
              label="Warning / emergency line"
              placeholder="Gas smell, flooding, sewage, or no water at all? Skip video —"
              fullWidth
              multiline
              minRows={2}
              value={form.bjWarning}
              onChange={onChange("bjWarning")}
              disabled={!form.bjEnabled}
            />
            <TextField
              label="Helpline phone"
              placeholder="(912) 555-0143"
              fullWidth
              value={form.bjPhone}
              onChange={onChange("bjPhone")}
              disabled={!form.bjEnabled}
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
