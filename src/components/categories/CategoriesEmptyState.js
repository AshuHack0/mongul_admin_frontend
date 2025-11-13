import React from "react";
import { Button, Card, Typography } from "@mui/material";

const CategoriesEmptyState = ({ onCreateCategory }) => {
  return (
    <Card
      variant="outlined"
      sx={{ p: 5, textAlign: "center", borderStyle: "dashed" }}
    >
      <Typography variant="h6" gutterBottom>
        No categories yet
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Start by creating your first category to organize the platform.
      </Typography>
      <Button variant="contained" onClick={onCreateCategory}>
        Add Category
      </Button>
    </Card>
  );
};

export default CategoriesEmptyState;
