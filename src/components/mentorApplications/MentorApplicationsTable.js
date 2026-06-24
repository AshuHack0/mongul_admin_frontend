import React, { useMemo } from "react";
import {
  Chip,
  CircularProgress,
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
} from "@mui/material";

const getStatusColor = (status) => {
  switch (status) {
    case "approved": return "success";
    case "rejected": return "error";
    case "applied": return "warning";
    case "upgrade_requested": return "info";
    default: return "default";
  }
};

const defaultRowsPerPageOptions = [5, 10, 25];

const MentorApplicationsTable = ({
  applications,
  loading,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  formatDate,
  onSelect,
}) => {
  const contentRows = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <Stack direction="row" justifyContent="center" py={2}>
              <CircularProgress size={28} />
            </Stack>
          </TableCell>
        </TableRow>
      );
    }

    if (!applications.length) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <Typography variant="body2" color="text.secondary">
              No mentor applications found.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return applications.map((application) => (
      <TableRow
        hover
        key={application._id}
        sx={{ cursor: onSelect ? "pointer" : "default" }}
        onClick={() => onSelect && onSelect(application._id)}
      >
        <TableCell>
          <Stack spacing={0.5}>
            <Typography fontWeight={600}>{application.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {application.email ?? "—"}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{application.phone ?? "—"}</TableCell>
        <TableCell>{application.mentorType ?? "—"}</TableCell>
        <TableCell>{application.experience ?? "—"}</TableCell>
        <TableCell>
          <Chip
            size="small"
            label={application.mentorApplicationStatus ?? "—"}
            color={getStatusColor(application.mentorApplicationStatus)}
            variant="outlined"
          />
        </TableCell>
        <TableCell>{formatDate(application.createdAt)}</TableCell>
      </TableRow>
    ));
  }, [applications, formatDate, loading, onSelect]);

  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mentor</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{contentRows}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={defaultRowsPerPageOptions}
        count={pagination.total}
        rowsPerPage={pagination.limit}
        page={Math.max(0, pagination.page - 1)}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Rows per page"
      />
    </Paper>
  );
};

export default MentorApplicationsTable;
