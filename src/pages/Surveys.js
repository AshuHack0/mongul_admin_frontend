import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SideBarLayout from "../layout/SideBarLayout";
import { fetchSurveysThunk } from "../store/thunks/surveysThunks";

const DEFAULT_LIMIT = 10;

const formatDate = (value) => {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
};

const typeColor = (type) => (type === "mentee" ? "primary" : "secondary");

const ResponseRow = ({ response }) => {
  const { question, type, answers, openText } = response;

  const renderAnswer = () => {
    if (type === "open") {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          {openText || "—"}
        </Typography>
      );
    }
    if (!answers || answers.length === 0) {
      return <Typography variant="body2" color="text.secondary">—</Typography>;
    }
    return (
      <Stack direction="row" flexWrap="wrap" gap={0.5}>
        {answers.map((ans, i) => (
          <Chip key={i} label={ans} size="small" variant="outlined" />
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" fontWeight={600} gutterBottom>
        {question}
        <Chip
          label={type}
          size="small"
          sx={{ ml: 1, fontSize: "0.65rem", height: 18 }}
          variant="outlined"
        />
      </Typography>
      {renderAnswer()}
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};

const SurveyDetailDialog = ({ survey, onClose }) => {
  if (!survey) return null;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle sx={{ pr: 6 }}>
        Survey Detail
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            label={survey.type}
            color={typeColor(survey.type)}
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            {formatDate(survey.createdAt)}
          </Typography>
        </Stack>

        {survey.email && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Email:</strong> {survey.email}
          </Typography>
        )}

        {survey.ip && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>IP:</strong> {survey.ip}
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        {Array.isArray(survey.responses) && survey.responses.length > 0 ? (
          survey.responses.map((r) => (
            <ResponseRow key={r.qid} response={r} />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No responses recorded.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Surveys = () => {
  const dispatch = useDispatch();
  const [surveys, setSurveys] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const fetchSurveys = useCallback(
    async ({ page = 1, limit = DEFAULT_LIMIT, type = "" } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(
          fetchSurveysThunk({ page, limit, type: type || undefined })
        ).unwrap();
        setSurveys(result.surveys);
        setPagination({ page: result.page, limit: result.limit, total: result.total });
      } catch (message) {
        setError(message);
        setSurveys([]);
        setPagination((prev) => ({ ...prev, page: 1, total: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchSurveys({ page: 1, limit: pagination.limit, type: typeFilter });
  }, [typeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (_e, newPageIndex) => {
    fetchSurveys({ page: newPageIndex + 1, limit: pagination.limit, type: typeFilter });
  };

  const handleRowsPerPageChange = (e) => {
    const nextLimit = parseInt(e.target.value, 10);
    fetchSurveys({ page: 1, limit: nextLimit, type: typeFilter });
  };

  return (
    <SideBarLayout
      header={
        <Typography variant="h6" fontWeight={600}>
          Survey Responses
        </Typography>
      }
    >
      <Stack spacing={2}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="mentee">Mentee</MenuItem>
              <MenuItem value="mentor">Mentor</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary">
            {pagination.total} response{pagination.total !== 1 ? "s" : ""}
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Questions Answered</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : surveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No survey responses found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow key={survey._id} hover>
                    <TableCell>
                      <Chip
                        label={survey.type}
                        color={typeColor(survey.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {survey.email || <span style={{ color: "#9e9e9e" }}>—</span>}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {Array.isArray(survey.responses) ? survey.responses.length : 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(survey.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedSurvey(survey)}
                      >
                        View
                      </Button>
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
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>
      </Stack>

      {selectedSurvey && (
        <SurveyDetailDialog
          survey={selectedSurvey}
          onClose={() => setSelectedSurvey(null)}
        />
      )}
    </SideBarLayout>
  );
};

export default Surveys;
