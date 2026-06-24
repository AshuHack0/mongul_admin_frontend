import { useDispatch, useSelector } from "react-redux";
import { initializeAuthAsync } from "../store/thunks/authThunks";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

export const AuthGate = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuthAsync());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};
