import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
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
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SideBarLayout from "../layout/SideBarLayout";
import { fetchSurveysThunk } from "../store/thunks/surveysThunks";
import styles from "../styles/dashboard.module.css";

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

const ResponseRow = ({ response, index }) => {
  const { question, type, answers, openText } = response;

  const renderAnswer = () => {
    if (type === "open") {
      return (
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#52525b", fontStyle: "italic", lineHeight: 1.6 }}>
          {openText || "—"}
        </p>
      );
    }
    if (!answers?.length) {
      return <p style={{ margin: 0, fontSize: "0.875rem", color: "#a1a1aa" }}>—</p>;
    }
    return (
      <Stack direction="row" flexWrap="wrap" gap={0.75}>
        {answers.map((ans, i) => (
          <Chip
            key={i}
            label={ans}
            size="small"
            variant="outlined"
            style={{ fontSize: "0.7rem", borderColor: "#d4d4d8", color: "#3f3f46" }}
          />
        ))}
      </Stack>
    );
  };

  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid #f4f4f5",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: 4,
            background: "#f4f4f5",
            border: "1px solid #e5e5e5",
            fontSize: "0.6rem",
            fontWeight: 700,
            color: "#71717a",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {index + 1}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <p style={{ margin: 0, fontSize: "0.8375rem", fontWeight: 600, color: "#111111", lineHeight: 1.4 }}>
              {question}
            </p>
            <span
              style={{
                fontSize: "0.625rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#a1a1aa",
                background: "#f4f4f5",
                border: "1px solid #e5e5e5",
                borderRadius: 4,
                padding: "2px 6px",
                flexShrink: 0,
              }}
            >
              {type}
            </span>
          </div>
          {renderAnswer()}
        </div>
      </div>
    </div>
  );
};

const SurveyDetailDialog = ({ survey, onClose }) => {
  if (!survey) return null;

  const responses = Array.isArray(survey.responses) ? survey.responses : [];

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <div>
          <Typography style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#111111" }}>
            Survey Response
          </Typography>
          <Typography style={{ fontSize: "0.775rem", color: "#a1a1aa", marginTop: 2 }}>
            {responses.length} question{responses.length !== 1 ? "s" : ""} answered
          </Typography>
        </div>
        <IconButton size="small" onClick={onClose} style={{ color: "#71717a" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <DialogContent style={{ padding: "16px 20px" }}>
        {/* Meta */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            padding: "12px 14px",
            background: "#fafafa",
            border: "1px solid #e5e5e5",
            borderRadius: 7,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#52525b",
                background: "#e4e4e7",
                borderRadius: 4,
                padding: "3px 8px",
              }}
            >
              {survey.type}
            </span>
          </div>

          {survey.email && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <EmailOutlinedIcon style={{ fontSize: 14, color: "#a1a1aa" }} />
              <Typography style={{ fontSize: "0.8rem", color: "#52525b" }}>
                {survey.email}
              </Typography>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <AccessTimeOutlinedIcon style={{ fontSize: 14, color: "#a1a1aa" }} />
            <Typography style={{ fontSize: "0.8rem", color: "#71717a" }}>
              {formatDate(survey.createdAt)}
            </Typography>
          </div>
        </div>

        {/* Responses */}
        {responses.length > 0 ? (
          <div>
            {responses.map((r, i) => (
              <ResponseRow key={r.qid ?? i} response={r} index={i} />
            ))}
          </div>
        ) : (
          <Typography style={{ fontSize: "0.875rem", color: "#a1a1aa", textAlign: "center", padding: "32px 0" }}>
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
  const [pagination, setPagination] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0 });
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

  return (
    <SideBarLayout
      header={
        <div className={styles.pageHeader}>
          <Typography className={styles.pageTitle}>Survey Responses</Typography>
          <Typography className={styles.pageSubtitle}>
            View feedback submitted by mentors and mentees.
          </Typography>
        </div>
      }
    >
      <Stack spacing={2}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filter bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <FormControl size="small" style={{ minWidth: 140 }}>
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
          <Typography style={{ fontSize: "0.8125rem", color: "#a1a1aa" }}>
            {pagination.total} response{pagination.total !== 1 ? "s" : ""}
          </Typography>
        </div>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : surveys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography style={{ fontSize: "0.875rem", color: "#a1a1aa" }}>
                      No survey responses found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow key={survey._id} hover>
                    <TableCell>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "#52525b",
                          background: "#f4f4f5",
                          border: "1px solid #e5e5e5",
                          borderRadius: 4,
                          padding: "3px 7px",
                        }}
                      >
                        {survey.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Typography style={{ fontSize: "0.875rem", color: survey.email ? "#111111" : "#a1a1aa" }}>
                        {survey.email || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography style={{ fontSize: "0.875rem", color: "#111111" }}>
                        {Array.isArray(survey.responses) ? survey.responses.length : 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography style={{ fontSize: "0.875rem", color: "#71717a" }}>
                        {formatDate(survey.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
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
            onPageChange={(_e, p) => fetchSurveys({ page: p + 1, limit: pagination.limit, type: typeFilter })}
            onRowsPerPageChange={(e) => fetchSurveys({ page: 1, limit: parseInt(e.target.value, 10), type: typeFilter })}
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
