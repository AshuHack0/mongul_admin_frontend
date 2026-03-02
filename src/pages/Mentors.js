import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Stack } from "@mui/material";
import SideBarLayout from "../layout/SideBarLayout";
import MentorsHeader from "../components/mentors/MentorsHeader";
import MentorsTable from "../components/mentors/MentorsTable";
import { fetchMentorsThunk } from "../store/thunks/mentorsThunks";

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

const Mentors = () => {
  const dispatch = useDispatch();
  const [mentors, setMentors] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const header = useMemo(() => <MentorsHeader />, []);

  const fetchMentors = useCallback(
    async ({ page = 1, limit = DEFAULT_LIMIT } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const { mentors: nextMentors, pagination: nextPagination } =
          await dispatch(fetchMentorsThunk({ page, limit })).unwrap();

        setMentors(nextMentors);
        setPagination((prev) => ({
          ...prev,
          ...nextPagination,
        }));
      } catch (message) {
        setError(message);
        setMentors([]);
        setPagination((prev) => ({ ...prev, page: 1, total: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    fetchMentors({ page: pagination.page, limit: pagination.limit });
  }, [fetchMentors, pagination.limit, pagination.page]);

  const handleChangePage = (_event, newPageIndex) => {
    const nextPage = newPageIndex + 1;
    fetchMentors({ page: nextPage, limit: pagination.limit });
  };

  const handleChangeRowsPerPage = (event) => {
    const nextLimit = parseInt(event.target.value, 10);
    fetchMentors({ page: 1, limit: nextLimit });
  };

  return (
    <SideBarLayout header={header}>
      <Stack spacing={2}>
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            data-testid="mentors-error"
          >
            {error}
          </Alert>
        )}
        <MentorsTable
          mentors={mentors}
          loading={loading}
          pagination={pagination}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          formatDate={formatDateTime}
        />
      </Stack>
    </SideBarLayout>
  );
};

export default Mentors;


