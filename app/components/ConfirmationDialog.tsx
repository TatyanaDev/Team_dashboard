import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Stack } from "@mui/material";
import { FC, memo } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, title, message }) => {
  const titleId = "confirmation-dialog-title";
  const descId = "confirmation-dialog-description";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id={titleId} sx={{ fontSize: { xs: 18, md: 20 }, fontWeight: 600 }}>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id={descId}>{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: "100%" }}>
          <Button onClick={onClose} color="secondary" variant="text" sx={{ flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained" autoFocus sx={{ flex: 1 }}>
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ConfirmationDialog);
