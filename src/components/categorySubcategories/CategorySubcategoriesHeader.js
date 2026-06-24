import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import styles from "../../styles/dashboard.module.css";

const CategorySubcategoriesHeader = ({ category, loading, onBack, onCreate }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
    <div className={styles.pageHeader} style={{ flex: 1 }}>
      <Typography className={styles.pageTitle}>
        {category?.name ?? "Category"}
      </Typography>
      <Typography className={styles.pageSubtitle}>
        Manage the subcategories associated with this category.
      </Typography>
    </div>
    <Stack direction="row" spacing={1}>
      <Button variant="outlined" size="small" onClick={onBack}>
        Back
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={onCreate}
        disabled={!category || loading}
      >
        Add Subcategory
      </Button>
    </Stack>
  </div>
);

export default CategorySubcategoriesHeader;
