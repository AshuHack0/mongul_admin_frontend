import React from "react";
import { Box, Typography } from "@mui/material";

const MentorsHeader = () => {
  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Typography variant="h5" fontWeight={600}>
        Mentors
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Browse approved mentors and their profile details.
      </Typography>
    </Box>
  );
};

export default MentorsHeader;


