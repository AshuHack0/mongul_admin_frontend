import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button, CircularProgress, Stack, Typography } from "@mui/material";
import SideBarLayout from "../layout/SideBarLayout";
import PlansList from "../components/plans/PlansList";
import PlanFormDialog from "../components/plans/PlanFormDialog";
import {
  fetchPlansThunk,
  createPlanThunk,
  updatePlanThunk,
} from "../store/thunks/plansThunks";
import { fetchRevenuePolicyThunk } from "../store/thunks/revenuePolicyThunks";

const DEFAULT_PLAN_FORM = {
  key: "",
  kind: "QUICK_FIX",
  type: "BASIC",
  displayName: "",
  shortLabel: "",
  price: "",
  billingInterval: "none",
  sessionsPerCycle: "1",
  mentorPayoutPerSession: "",
  rolloverLimit: "0",
  maxSessionsAllowed: "1",
  expiryRolloverInMonths: "",
  features: "",
  isActive: true,
};

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [togglingPlanId, setTogglingPlanId] = useState(null);
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState(DEFAULT_PLAN_FORM);
  const [savingPlan, setSavingPlan] = useState(false);
  const [revenuePolicy, setRevenuePolicy] = useState({
    mentorSessionSharePercent: 75,
    platformSessionSharePercent: 25,
    mentorTipSharePercent: 100,
  });

  const dispatch = useDispatch();

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextPlans = await dispatch(fetchPlansThunk()).unwrap();
      setPlans(nextPlans);
    } catch (message) {
      setError(message);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPlans();
    dispatch(fetchRevenuePolicyThunk())
      .unwrap()
      .then((policy) => {
        if (policy) {
          setRevenuePolicy(policy);
        }
      })
      .catch(() => {});
  }, [fetchPlans, dispatch]);

  const handleToggleActive = useCallback(
    async (plan, nextIsActive) => {
      setError(null);
      setSuccessMessage(null);
      setTogglingPlanId(plan._id);

      try {
        const { message, plan: updatedPlan } = await dispatch(
          updatePlanThunk({ planId: plan._id, payload: { isActive: nextIsActive } })
        ).unwrap();

        setPlans((prev) =>
          prev.map((p) =>
            p._id === plan._id ? { ...p, ...(updatedPlan || { isActive: nextIsActive }) } : p
          )
        );
        setSuccessMessage(message);
      } catch (message) {
        setError(message);
      } finally {
        setTogglingPlanId(null);
      }
    },
    [dispatch]
  );

  const handleOpenCreatePlanModal = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    setPlanForm(DEFAULT_PLAN_FORM);
    setPlanModalOpen(true);
  }, []);

  const handleClosePlanModal = useCallback(() => {
    if (!savingPlan) {
      setPlanModalOpen(false);
    }
  }, [savingPlan]);

  const handlePlanInputChange = (field) => (event) => {
    const { value } = event.target;
    if (field === "kind") {
      const isSub = value === "SUBSCRIPTION";
      const sessions = isSub ? 3 : 1;
      const price = Number(planForm.price);
      const mentorPercent = revenuePolicy?.mentorSessionSharePercent ?? 75;
      const payout =
        Number.isFinite(price) && price > 0
          ? ((price / sessions) * (mentorPercent / 100)).toFixed(2)
          : planForm.mentorPayoutPerSession;

      setPlanForm((prev) => ({
        ...prev,
        kind: value,
        billingInterval: isSub ? "month" : "none",
        sessionsPerCycle: String(sessions),
        mentorPayoutPerSession: payout,
        rolloverLimit: isSub ? "1" : "0",
        maxSessionsAllowed: isSub ? "4" : "1",
        expiryRolloverInMonths: isSub ? "3" : "",
      }));
      return;
    }

    if (field === "price" || field === "sessionsPerCycle") {
      const nextPrice = field === "price" ? Number(value) : Number(planForm.price);
      const nextSessions = field === "sessionsPerCycle" ? Number(value) : Number(planForm.sessionsPerCycle);
      const mentorPercent = revenuePolicy?.mentorSessionSharePercent ?? 75;

      let nextPayout = planForm.mentorPayoutPerSession;
      if (Number.isFinite(nextPrice) && nextPrice > 0 && Number.isFinite(nextSessions) && nextSessions > 0) {
        nextPayout = ((nextPrice / nextSessions) * (mentorPercent / 100)).toFixed(2);
      }

      setPlanForm((prev) => ({
        ...prev,
        [field]: value,
        mentorPayoutPerSession: nextPayout,
      }));
      return;
    }

    setPlanForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAutoCalculatePayout = useCallback(() => {
    const price = Number(planForm.price);
    const sessions = Number(planForm.sessionsPerCycle) || 1;
    const mentorPercent = revenuePolicy?.mentorSessionSharePercent ?? 75;
    if (Number.isFinite(price) && price > 0 && sessions > 0) {
      const calculated = ((price / sessions) * (mentorPercent / 100)).toFixed(2);
      setPlanForm((prev) => ({
        ...prev,
        mentorPayoutPerSession: calculated,
      }));
    }
  }, [planForm.price, planForm.sessionsPerCycle, revenuePolicy]);

  const handleSubmitPlan = async (event) => {
    event.preventDefault();

    if (savingPlan) return;

    const trimmedKey = planForm.key.trim();
    const features = planForm.features
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!trimmedKey) {
      setError("Plan key is required.");
      return;
    }
    if (!features.length) {
      setError("At least one feature is required.");
      return;
    }

    setSavingPlan(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        key: trimmedKey,
        kind: planForm.kind,
        type: planForm.type,
        price: planForm.price,
        billingInterval: planForm.billingInterval,
        sessionsPerCycle: planForm.sessionsPerCycle,
        mentorPayoutPerSession: planForm.mentorPayoutPerSession,
        rolloverLimit: planForm.rolloverLimit === "" ? 0 : planForm.rolloverLimit,
        maxSessionsAllowed: planForm.maxSessionsAllowed === "" ? 1 : planForm.maxSessionsAllowed,
        features,
        isActive: planForm.isActive,
      };

      if (planForm.expiryRolloverInMonths !== "" && planForm.expiryRolloverInMonths !== null) {
        payload.expiryRolloverInMonths = planForm.expiryRolloverInMonths;
      }

      if (planForm.displayName.trim()) {
        payload.displayName = planForm.displayName.trim();
      }
      if (planForm.shortLabel.trim()) {
        payload.shortLabel = planForm.shortLabel.trim();
      }

      const { message } = await dispatch(createPlanThunk(payload)).unwrap();

      setPlanForm(DEFAULT_PLAN_FORM);
      await fetchPlans();
      setSuccessMessage(message);
      setPlanModalOpen(false);
    } catch (message) {
      setError(message);
    } finally {
      setSavingPlan(false);
    }
  };

  const header = useMemo(
    () => (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        style={{ width: "100%" }}
      >
        <Stack spacing={0.25}>
          <Typography style={{ fontWeight: 700, fontSize: "1.05rem", color: "#111111" }}>
            Plans
          </Typography>
          <Typography style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>
            True state of the database — toggle a plan to hide it from
            mentees, or add a new one below.
          </Typography>
        </Stack>
        <Button variant="contained" onClick={handleOpenCreatePlanModal}>
          Create Plan
        </Button>
      </Stack>
    ),
    [handleOpenCreatePlanModal]
  );

  const content = useMemo(() => {
    if (loading) {
      return (
        <Stack alignItems="center" py={6}>
          <CircularProgress size={32} />
        </Stack>
      );
    }

    if (!plans.length) {
      return (
        <Stack alignItems="center" py={6} spacing={1}>
          <Typography style={{ color: "#71717a" }}>
            No plans found yet.
          </Typography>
          <Button variant="outlined" onClick={handleOpenCreatePlanModal}>
            Create Plan
          </Button>
        </Stack>
      );
    }

    return (
      <PlansList
        plans={plans}
        togglingPlanId={togglingPlanId}
        onToggleActive={handleToggleActive}
      />
    );
  }, [loading, plans, togglingPlanId, handleToggleActive, handleOpenCreatePlanModal]);

  return (
    <SideBarLayout header={header}>
      <Stack spacing={2}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} data-testid="plans-error">
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            onClose={() => setSuccessMessage(null)}
            data-testid="plans-success"
          >
            {successMessage}
          </Alert>
        )}
        {content}
      </Stack>

      <PlanFormDialog
        open={isPlanModalOpen}
        planForm={planForm}
        revenuePolicy={revenuePolicy}
        onChange={handlePlanInputChange}
        onAutoCalculatePayout={handleAutoCalculatePayout}
        onClose={handleClosePlanModal}
        onSubmit={handleSubmitPlan}
        saving={savingPlan}
      />
    </SideBarLayout>
  );
};

export default Plans;
