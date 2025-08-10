import { Container, Typography } from "@mui/material";
import { FC, memo } from "react";

type StatusType = "loading" | "error";

interface StatusMessageProps {
  type: StatusType;
  message: string;
}

const StatusMessage: FC<StatusMessageProps> = ({ type, message }) => {
  const isError = type === "error";

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Typography component="p" role={isError ? "alert" : "status"} aria-live={isError ? "assertive" : "polite"} color={isError ? "error" : "inherit"}>
        {message}
      </Typography>
    </Container>
  );
};

export default memo(StatusMessage);
