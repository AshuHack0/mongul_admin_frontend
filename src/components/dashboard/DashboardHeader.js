import React from "react";
import { Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const DashboardHeader = ({ userName }) => {
  return (
    <div className={styles.pageHeader}>
      <Typography className={styles.pageTitle}>
        Welcome back, {userName || "Admin"}
      </Typography>
      <Typography className={styles.pageSubtitle}>
        Here's what's happening in your platform.
      </Typography>
    </div>
  );
};

export default DashboardHeader;
