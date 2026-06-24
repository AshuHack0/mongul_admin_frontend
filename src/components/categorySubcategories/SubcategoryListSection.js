import React, { useMemo } from "react";
import {
  Button,
  Chip,
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
      return { filteredSubcategories: subcategories, showEmptySearchState: false };
    }

    const q = searchTerm.trim().toLowerCase();
    if (!q) return { filteredSubcategories: subcategories, showEmptySearchState: false };

    const filtered = subcategories.filter(({ name = "" }) =>
      name.toLowerCase().includes(q)
    );

    return { filteredSubcategories: filtered, showEmptySearchState: !filtered.length };
  }, [hasSearch, searchTerm, subcategories]);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "14px 20px",
          borderBottom: "1px solid #f4f4f5",
        }}
      >
        <Typography style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111111" }}>
          Subcategories
          <span style={{ marginLeft: 8, fontSize: "0.775rem", fontWeight: 500, color: "#a1a1aa" }}>
            {subcategories.length}
          </span>
        </Typography>

        {hasSearch && (
          <TextField
            size="small"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search…"
            sx={{ width: 200 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "#a1a1aa" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      </div>

      {/* Empty state — no subcategories */}
      {!subcategories.length && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <Typography style={{ fontSize: "0.875rem", color: "#a1a1aa" }}>
            No subcategories yet. Use the button above to add one.
          </Typography>
        </div>
      )}

      {/* Empty search state */}
      {showEmptySearchState && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <Typography style={{ fontSize: "0.875rem", color: "#a1a1aa", marginBottom: 10 }}>
            No results for "{searchTerm.trim()}"
          </Typography>
          <Button size="small" onClick={onClearSearch}>
            Clear search
          </Button>
        </div>
      )}

      {/* List */}
      {!showEmptySearchState && filteredSubcategories.map((sub, idx) => {
        const tags = Array.isArray(sub?.tags) ? sub.tags : [];
        const isLast = idx === filteredSubcategories.length - 1;

        return (
          <div
            key={sub._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 20px",
              borderBottom: isLast ? "none" : "1px solid #f4f4f5",
            }}
          >
            {/* Initial circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "#f4f4f5",
                border: "1px solid #e5e5e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#52525b",
                flexShrink: 0,
              }}
            >
              {sub.name?.[0]?.toUpperCase() ?? "?"}
            </div>

            {/* Name + tags */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#111111",
                  marginBottom: tags.length ? 5 : 0,
                }}
              >
                {sub.name}
              </Typography>
              {tags.length > 0 && (
                <Stack direction="row" spacing={0.75} flexWrap="wrap" rowGap={0.5}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      style={{ fontSize: "0.675rem", borderColor: "#e5e5e5", color: "#71717a" }}
                    />
                  ))}
                </Stack>
              )}
            </div>

            {/* Actions */}
            <Stack direction="row" spacing={1} flexShrink={0}>
              <Button size="small" variant="outlined" onClick={() => onEdit(sub)}>
                Edit
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={() => onDelete(sub)}>
                Delete
              </Button>
            </Stack>
          </div>
        );
      })}
    </div>
  );
};

export default SubcategoryListSection;
