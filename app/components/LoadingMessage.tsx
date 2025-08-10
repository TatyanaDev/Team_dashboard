import { Container, Typography } from "@mui/material";
import { FC, memo } from "react";

interface LoadingMessageProps {
  message?: string;
}

const LoadingMessage: FC<LoadingMessageProps> = ({ message = "Loading..." }) => (
  <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
    <Typography component="p" role="status" aria-live="polite">
      {message}
    </Typography>
  </Container>
);

export default memo(LoadingMessage);
