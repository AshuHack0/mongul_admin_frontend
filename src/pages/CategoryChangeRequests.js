import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import SideBarLayout from "../layout/SideBarLayout";
import styles from "../styles/dashboard.module.css";
import {
  fetchCategoryChangeRequestsThunk,
  decideCategoryChangeRequestThunk,
} from "../store/thunks/categoryChangeRequestsThunks";

const DEFAULT_LIMIT = 10;

const statusColor = (status) => {
  if (status === "pending") return "warning";
  if (status === "approved") return "success";
  return "error";
};

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
};

const CategoryChangeRequests = () => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");

  // Decision dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [decision, setDecision] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [deciding, setDeciding] = useState(false);
  const [decisionError, setDecisionError] = useState(null);

  const fetchRequests = useCallback(
    async ({ page = 1, limit = DEFAULT_LIMIT, status = "pending" } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { requests: nextRequests, pagination: nextPagination } =
          await dispatch(
            fetchCategoryChangeRequestsThunk({ page, limit, status })
          ).unwrap();
        setRequests(nextRequests);
        setPagination((prev) => ({ ...prev, ...nextPagination }));
      } catch (message) {
        setError(message);
        setRequests([]);
        setPagination((prev) => ({ ...prev, page: 1, total: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchRequests({ page: 1, limit: pagination.limit, status: statusFilter });
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (_e, newPageIndex) => {
    const nextPage = newPageIndex + 1;
    fetchRequests({ page: nextPage, limit: pagination.limit, status: statusFilter });
  };

  const handleRowsPerPageChange = (e) => {
    const nextLimit = parseInt(e.target.value, 10);
    fetchRequests({ page: 1, limit: nextLimit, status: statusFilter });
  };

  const openDecisionDialog = (request, initialDecision) => {
    setSelectedRequest(request);
    setDecision(initialDecision);
    setAdminNote("");
    setDecisionError(null);
    setDialogOpen(true);
  };

  const handleDecide = async () => {
    if (deciding) return;
    setDeciding(true);
    setDecisionError(null);
    try {
      await dispatch(
        decideCategoryChangeRequestThunk({
          requestId: selectedRequest._id,
          decision,
          adminNote: adminNote.trim() || undefined,
        })
      ).unwrap();
      setDialogOpen(false);
      fetchRequests({ page: pagination.page, limit: pagination.limit, status: statusFilter });
    } catch (message) {
      setDecisionError(message);
    } finally {
      setDeciding(false);
    }
  };

  const getExpertiseSummary = (requestedExpertiseIn) => {
    if (!Array.isArray(requestedExpertiseIn) || requestedExpertiseIn.length === 0) return "—";
    return requestedExpertiseIn
      .map((e) => e.category?.name || "Unknown")
      .join(", ");
  };

  return (
    <SideBarLayout header={
      <div className={styles.pageHeader}>
        <Typography className={styles.pageTitle}>Category Change Requests</Typography>
        <Typography className={styles.pageSubtitle}>Review mentor requests to change their category.</Typography>
      </div>
    }>
      <Stack spacing={2}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mentor</TableCell>
                <TableCell>Requested Categories</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {req.mentorId?.fullName || "—"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {req.mentorId?.email || ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getExpertiseSummary(req.requestedExpertiseIn)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={req.status}
                        color={statusColor(req.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(req.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {req.status === "pending" ? (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => openDecisionDialog(req, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => openDecisionDialog(req, "rejected")}
                          >
                            Reject
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {req.adminNote || "—"}
                        </Typography>
                      )}
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
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      </Stack>

      {/* Decision Dialog */}
      <Dialog open={dialogOpen} onClose={() => !deciding && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {decision === "approved" ? "Approve" : "Reject"} Category Change Request
        </DialogTitle>
        <DialogContent>
          {decisionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {decisionError}
            </Alert>
          )}
          <Typography variant="body2" sx={{ mb: 2 }}>
            Mentor: <strong>{selectedRequest?.mentorId?.fullName}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Requested categories: <strong>{getExpertiseSummary(selectedRequest?.requestedExpertiseIn)}</strong>
          </Typography>
          <TextField
            label="Admin note (optional)"
            multiline
            rows={3}
            fullWidth
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder={decision === "rejected" ? "Reason for rejection..." : "Optional note for mentor..."}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={deciding}>
            Cancel
          </Button>
          <Button
            onClick={handleDecide}
            variant="contained"
            color={decision === "approved" ? "success" : "error"}
            disabled={deciding}
          >
            {deciding ? <CircularProgress size={20} /> : decision === "approved" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </SideBarLayout>
  );
};

export default CategoryChangeRequests;
