import React from "react";
import { Button, Chip, Grid, Stack, Typography } from "@mui/material";

const CategoriesList = ({
  categories,
  onManageSubcategories,
  onEditCategory,
  onDeleteCategory,
}) => {
  return (
    <Grid container spacing={2}>
      {categories.map((category) => {
        const subcategories = Array.isArray(category?.subcategories)
          ? category.subcategories
          : [];

        return (
          <Grid item xs={12} sm={6} key={category._id}>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: 8,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                height: "100%",
              }}
            >
              {/* Title row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <Typography
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "#111111",
                    lineHeight: 1.3,
                  }}
                >
                  {category.name}
                </Typography>
                <Chip
                  label={`${subcategories.length} sub`}
                  size="small"
                  variant="outlined"
                  style={{ flexShrink: 0, fontSize: "0.7rem", fontWeight: 600, borderColor: "#d4d4d8", color: "#52525b" }}
                />
              </div>

              {/* Meta: icon / color */}
              {(category.icon || category.color) && (
                <Stack direction="row" spacing={1.5}>
                  {category.icon && (
                    <Typography style={{ fontSize: "0.775rem", color: "#a1a1aa" }}>
                      Icon: {category.icon}
                    </Typography>
                  )}
                  {category.color && (
                    <Typography style={{ fontSize: "0.775rem", color: "#a1a1aa" }}>
                      Color: {category.color}
                    </Typography>
                  )}
                </Stack>
              )}

              {/* Tags */}
              {category.tags?.length > 0 && (
                <Stack direction="row" spacing={0.75} flexWrap="wrap" rowGap={0.75}>
                  {category.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      style={{ fontSize: "0.7rem", borderColor: "#e5e5e5", color: "#71717a" }}
                    />
                  ))}
                </Stack>
              )}

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 6 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onManageSubcategories(category)}
                >
                  Manage Subcategories
                </Button>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEditCategory(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => onDeleteCategory(category)}
                  >
                    Delete
                  </Button>
                </Stack>
              </div>
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CategoriesList;
