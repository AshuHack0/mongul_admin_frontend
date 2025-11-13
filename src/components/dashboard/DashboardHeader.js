import React from "react";
import { Box, Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const DashboardHeader = ({ userName }) => {
  return (
    <Box className={styles.headerContent}>
      <div>
        <Typography variant="h5" className={styles.headerTitle}>
          Welcome back, {userName} 👋
        </Typography>
      </div>
    </Box>
  );
};

export default DashboardHeader;
