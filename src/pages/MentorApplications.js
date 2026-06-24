import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBarLayout from "../layout/SideBarLayout";
import MentorApplicationsHeader from "../components/mentorApplications/MentorApplicationsHeader";
import MentorApplicationsTable from "../components/mentorApplications/MentorApplicationsTable";
import { fetchMentorApplicationsThunk } from "../store/thunks/mentorApplicationsThunks";

const DEFAULT_LIMIT = 10;

const formatDateTime = (value) => {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (_error) {
    return "—";
  }
};

const MentorApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const header = useMemo(() => <MentorApplicationsHeader />, []);

  const fetchApplications = useCallback(
    async ({ page = 1, limit = DEFAULT_LIMIT } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const { applications: nextApplications, pagination: nextPagination } =
          await dispatch(
            fetchMentorApplicationsThunk({ page, limit })
          ).unwrap();

        setApplications(nextApplications);
        setPagination((prev) => ({
          ...prev,
          ...nextPagination,
        }));
      } catch (message) {
        setError(message);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchApplications({ page: pagination.page, limit: pagination.limit });
  }, [fetchApplications]);

  const handleChangePage = (_event, newPageIndex) => {
    const nextPage = newPageIndex + 1;
    fetchApplications({ page: nextPage, limit: pagination.limit });
  };

  const handleChangeRowsPerPage = (event) => {
    const nextLimit = parseInt(event.target.value, 10);
    fetchApplications({ page: 1, limit: nextLimit });
  };

  const handleSelectApplication = (applicationId) => {
    if (!applicationId) return;
    navigate(`/mentor-applications/${applicationId}`);
  };

  return (
    <SideBarLayout header={header}>
      <Stack spacing={2}>
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            data-testid="mentor-applications-error"
          >
            {error}
          </Alert>
        )}
        <MentorApplicationsTable
          applications={applications}
          loading={loading}
          onSelect={handleSelectApplication}
          pagination={pagination}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          formatDate={formatDateTime}
        />
      </Stack>
    </SideBarLayout>
  );
};

export default MentorApplications;

