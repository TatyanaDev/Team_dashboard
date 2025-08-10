"use client";

import { Box, Button, Container, Stack, Tab, Tabs, TextField, Typography, Paper } from "@mui/material";
import { useState, memo, useCallback, useEffect, ReactElement, Suspense, lazy } from "react";
import { useParams } from "next/navigation";
const TaskBoard = lazy(() => import("../../components/TaskBoard"));
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useEmployees } from "../../hooks/useEmployees";

type TabKey = "info" | "tasks";

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const { employees, loading, error, updateEmployee } = useEmployees();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [telegram, setTelegram] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [tab, setTab] = useState<TabKey>("info");
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

  if (!employee) {
    return (
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Typography component="p" role="alert" aria-live="assertive" color="text.secondary">
          Employee not found
        </Typography>
      </Container>
    );
  }

  function Bomb(): ReactElement {
    throw new Error("Test error in child component");
  }

  const tabContent = (() => {
    if (tab === "info") {
      return (
        <Box id="employee-tabpanel-info" role="tabpanel" aria-labelledby="employee-tab-info" hidden={tab !== "info"} sx={{ display: tab === "info" ? "block" : "none" }}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography component="h2" variant="h6" gutterBottom>
              Personal Information
            </Typography>

            {!isEditing ? (
              <Stack spacing={1.5} component="section" aria-label="Employee personal details">
                <Typography>Role: {employee.role}</Typography>
                <Typography>Department: {employee.department}</Typography>
                <Typography>Phone: {employee.phone || "—"}</Typography>
                <Typography>Telegram: {employee.telegram || "—"}</Typography>
                <Box>
                  <Button variant="contained" onClick={() => setIsEditing(true)} aria-label="Edit personal information">
                    Edit
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={2} maxWidth={400} component="form" aria-label="Edit personal information form">
                <TextField label="Phone" value={phone} onChange={({ target }) => setPhone(target.value)} fullWidth />
                <TextField label="Telegram" value={telegram} onChange={({ target }) => setTelegram(target.value)} fullWidth />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleSaveChanges} aria-label="Save changes">
                    Save Changes
                  </Button>
                  <Button variant="outlined" onClick={handleCancelChanges} aria-label="Cancel changes">
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </Paper>
        </Box>
      );
    }

    return (
      <Box id="employee-tabpanel-tasks" role="tabpanel" aria-labelledby="employee-tab-tasks" hidden={tab !== "tasks"} sx={{ display: tab === "tasks" ? "block" : "none" }}>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography component="h2" variant="h6" gutterBottom>
            Tasks
          </Typography>
          <ErrorBoundary
            fallback={
              <Typography component="p" role="alert" aria-live="assertive" color="error">
                Something went wrong while loading the task board
              </Typography>
            }
          >
            <Suspense
              fallback={
                <Typography role="status" aria-live="polite">
                  Loading task board...
                </Typography>
              }
            >
              {/* Uncomment the <Bomb /> component below to test the ErrorBoundary fallback UI. */}
              {/* <Bomb /> */}
              <TaskBoard />
            </Suspense>
          </ErrorBoundary>
        </Paper>
      </Box>
    );
  })();

  if (loading) {
    return (
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Typography component="p" role="status" aria-live="polite">
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Typography component="p" role="alert" aria-live="assertive" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <Typography component="p" role="alert" aria-live="assertive" color="error">
          Something went wrong while loading the employee profile.
        </Typography>
      }
    >
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Stack component="header" spacing={2} sx={{ mb: 3 }}>
          <Typography component="h1" variant="h4" fontWeight={700} sx={{ fontSize: { xs: 24, md: 32 } }}>
            {employee.name}&apos;s Profile
          </Typography>

          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="Employee profile sections">
            <Tab label="Personal Info" value="info" id="employee-tab-info" aria-controls="employee-tabpanel-info" />
            <Tab label="Tasks" value="tasks" id="employee-tab-tasks" aria-controls="employee-tabpanel-tasks" />
          </Tabs>
        </Stack>

        {tabContent}

        <ConfirmationDialog open={openDialog} onClose={() => setOpenDialog(false)} onConfirm={handleConfirmSave} title="Confirm Changes" message="Are you sure you want to save these changes?" />
      </Container>
    </ErrorBoundary>
  );
};

export default memo(EmployeeProfilePage);
