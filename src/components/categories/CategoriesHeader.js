import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

const CategoriesHeader = ({ onCreateCategory }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1.5}
    >
      <Box display="flex" flexDirection="column" gap={0.75}>
        <Typography variant="h5" fontWeight={600}>
          Categories
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Organize expertise areas and manage their subcategories.
        </Typography>
      </Box>
      <Button variant="contained" onClick={onCreateCategory}>
        Add Category
      </Button>
    </Stack>
  );
};

export default CategoriesHeader;
