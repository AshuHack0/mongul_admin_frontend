import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

// Minimum chargeable plan price in USD — mirrors MIN_PLAN_PRICE on the backend.
export const MIN_PLAN_PRICE = 2;

const KIND_OPTIONS = [
  { value: "SUBSCRIPTION", label: "Subscription" },
  { value: "QUICK_FIX", label: "One-time (Quick Fix)" },
];

const TYPE_OPTIONS = [
  { value: "BASIC", label: "Basic" },
  { value: "PRO", label: "Pro" },
];

const BILLING_INTERVAL_OPTIONS = [
  { value: "none", label: "None (one-time)" },
  { value: "month", label: "Monthly" },
];

const PlanFormDialog = ({ open, planForm, onChange, onClose, onSubmit, saving }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={onSubmit}>
        <DialogTitle>Create Plan</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Key"
              required
              fullWidth
              value={planForm.key}
              onChange={onChange("key")}
              helperText="Unique identifier, letters/numbers/underscores only (e.g. ONE_TIME_STANDARD). Saved in UPPERCASE."
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap>
              <TextField
                select
                label="Kind"
                required
                fullWidth
                value={planForm.kind}
                onChange={onChange("kind")}
              >
                {KIND_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Type"
                required
                fullWidth
                value={planForm.type}
                onChange={onChange("type")}
              >
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap>
              <TextField
                label="Display Name"
                fullWidth
                value={planForm.displayName}
                onChange={onChange("displayName")}
                helperText="Shown to mentees; falls back to key if blank"
              />
              <TextField
                label="Short Label"
                fullWidth
                value={planForm.shortLabel}
                onChange={onChange("shortLabel")}
                helperText='Used in buttons, e.g. "Standard"'
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap>
              <TextField
                label="Price"
                type="number"
                required
                fullWidth
                value={planForm.price}
                onChange={onChange("price")}
                inputProps={{ step: "0.01", min: String(MIN_PLAN_PRICE) }}
                helperText={`Minimum $${MIN_PLAN_PRICE}`}
              />
              <TextField
                select
                label="Billing Interval"
                fullWidth
                value={planForm.billingInterval}
                onChange={onChange("billingInterval")}
              >
                {BILLING_INTERVAL_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} useFlexGap>
              <TextField
                label="Sessions Per Cycle"
                type="number"
                required
                fullWidth
                value={planForm.sessionsPerCycle}
                onChange={onChange("sessionsPerCycle")}
                inputProps={{ step: "1", min: "1" }}
              />
              <TextField
                label="Mentor Payout Per Session"
                type="number"
                required
                fullWidth
                value={planForm.mentorPayoutPerSession}
                onChange={onChange("mentorPayoutPerSession")}
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Stack>

            <TextField
              label="Features"
              required
              fullWidth
              multiline
              minRows={2}
              value={planForm.features}
              onChange={onChange("features")}
              helperText="One feature per line"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={planForm.isActive}
                  onChange={(event) =>
                    onChange("isActive")({ target: { value: event.target.checked } })
                  }
                  color="success"
                />
              }
              label={
                <Typography variant="body2">
                  Active — visible to mentees immediately
                </Typography>
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Creating..." : "Create Plan"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PlanFormDialog;
