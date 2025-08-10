import { Container, Typography } from "@mui/material";
import { FC, memo } from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => (
  <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
    <Typography component="p" role="alert" aria-live="assertive" color="error">
      {message}
    </Typography>
  </Container>
);

export default memo(ErrorMessage);
