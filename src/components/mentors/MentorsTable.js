import React, { useMemo } from "react";
import {
  CircularProgress,
  Chip,
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

const defaultRowsPerPageOptions = [5, 10, 25];

const MentorsTable = ({
  mentors,
  loading,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  formatDate,
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

    if (!mentors.length) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <Typography variant="body2" color="text.secondary">
              No mentors found.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return mentors.map((mentor) => (
      <TableRow hover key={mentor._id}>
        <TableCell>
          <Stack spacing={0.5}>
            <Typography fontWeight={600}>{mentor.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {mentor.email ?? "—"}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{mentor.phone ?? "—"}</TableCell>
        <TableCell>{mentor.mentorType ?? "—"}</TableCell>
        <TableCell>{mentor.experience ?? "—"}</TableCell>
        <TableCell>
          <Chip
            size="small"
            label={mentor.mentorApplicationStatus ?? "—"}
            color={
              mentor.mentorApplicationStatus === "approved"
                ? "success"
                : mentor.mentorApplicationStatus === "rejected"
                ? "error"
                : mentor.mentorApplicationStatus === "upgrade_requested"
                ? "info"
                : "default"
            }
            variant="outlined"
          />
        </TableCell>
        <TableCell>{formatDate(mentor.updatedAt)}</TableCell>
      </TableRow>
    ));
  }, [mentors, formatDate, loading]);

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
              <TableCell>Updated</TableCell>
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

export default MentorsTable;


