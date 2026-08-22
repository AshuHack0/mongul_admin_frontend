import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import SideBarLayout from "../layout/SideBarLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import RevenueLineChart from "../components/dashboard/RevenueLineChart";
import RevenueSplitDonut from "../components/dashboard/RevenueSplitDonut";
import {
  fetchPlatformRevenueThunk,
  fetchPlatformRevenueTimeseriesThunk,
} from "../store/thunks/platformRevenueThunks";

const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const StatCard = ({ label, value, sublabel }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e5e5",
      borderRadius: 8,
      padding: "18px 20px",
      height: "100%",
    }}
  >
    <Typography style={{ fontSize: "0.8rem", color: "#71717a", fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111111", marginTop: 4 }}>
      {value}
    </Typography>
    {sublabel && (
      <Typography style={{ fontSize: "0.75rem", color: "#a1a1aa", marginTop: 4 }}>
        {sublabel}
      </Typography>
    )}
  </div>
);

const ChartCard = ({ title, children }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e5e5",
      borderRadius: 8,
      padding: "18px 20px",
      height: "100%",
    }}
  >
    <Typography style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111111", marginBottom: 12 }}>
      {title}
    </Typography>
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [revenue, setRevenue] = useState(null);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const header = <DashboardHeader userName={user?.fullName} />;

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [result, seriesResult] = await Promise.all([
        dispatch(fetchPlatformRevenueThunk()).unwrap(),
        dispatch(fetchPlatformRevenueTimeseriesThunk(30)).unwrap(),
      ]);
      setRevenue(result);
      setSeries(seriesResult);
    } catch (message) {
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return (
    <SideBarLayout header={header}>
      <Stack spacing={2}>
        <Typography style={{ fontWeight: 700, fontSize: "1rem", color: "#111111" }}>
          Platform Revenue
        </Typography>
        <Typography style={{ fontSize: "0.8rem", color: "#a1a1aa", marginTop: -8 }}>
          Gross revenue collected (checkouts + renewals), split into mentor
          share / platform revenue using the Revenue Policy percentages that
          were live at the moment each payment came in. A payment recorded
          before any Revenue Policy was saved contributes $0 to both shares.
        </Typography>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} data-testid="dashboard-revenue-error">
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress size={32} />
          </Stack>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Platform Revenue (all time)"
                value={formatCurrency(revenue?.allTime?.platformRevenue)}
                sublabel={`${revenue?.allTime?.paymentCount || 0} payments collected`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Platform Revenue (this month)"
                value={formatCurrency(revenue?.thisMonth?.platformRevenue)}
                sublabel={`${revenue?.thisMonth?.paymentCount || 0} payments this month`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Gross Revenue (all time)"
                value={formatCurrency(revenue?.allTime?.grossRevenue)}
                sublabel="Total collected from mentees"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                label="Mentor Share (all time)"
                value={formatCurrency(revenue?.allTime?.mentorShare)}
                sublabel={`Per policy — actually paid out: ${formatCurrency(revenue?.allTime?.actualMentorPayouts)}`}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <ChartCard title="Revenue trend (last 30 days)">
                <RevenueLineChart series={series} />
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <ChartCard title="Platform vs mentor split (all time)">
                <RevenueSplitDonut
                  platformRevenue={revenue?.allTime?.platformRevenue}
                  mentorShare={revenue?.allTime?.mentorShare}
                  grossRevenue={revenue?.allTime?.grossRevenue}
                />
              </ChartCard>
            </Grid>
          </Grid>
        )}
      </Stack>
    </SideBarLayout>
  );
};

export default Dashboard;
