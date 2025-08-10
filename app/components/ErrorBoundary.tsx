import { Box, Typography, Alert } from "@mui/material";
import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            Please try refreshing the page.
          </Alert>
        </Box>
      );
    }

    return <>{this.props.children}</>;
  }
}
