"use client";

import { Box, Button, Container, Stack, Tab, Tabs, TextField, Typography, Paper } from "@mui/material";
import { useState, memo, useMemo, useCallback, useEffect, ReactElement, Suspense, lazy } from "react";
import { useParams } from "next/navigation";
const TaskBoard = lazy(() => import("../../components/TaskBoard"));
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useEmployees } from "../../hooks/useEmployees";

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const { employees, loading, error, updateEmployee } = useEmployees();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [telegram, setTelegram] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [tab, setTab] = useState<"info" | "tasks">("info");
  const [phone, setPhone] = useState<string>("");

  const employee = employees.find((employee) => employee.id === id);

  useEffect(() => {
    if (employee) {
      setPhone(employee.phone || "");
      setTelegram(employee.telegram || "");
    }
  }, [employee]);

  const handleSaveChanges = useCallback(() => setOpenDialog(true), []);

  const handleConfirmSave = useCallback(() => {
    updateEmployee(id as string, { phone: phone || "", telegram: telegram || "" });
    setIsEditing(false);
    setOpenDialog(false);
  }, [id, phone, telegram, updateEmployee]);

  const handleCancelChanges = useCallback(() => {
    setPhone(employee?.phone || "");
    setTelegram(employee?.telegram || "");
    setIsEditing(false);
  }, [employee]);

  const tabContent = useMemo(() => {
    if (!employee) {
      return (
        <Typography variant="body1" color="text.secondary">
          Employee not found
        </Typography>
      );
    }

    function Bomb(): ReactElement {
      throw new Error("Test error in child component");
    }

    switch (tab) {
      case "info":
        return (
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            {!isEditing ? (
              <Stack spacing={1.5}>
                <Typography>Role: {employee.role}</Typography>
                <Typography>Department: {employee.department}</Typography>
                <Typography>Phone: {employee.phone || "—"}</Typography>
                <Typography>Telegram: {employee.telegram || "—"}</Typography>
                <Box>
                  <Button variant="contained" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={2} maxWidth={400}>
                <TextField label="Phone" value={phone} onChange={({ target }) => setPhone(target.value)} fullWidth />
                <TextField label="Telegram" value={telegram} onChange={({ target }) => setTelegram(target.value)} fullWidth />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={handleCancelChanges}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </Paper>
        );
      case "tasks":
        return (
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Tasks
            </Typography>
            {/* Uncomment the <Bomb /> component below to test the ErrorBoundary fallback UI. */}
            <ErrorBoundary fallback={<Typography color="error">Something went wrong while loading the task board</Typography>}>
              <Suspense fallback={<Typography>Loading task board...</Typography>}>
                {/* <Bomb /> */}
                <TaskBoard />
              </Suspense>
            </ErrorBoundary>
          </Paper>
        );
      default:
        return null;
    }
  }, [tab, employee, isEditing, phone, telegram, handleSaveChanges, handleCancelChanges]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <ErrorBoundary fallback={<Typography color="error">Something went wrong while loading the employee profile.</Typography>}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: 24, md: 32 } }}>
            {employee?.name}&apos;s Profile
          </Typography>

          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
            <Tab label="Personal Info" value="info" />
            <Tab label="Tasks" value="tasks" />
          </Tabs>
        </Stack>

        {tabContent}

        <ConfirmationDialog open={openDialog} onClose={() => setOpenDialog(false)} onConfirm={handleConfirmSave} title="Confirm Changes" message="Are you sure you want to save these changes?" />
      </Container>
    </ErrorBoundary>
  );
};

export default memo(EmployeeProfilePage);
