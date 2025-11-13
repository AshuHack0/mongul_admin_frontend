import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

const CategorySubcategoriesHeader = ({ category, loading, onBack, onCreate }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1.5}
    >
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography variant="h5" fontWeight={600}>
          Category: {category?.name ?? "Category"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage the subcategories associated with this category.
        </Typography>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button variant="outlined" onClick={onBack}>
          Back to Categories
        </Button>
        <Button variant="contained" onClick={onCreate} disabled={!category || loading}>
          Add Subcategory
        </Button>
      </Stack>
    </Stack>
  );
};

export default CategorySubcategoriesHeader;
