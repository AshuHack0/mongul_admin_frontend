import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import SideBarLayout from "../layout/SideBarLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import RevenueLineChart from "../components/dashboard/RevenueLineChart";
import RevenueSplitDonut from "../components/dashboard/RevenueSplitDonut";
import { fetchDashboardStatsThunk } from "../store/thunks/dashboardThunks";
import { fetchPlatformRevenueTimeseriesThunk } from "../store/thunks/platformRevenueThunks";

const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatCard = ({ icon: Icon, label, value, sublabel, accentColor = "#111111" }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e5e5",
      borderRadius: 10,
      padding: "18px 20px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <Typography style={{ fontSize: "0.8rem", color: "#71717a", fontWeight: 500 }}>
        {label}
      </Typography>
      {Icon && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: `${accentColor}12`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
          }}
        >
          <Icon style={{ fontSize: 18 }} />
        </div>
      )}
    </div>
    <Typography style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111111", marginTop: 2 }}>
      {value}
    </Typography>
    {sublabel && (
      <Typography style={{ fontSize: "0.75rem", color: "#71717a", marginTop: 6, fontWeight: 500 }}>
        {sublabel}
      </Typography>
    )}
  </div>
);

const ChartCard = ({ title, action, children }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e5e5",
      borderRadius: 10,
      padding: "20px 22px",
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <Typography style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111111" }}>
        {title}
      </Typography>
      {action}
    </div>
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [stats, setStats] = useState(null);
  const [series, setSeries] = useState([]);
  const [activityTab, setActivityTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const header = <DashboardHeader userName={user?.fullName} />;

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResult, seriesResult] = await Promise.all([
        dispatch(fetchDashboardStatsThunk()).unwrap(),
        dispatch(fetchPlatformRevenueTimeseriesThunk(30)).unwrap(),
      ]);
      setStats(statsResult);
      setSeries(seriesResult);
    } catch (message) {
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const financials = stats?.financials;
  const users = stats?.users;
  const sessions = stats?.sessions;
  const ratings = stats?.ratings;
  const queues = stats?.queues;
  const recentActivity = stats?.recentActivity;

  return (
    <SideBarLayout header={header}>
      <Stack spacing={3}>
        {/* Header Title */}
        <div>
          <Typography style={{ fontWeight: 700, fontSize: "1.25rem", color: "#111111" }}>
            Operational Overview
          </Typography>
          <Typography style={{ fontSize: "0.85rem", color: "#71717a", marginTop: 2 }}>
            Real-time platform activity, revenue metrics, session fulfillment, and management queues.
          </Typography>
        </div>

        {/* Operational Attention Alerts */}
        {((queues?.pendingApplications || 0) > 0 || (queues?.pendingCategoryRequests || 0) > 0) && (
          <Grid container spacing={2}>
            {(queues?.pendingApplications || 0) > 0 && (
              <Grid item xs={12} md={6}>
                <Alert
                  severity="warning"
                  icon={<NotificationsActiveOutlinedIcon fontSize="inherit" />}
                  action={
                    <Button
                      component={RouterLink}
                      to="/mentor-applications"
                      size="small"
                      color="inherit"
                      endIcon={<ArrowForwardIcon />}
                      style={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Review
                    </Button>
                  }
                  style={{ borderRadius: 8, border: "1px solid #fed7aa" }}
                >
                  <strong>{queues.pendingApplications} mentor application(s)</strong> awaiting administrative review.
                </Alert>
              </Grid>
            )}
            {(queues?.pendingCategoryRequests || 0) > 0 && (
              <Grid item xs={12} md={6}>
                <Alert
                  severity="info"
                  icon={<NotificationsActiveOutlinedIcon fontSize="inherit" />}
                  action={
                    <Button
                      component={RouterLink}
                      to="/category-change-requests"
                      size="small"
                      color="inherit"
                      endIcon={<ArrowForwardIcon />}
                      style={{ textTransform: "none", fontWeight: 600 }}
                    >
                      Review
                    </Button>
                  }
                  style={{ borderRadius: 8, border: "1px solid #bae6fd" }}
                >
                  <strong>{queues.pendingCategoryRequests} category change request(s)</strong> pending approval.
                </Alert>
              </Grid>
            )}
          </Grid>
        )}

        {error && (
          <Alert severity="error" onClose={() => setError(null)} data-testid="dashboard-revenue-error">
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack alignItems="center" py={8}>
            <CircularProgress size={36} />
          </Stack>
        ) : (
          <>
            {/* Top 6 KPI Metric Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <StatCard
                  icon={AccountBalanceWalletOutlinedIcon}
                  label="Platform Net Cut"
                  value={formatCurrency(financials?.allTime?.platformRevenue)}
                  sublabel={`${formatCurrency(financials?.thisMonth?.platformRevenue)} this month`}
                  accentColor="#059669"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <StatCard
                  icon={TrendingUpIcon}
                  label="Gross Revenue"
                  value={formatCurrency(financials?.allTime?.grossRevenue)}
                  sublabel={`${financials?.allTime?.paymentCount || 0} total payments`}
                  accentColor="#2563eb"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <StatCard
                  icon={PeopleAltOutlinedIcon}
                  label="Active Mentors"
                  value={users?.activeMentors || 0}
                  sublabel={`${users?.totalMentors || 0} total mentors`}
                  accentColor="#7c3aed"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <StatCard
                  icon={PeopleAltOutlinedIcon}
                  label="Total Mentees"
                  value={users?.totalMentees || 0}
                  sublabel="Registered accounts"
                  accentColor="#0284c7"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <StatCard
                  icon={VideoCameraFrontOutlinedIcon}
                  label="Sessions Completed"
                  value={sessions?.completedSessions || 0}
                  sublabel={`${sessions?.ongoingSessions || 0} ongoing right now`}
                  accentColor="#ea580c"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <StatCard
                  icon={StarBorderIcon}
                  label="Avg Rating"
                  value={ratings?.averageRating ? `${ratings.averageRating} ★` : "5.0 ★"}
                  sublabel={`${ratings?.totalRatings || 0} reviews total`}
                  accentColor="#eab308"
                />
              </Grid>
            </Grid>

            {/* Analytics Visuals */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <ChartCard title="Revenue Trend (Last 30 Days)">
                  <RevenueLineChart series={series} />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartCard title="Platform vs. Mentor Split (All Time)">
                  <RevenueSplitDonut
                    platformRevenue={financials?.allTime?.platformRevenue}
                    mentorShare={financials?.allTime?.mentorShare}
                    grossRevenue={financials?.allTime?.grossRevenue}
                  />
                </ChartCard>
              </Grid>
            </Grid>

            {/* Recent Activity Feed */}
            <ChartCard
              title="Recent Activity Feed"
              action={
                <Tabs
                  value={activityTab}
                  onChange={(e, val) => setActivityTab(val)}
                  textColor="inherit"
                  indicatorColor="primary"
                  sx={{ minHeight: 32, "& .MuiTab-root": { minHeight: 32, py: 0.5, px: 1.5, fontSize: "0.8rem", textTransform: "none", fontWeight: 600 } }}
                >
                  <Tab label={`Payments (${recentActivity?.payments?.length || 0})`} />
                  <Tab label={`Sessions (${recentActivity?.sessions?.length || 0})`} />
                  <Tab label={`Applications (${recentActivity?.applications?.length || 0})`} />
                </Tabs>
              }
            >
              {activityTab === 0 && (
                <Box>
                  {recentActivity?.payments?.length === 0 ? (
                    <Typography style={{ color: "#71717a", fontSize: "0.85rem", py: 3, textAlign: "center" }}>
                      No payment transactions recorded yet.
                    </Typography>
                  ) : (
                    recentActivity?.payments?.map((payment, idx) => (
                      <Box key={payment._id || idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar
                              src={payment.menteeId?.profilePicture}
                              style={{ width: 36, height: 36, fontSize: "0.85rem", backgroundColor: "#111111" }}
                            >
                              {payment.menteeId?.fullName?.[0] || "M"}
                            </Avatar>
                            <div>
                              <Typography style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111111" }}>
                                {payment.menteeId?.fullName || "Mentee"}
                              </Typography>
                              <Typography style={{ fontSize: "0.75rem", color: "#71717a" }}>
                                {payment.planId?.displayName || payment.planId?.key || "Session Plan"} • {payment.source}
                              </Typography>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <Typography style={{ fontSize: "0.85rem", fontWeight: 700, color: "#059669" }}>
                              +{formatCurrency(payment.amount)}
                            </Typography>
                            <Typography style={{ fontSize: "0.72rem", color: "#a1a1aa" }}>
                              {formatDate(payment.createdAt)}
                            </Typography>
                          </div>
                        </div>
                        {idx < recentActivity.payments.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
                </Box>
              )}

              {activityTab === 1 && (
                <Box>
                  {recentActivity?.sessions?.length === 0 ? (
                    <Typography style={{ color: "#71717a", fontSize: "0.85rem", py: 3, textAlign: "center" }}>
                      No recent sessions found.
                    </Typography>
                  ) : (
                    recentActivity?.sessions?.map((session, idx) => {
                      const req = session.mentorRequestId;
                      const statusColor =
                        session.sessionStatus === "completed"
                          ? "success"
                          : session.sessionStatus === "ongoing"
                          ? "primary"
                          : "default";
                      return (
                        <Box key={session._id || idx}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <Typography style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111111" }}>
                                  {req?.menteeId?.fullName || "Mentee"} ↔ {req?.mentorId?.fullName || "Mentor"}
                                </Typography>
                                <Chip
                                  label={session.sessionStatus}
                                  size="small"
                                  color={statusColor}
                                  variant="outlined"
                                  style={{ height: 20, fontSize: "0.7rem", textTransform: "capitalize" }}
                                />
                              </div>
                              <Typography style={{ fontSize: "0.75rem", color: "#71717a", marginTop: 2 }}>
                                Category: {req?.category?.name || "General"}
                              </Typography>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <Typography style={{ fontSize: "0.75rem", color: "#71717a" }}>
                                {formatDate(session.createdAt)}
                              </Typography>
                            </div>
                          </div>
                          {idx < recentActivity.sessions.length - 1 && <Divider />}
                        </Box>
                      );
                    })
                  )}
                </Box>
              )}

              {activityTab === 2 && (
                <Box>
                  {recentActivity?.applications?.length === 0 ? (
                    <Typography style={{ color: "#71717a", fontSize: "0.85rem", py: 3, textAlign: "center" }}>
                      No recent applications.
                    </Typography>
                  ) : (
                    recentActivity?.applications?.map((app, idx) => (
                      <Box key={app._id || idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <Typography style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111111" }}>
                                {app.fullName}
                              </Typography>
                              <Chip
                                label={app.mentorType?.toUpperCase() || "BASIC"}
                                size="small"
                                style={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                              />
                            </div>
                            <Typography style={{ fontSize: "0.75rem", color: "#71717a", marginTop: 2 }}>
                              {app.email}
                            </Typography>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <Chip
                              label={app.mentorApplicationStatus}
                              size="small"
                              color={app.mentorApplicationStatus === "approved" ? "success" : "warning"}
                              style={{ height: 22, fontSize: "0.72rem", textTransform: "capitalize" }}
                            />
                            <Button
                              component={RouterLink}
                              to={`/mentor-applications/${app._id}`}
                              size="small"
                              variant="text"
                              style={{ textTransform: "none", fontSize: "0.8rem", color: "#111111", fontWeight: 600 }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                        {idx < recentActivity.applications.length - 1 && <Divider />}
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </ChartCard>
          </>
        )}
      </Stack>
    </SideBarLayout>
  );
};

export default Dashboard;
