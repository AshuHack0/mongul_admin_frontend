import React from "react";
import {
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";

const formatPrice = (price, currency) => {
  if (price === undefined || price === null) return "—";
  const symbol = (currency || "usd").toLowerCase() === "usd" ? "$" : `${currency} `;
  return `${symbol}${Number(price).toFixed(2)}`;
};

const PlansList = ({ plans, togglingPlanId, onToggleActive }) => {
  return (
    <Grid container spacing={2}>
      {plans.map((plan) => {
        const isToggling = togglingPlanId === plan._id;
        const name = plan.displayName || plan.key.replace(/_/g, " ");

        return (
          <Grid item xs={12} sm={6} md={4} key={plan._id}>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "100%",
                opacity: plan.isActive ? 1 : 0.6,
              }}
            >
              {/* Title row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <Stack spacing={0.25} style={{ minWidth: 0 }}>
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "#111111",
                      lineHeight: 1.3,
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    style={{ fontSize: "0.75rem", color: "#a1a1aa" }}
                  >
                    {plan.key}
                  </Typography>
                </Stack>
                <Chip
                  label={plan.kind === "SUBSCRIPTION" ? "Subscription" : "One-time"}
                  size="small"
                  variant="outlined"
                  style={{
                    flexShrink: 0,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    borderColor: "#d4d4d8",
                    color: "#52525b",
                  }}
                />
              </div>

              {/* Price */}
              <Typography
                style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111111" }}
              >
                {formatPrice(plan.price, plan.currency)}
                {plan.billingInterval === "month" && (
                  <Typography
                    component="span"
                    style={{ fontSize: "0.8rem", fontWeight: 500, color: "#a1a1aa" }}
                  >
                    {" "}
                    /mo
                  </Typography>
                )}
              </Typography>

              {/* Meta */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Typography style={{ fontSize: "0.775rem", color: "#a1a1aa" }}>
                  Type: {plan.type}
                </Typography>
                <Typography style={{ fontSize: "0.775rem", color: "#a1a1aa" }}>
                  Sessions/cycle: {plan.sessionsPerCycle}
                </Typography>
              </Stack>

              {/* isActive toggle */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "auto",
                  paddingTop: 6,
                  borderTop: "1px solid #f4f4f5",
                }}
              >
                <Typography style={{ fontSize: "0.8125rem", color: "#3f3f46" }}>
                  Visible to mentees
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {isToggling && <CircularProgress size={16} />}
                  <Tooltip
                    title={
                      plan.isActive
                        ? "Active — shown to mentees"
                        : "Inactive — hidden from mentees"
                    }
                  >
                    <span>
                      <Switch
                        checked={Boolean(plan.isActive)}
                        disabled={isToggling}
                        onChange={(event) =>
                          onToggleActive(plan, event.target.checked)
                        }
                        color="success"
                      />
                    </span>
                  </Tooltip>
                </Stack>
              </div>
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PlansList;
