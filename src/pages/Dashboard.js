import React from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import SideBarLayout from "../layout/SideBarLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import styles from "../styles/dashboard.module.css";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const header = <DashboardHeader userName={user?.fullName} />;

  return (
    <SideBarLayout header={header}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIconWrap}>
          <DashboardCustomizeOutlinedIcon
            style={{ fontSize: 28, color: "#a1a1aa" }}
          />
        </div>
        <Typography className={styles.emptyTitle}>
          Dashboard coming soon
        </Typography>
        <Typography className={styles.emptySubtitle}>
          Analytics and platform insights will appear here once your dashboard
          is ready.
        </Typography>
      </div>
    </SideBarLayout>
  );
};

export default Dashboard;
