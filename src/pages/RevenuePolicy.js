import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SideBarLayout from "../layout/SideBarLayout";
import {
  fetchRevenuePolicyThunk,
  updateRevenuePolicyThunk,
} from "../store/thunks/revenuePolicyThunks";

// Session revenue always splits 100% between mentor and platform, so the
// form only asks for the mentor's share — platform share is derived here
// rather than asking the admin to keep two numbers in sync (the backend
// rejects the pair if they don't add up to 100 anyway).
const DEFAULT_FORM = {
  mentorSessionSharePercent: "75",
  mentorTipSharePercent: "100",
};

const RevenuePolicy = () => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const dispatch = useDispatch();

  const fetchPolicy = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const policy = await dispatch(fetchRevenuePolicyThunk()).unwrap();
      if (policy) {
        setForm({
          mentorSessionSharePercent: String(policy.mentorSessionSharePercent),
          mentorTipSharePercent: String(policy.mentorTipSharePercent),
        });
        setLastUpdated(policy.updatedAt || null);
      }
    } catch (message) {
      // A 404 ("no policy yet — run the seed") isn't really an error state
      // here — the form still works, it just creates the policy on first save.
      if (typeof message === "string" && message.toLowerCase().includes("no revenue policy")) {
        setLastUpdated(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const mentorSessionShare = Number(form.mentorSessionSharePercent);
  const platformSessionShare = Number.isFinite(mentorSessionShare)
    ? Math.round((100 - mentorSessionShare) * 100) / 100
    : null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    if (
      form.mentorSessionSharePercent === "" ||
      Number.isNaN(mentorSessionShare) ||
      mentorSessionShare < 0 ||
      mentorSessionShare > 100
    ) {
      setError("Mentor session share must be a number between 0 and 100.");
      return;
    }

    const mentorTipShare = Number(form.mentorTipSharePercent);
    if (
      form.mentorTipSharePercent === "" ||
      Number.isNaN(mentorTipShare) ||
      mentorTipShare < 0 ||
      mentorTipShare > 100
    ) {
      setError("Mentor tip share must be a number between 0 and 100.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { message, policy } = await dispatch(
        updateRevenuePolicyThunk({
          mentorSessionSharePercent: mentorSessionShare,
          platformSessionSharePercent: platformSessionShare,
          mentorTipSharePercent: mentorTipShare,
        })
      ).unwrap();

      setSuccessMessage(message);
      if (policy) {
        setLastUpdated(policy.updatedAt || null);
      }
    } catch (message) {
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const header = useMemo(
    () => (
      <Stack spacing={0.25}>
        <Typography style={{ fontWeight: 700, fontSize: "1.05rem", color: "#111111" }}>
          Revenue Policy
        </Typography>
        <Typography style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>
          Controls how session revenue and tips are split between mentors and
          the platform. Applies platform-wide, not per plan.
        </Typography>
      </Stack>
    ),
    []
  );

  return (
    <SideBarLayout header={header}>
      <Stack spacing={2}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} data-testid="revenue-policy-error">
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            data-testid="revenue-policy-success"
          >
            {successMessage}
          </Alert>
        )}

        {loading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress size={32} />
          </Stack>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              padding: "20px 22px",
              maxWidth: 480,
            }}
          >
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Typography style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111111" }}>
                  Session revenue split
                </Typography>
                <TextField
                  label="Mentor session share (%)"
                  type="number"
                  required
                  fullWidth
                  value={form.mentorSessionSharePercent}
                  onChange={handleChange("mentorSessionSharePercent")}
                  inputProps={{ step: "0.01", min: "0", max: "100" }}
                />
                <Typography style={{ fontSize: "0.8rem", color: "#71717a" }}>
                  Platform keeps the remainder:{" "}
                  <strong>
                    {platformSessionShare !== null ? `${platformSessionShare}%` : "—"}
                  </strong>{" "}
                  (covers Stripe fees, servers, marketing, taxes, etc.)
                </Typography>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                <Typography style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111111" }}>
                  Tips
                </Typography>
                <TextField
                  label="Mentor tip share (%)"
                  type="number"
                  required
                  fullWidth
                  value={form.mentorTipSharePercent}
                  onChange={handleChange("mentorTipSharePercent")}
                  inputProps={{ step: "0.01", min: "0", max: "100" }}
                  helperText="Usually 100 — tips go entirely to the mentor"
                />
              </Stack>

              {lastUpdated && (
                <Typography style={{ fontSize: "0.75rem", color: "#a1a1aa" }}>
                  Last updated {new Date(lastUpdated).toLocaleString()}
                </Typography>
              )}

              <Stack direction="row" justifyContent="flex-end">
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </SideBarLayout>
  );
};

export default RevenuePolicy;
