import React, { useMemo } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Fade,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SubcategoryListSection = ({
  subcategories,
  searchTerm,
  onSearchChange,
  onClearSearch,
  onEdit,
  onDelete,
}) => {
  const hasSearch = subcategories.length > 4;

  const { filteredSubcategories, showEmptySearchState } = useMemo(() => {
    if (!hasSearch) {
      return {
        filteredSubcategories: subcategories,
        showEmptySearchState: false,
      };
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return {
        filteredSubcategories: subcategories,
        showEmptySearchState: false,
      };
    }

    const filtered = subcategories.filter(({ name = "" }) =>
      name.toLowerCase().includes(normalizedSearch)
    );

    return {
      filteredSubcategories: filtered,
      showEmptySearchState: !filtered.length,
    };
  }, [hasSearch, searchTerm, subcategories]);

  return (
    <Card
      variant="outlined"
      sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 },
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack spacing={3} sx={{ flexGrow: 1 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Subcategories
              </Typography>
            </Box>
            {hasSearch && (
              <TextField
                size="small"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search subcategories"
                sx={{ minWidth: { xs: "100%", sm: 240 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>

          {!subcategories.length ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{
                py: 6,
                borderRadius: 2,
                border: (theme) => `1px dashed ${theme.palette.divider}`,
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              <Typography variant="body2">
                No subcategories have been created yet.
              </Typography>
              <Typography variant="caption">
                Use the button above to add your first subcategory.
              </Typography>
            </Stack>
          ) : showEmptySearchState ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{
                py: 6,
                borderRadius: 2,
                border: (theme) => `1px dashed ${theme.palette.divider}`,
                color: "text.secondary",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" gutterBottom>
                No subcategories match “{searchTerm.trim()}”.
              </Typography>
              <Button size="small" onClick={onClearSearch}>
                Clear search
              </Button>
            </Stack>
          ) : (
            <Grid container spacing={2}>
              {filteredSubcategories.map((subcategory) => {
                const tags = Array.isArray(subcategory?.tags)
                  ? subcategory.tags
                  : [];
                const orderValue =
                  subcategory?.order !== undefined &&
                  subcategory?.order !== null &&
                  subcategory.order !== ""
                    ? subcategory.order
                    : null;

                return (
                  <Grid item xs={12} md={6} key={subcategory._id}>
                    <Fade in appear timeout={250}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: 4,
                            borderColor: "primary.light",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                          <Stack spacing={2}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar
                                sx={{
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                  width: 40,
                                  height: 40,
                                  fontWeight: 600,
                                }}
                              >
                                {subcategory.name?.[0]?.toUpperCase() ?? "?"}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {subcategory.name}
                                </Typography>
                              </Box>
                            </Stack>

                            {tags.length ? (
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                rowGap={1}
                              >
                                {tags.map((tag) => (
                                  <Chip
                                    key={tag}
                                    size="small"
                                    label={tag}
                                    color="primary"
                                    variant="outlined"
                                  />
                                ))}
                              </Stack>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                No tags provided yet.
                              </Typography>
                            )}
                            <Stack
                              direction="row"
                              spacing={1.25}
                              justifyContent="flex-end"
                            >
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => onEdit(subcategory)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => onDelete(subcategory)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SubcategoryListSection;
