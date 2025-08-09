import { FC } from "react";
import { Snackbar, Alert } from "@mui/material";
import type { NotificationData } from "../types/types";

interface NotificationProps {
  notification: NotificationData;
  closeNotification: () => void;
}

const Notification: FC<NotificationProps> = ({ notification, closeNotification }) => (
  <Snackbar open={notification.open} autoHideDuration={2000} onClose={closeNotification} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
    <Alert onClose={closeNotification} severity={notification.severity} variant="filled">
      {notification.message}
    </Alert>
  </Snackbar>
);

export default Notification;
