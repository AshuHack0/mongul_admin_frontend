import React from "react";
import { Button, Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const CategoriesHeader = ({ onCreateCategory }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
    <div className={styles.pageHeader} style={{ flex: 1 }}>
      <Typography className={styles.pageTitle}>Categories</Typography>
      <Typography className={styles.pageSubtitle}>
        Organize expertise areas and manage their subcategories.
      </Typography>
    </div>
    <Button variant="contained" size="small" onClick={onCreateCategory}>
      Add Category
    </Button>
  </div>
);

export default CategoriesHeader;
