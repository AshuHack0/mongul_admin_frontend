import React from "react";
import { Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const MentorsHeader = () => (
  <div className={styles.pageHeader}>
    <Typography className={styles.pageTitle}>Mentors</Typography>
    <Typography className={styles.pageSubtitle}>
      Browse approved mentors and their profile details.
    </Typography>
  </div>
);

export default MentorsHeader;
