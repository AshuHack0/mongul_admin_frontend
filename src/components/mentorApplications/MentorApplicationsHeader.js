import React from "react";
import { Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const MentorApplicationsHeader = () => (
  <div className={styles.pageHeader}>
    <Typography className={styles.pageTitle}>Mentor Applications</Typography>
    <Typography className={styles.pageSubtitle}>
      Review and approve incoming mentor applications.
    </Typography>
  </div>
);

export default MentorApplicationsHeader;
