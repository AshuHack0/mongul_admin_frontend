import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { ArrowBack as BackIcon, CalendarToday as DateIcon } from "@mui/icons-material";
import { fetchBlogByIdThunk } from "../store/thunks/blogThunks";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
};

const BlogView = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogByIdThunk(blogId))
        .unwrap()
        .then((data) => {
          setBlog(data);
          setLoading(false);
        })
        .catch(() => {
          navigate("/blog/list");
        });
    }
  }, [blogId, dispatch, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress size={40} sx={{ color: "#18181b" }} />
      </Box>
    );
  }

  if (!blog) return null;

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", pb: 10 }}>
      {/* Navbar / Header */}
      <Box sx={{ borderBottom: "1px solid #f4f4f5", py: 2, position: "sticky", top: 0, bgcolor: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", zIndex: 10 }}>
        <Container maxWidth="lg">
          <Tooltip title="Back to list">
            <IconButton onClick={() => navigate("/blog/list")} sx={{ color: "#18181b" }}>
              <BackIcon />
            </IconButton>
          </Tooltip>
        </Container>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ pt: 8, pb: 4 }}>
        <Stack spacing={4}>
          <Box>
            {blog.topics?.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                size="small"
                sx={{ mr: 1, mb: 1, fontWeight: 600, bgcolor: "#f4f4f5", color: "#18181b", borderRadius: 1.5 }}
              />
            ))}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.75rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#18181b",
                mt: 2,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {blog.title}
            </Typography>
            {blog.subtitle && (
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                  color: "#71717a",
                  mt: 3,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {blog.subtitle}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={blog.author?.profilePicture} sx={{ width: 48, height: 48 }}>
              {blog.author?.fullName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#18181b" }}>
                {blog.author?.fullName || "Admin"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#a1a1aa" }}>
                <DateIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {formatDate(blog.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {blog.coverImage && (
            <Box
              component="img"
              src={blog.coverImage}
              sx={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: 4,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              }}
            />
          )}
        </Stack>
      </Container>

      {/* Content Section */}
      <Container maxWidth="md" sx={{ overflowX: "hidden" }}>
        <Divider sx={{ mb: 6 }} />
        <Box
          className="tiptap-content"
          dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
          sx={{
            overflowWrap: "break-word",
            wordBreak: "break-word",
            minWidth: 0,
            "& p": { fontSize: "1.125rem", lineHeight: 1.8, color: "#3f3f46", mb: 3 },
            "& h1, & h2, & h3": { color: "#18181b", mt: 6, mb: 3, fontWeight: 700 },
            "& h1": { fontSize: "2.25rem" },
            "& h2": { fontSize: "1.875rem" },
            "& h3": { fontSize: "1.5rem" },
            "& ul, & ol": { pl: 3, mb: 3, "& li": { mb: 1, fontSize: "1.125rem", color: "#3f3f46" } },
            "& a": { color: "#2563eb", textDecoration: "underline", wordBreak: "break-all" },
            "& blockquote": {
              borderLeft: "4px solid #18181b",
              pl: 3,
              py: 1,
              my: 4,
              fontStyle: "italic",
              bgcolor: "#fafafa",
              "& p": { mb: 0 },
            },
            "& pre": {
              bgcolor: "#18181b",
              color: "#ffffff",
              p: 3,
              borderRadius: 2,
              overflowX: "auto",
              maxWidth: "100%",
              my: 4,
              "& code": { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", whiteSpace: "pre" },
            },
            "& code": {
              bgcolor: "#f1f5f9",
              color: "#0f172a",
              px: "0.4em",
              py: "0.2em",
              borderRadius: "4px",
              fontSize: "0.9em",
              fontFamily: "'JetBrains Mono', monospace",
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              display: "block",
              my: 4,
            },
            "& div[data-link-preview]": { my: 3, "& img": { my: 0, borderRadius: 0 } },
            "& hr": { my: 6, border: 0, borderTop: "1px solid #e4e4e7" },
            "& span": { maxWidth: "100%" },
          }}
        />
      </Container>
    </Box>
  );
};

export default BlogView;
