import type { SnackbarCloseReason } from "@mui/material/Snackbar";
import { Snackbar, Alert } from "@mui/material";
import { FC, memo } from "react";
import type { NotificationData } from "../types/types";

interface NotificationProps {
  notification: NotificationData;
  closeNotification: () => void;
}

const Notification: FC<NotificationProps> = ({ notification, closeNotification }) => {
  const { open, message, severity } = notification;

  // Determine how screen readers announce this message:
  // - "assertive" → for errors, interrupt the current reading and announce immediately
  // - "polite" → for non-errors, wait until the user finishes their current context before announcing
  const ariaLive: "polite" | "assertive" = severity === "error" ? "assertive" : "polite";

  // Determine the ARIA role of the message:
  // - "alert" → used for high-priority messages (e.g., errors), automatically announced by assistive tech
  // - "status" → used for low-priority or informational updates, announced without interrupting the user
  const role: "status" | "alert" = severity === "error" ? "alert" : "status";

  const handleSnackbarClose = (_: unknown, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    closeNotification();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      key={message}
      sx={{
        "& .MuiPaper-root": { width: { xs: "calc(100vw - 32px)", sm: "auto" } },
        bottom: { xs: 12, sm: 24 },
        right: { xs: 12, sm: 24 },
      }}
    >
      <Alert
        onClose={closeNotification}
        severity={severity}
        variant="filled"
        role={role}
        aria-live={ariaLive}
        aria-atomic // read the whole message when it changes
        closeText="Close notification"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default memo(Notification);
