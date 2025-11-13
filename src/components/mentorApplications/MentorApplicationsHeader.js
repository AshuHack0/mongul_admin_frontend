import React from "react";
import { Box, Typography } from "@mui/material";

const MentorApplicationsHeader = () => {
  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Typography variant="h5" fontWeight={600}>
        Mentor Applications
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Review and approve incoming mentor applications.
      </Typography>
    </Box>
  );
};

export default MentorApplicationsHeader;
