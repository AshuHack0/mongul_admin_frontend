import React from "react";
import { Button, Card, Typography } from "@mui/material";

const CategoryNotFoundCard = ({ onBack }) => {
  return (
    <Card variant="outlined" sx={{ p: 5, textAlign: "center", borderStyle: "dashed" }}>
      <Typography variant="h6" gutterBottom>
        Category not available
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        We couldn’t find the requested category. It may have been removed or you might
        have followed an outdated link.
      </Typography>
      <Button variant="contained" onClick={onBack}>
        Return to Categories
      </Button>
    </Card>
  );
};

export default CategoryNotFoundCard;
