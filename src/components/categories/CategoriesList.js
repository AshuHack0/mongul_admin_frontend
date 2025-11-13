import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const CategoriesList = ({
  categories,
  onManageSubcategories,
  onEditCategory,
  onDeleteCategory,
}) => {
  return (
    <Grid container spacing={3}>
      {categories.map((category) => {
        const subcategories = Array.isArray(category?.subcategories)
          ? category.subcategories
          : [];

        return (
          <Grid item xs={12} md={6} key={category._id}>
            <Card
              variant="outlined"
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                title={category.name}
                titleTypographyProps={{ fontWeight: 600 }}
                subheader={
                  <>
                    {category.icon && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mr: 1.5 }}
                      >
                        Icon: {category.icon}
                      </Typography>
                    )}
                    {category.color && (
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mr: 1.5 }}
                      >
                        Color: {category.color}
                      </Typography>
                    )}
                  </>
                }
                action={
                  <Chip
                    label={`${subcategories.length} ${
                      subcategories.length === 1 ? "subcategory" : "subcategories"
                    }`}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                }
              />

              <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                {category?.tags?.length ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} mb={2}>
                    {category.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                ) : null}
              </CardContent>

              <CardActions
                sx={{
                  px: 3,
                  pb: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => onManageSubcategories(category)}
                >
                  Manage Subcategories
                </Button>
                <Stack direction="row" spacing={1.25} sx={{ width: "100%" }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => onEditCategory(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => onDeleteCategory(category)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CategoriesList;
