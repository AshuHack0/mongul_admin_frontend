import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert, Box } from "@mui/material";
import {
  selectNotifications,
  removeNotification,
} from "../store/slices/uiSlice";

/**
 * Notification System Component
 * Displays notifications from the Redux store with auto-dismiss functionality
 * Implements production-grade notification management with proper cleanup
 */
const NotificationSystem = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  /**
   * Handle notification close
   * @param {number} id - Notification ID to remove
   */
  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  /**
   * Auto-dismiss notifications based on duration
   */
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  // Don't render if no notifications
  if (!notifications.length) {
    return null;
  }

  return (
    <Box>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 6000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{
            vertical: notification.position?.vertical || "top",
            horizontal: notification.position?.horizontal || "right",
          }}
          sx={{
            "& .MuiSnackbar-root": {
              zIndex: 9999,
            },
          }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{
              width: "100%",
              minWidth: 300,
              maxWidth: 400,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default NotificationSystem;
