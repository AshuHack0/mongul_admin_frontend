import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import SideBarLayout from "../layout/SideBarLayout";
import { fetchBlogsThunk, deleteBlogThunk } from "../store/thunks/blogThunks";
import styles from "../styles/dashboard.module.css";

const DEFAULT_LIMIT = 10;

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
};

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(
    async ({ page = 1, limit = DEFAULT_LIMIT } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(fetchBlogsThunk({ page, limit })).unwrap();
        setBlogs(result.blogs);
        setPagination({ page: result.page, limit: result.limit, total: result.total });
      } catch (message) {
        setError(message);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await dispatch(deleteBlogThunk(id)).unwrap();
        const remainingOnPage = blogs.filter((b) => b._id !== id).length;
        const newPage = remainingOnPage === 0 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
        fetchBlogs({ page: newPage, limit: pagination.limit });
      } catch (message) {
        setError(message);
      }
    }
  };

  const header = (
    <div className={styles.pageHeader}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
        <div>
          <Typography className={styles.pageTitle}>Blogs</Typography>
          <Typography className={styles.pageSubtitle}>Manage and publish blog posts.</Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/blog")}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#18181b", "&:hover": { bgcolor: "#000000" } }}
        >
          Create Post
        </Button>
      </Box>
    </div>
  );

  return (
    <SideBarLayout header={header}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#71717a" }}>Post</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#71717a" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#71717a" }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#71717a" }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#71717a" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} thickness={4} sx={{ color: "#18181b" }} />
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography sx={{ color: "#a1a1aa" }}>No blogs found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow key={blog._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {blog.coverImage && (
                          <Box
                            component="img"
                            src={blog.coverImage}
                            sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: "cover" }}
                          />
                        )}
                        <div style={{ cursor: "pointer" }} onClick={() => navigate(`/blog/view/${blog._id}`)}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#111111", "&:hover": { color: "#18181b", textDecoration: "underline" } }}>
                            {blog.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#71717a" }}>{blog.slug}</Typography>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={blog.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          bgcolor: blog.status === "published" ? "#f0fdf4" : "#f4f4f5",
                          color: blog.status === "published" ? "#166534" : "#71717a",
                          border: "1px solid",
                          borderColor: blog.status === "published" ? "#bbf7d0" : "#e4e4e7",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#111111" }}>{blog.author?.fullName || "Admin"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#71717a" }}>{formatDate(blog.createdAt)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Public Page">
                          <IconButton size="small" onClick={() => navigate(`/blog/view/${blog._id}`)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => navigate(`/blog/edit/${blog._id}`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(blog._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            rowsPerPage={pagination.limit}
            onPageChange={(_e, p) => fetchBlogs({ page: p + 1, limit: pagination.limit })}
            onRowsPerPageChange={(e) => fetchBlogs({ page: 1, limit: parseInt(e.target.value, 10) })}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      </Stack>
    </SideBarLayout>
  );
};

export default BlogList;
