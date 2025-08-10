import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { FC, memo, Suspense, lazy } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import type { Employee, TabKey } from "../types/types";

const TaskBoard = lazy(() => import("../components/TaskBoard"));

interface EmployeeTabPanelsProps {
  tab: TabKey;
  employee: Employee;
  isEditing: boolean;
  phone: string;
  telegram: string;
  onEditToggle: (value: boolean) => void;
  onPhoneChange: (value: string) => void;
  onTelegramChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EmployeeTabPanels: FC<EmployeeTabPanelsProps> = ({ tab, employee, isEditing, phone, telegram, onEditToggle, onPhoneChange, onTelegramChange, onSave, onCancel }) => {
  function Bomb(): never {
    throw new Error("Test error in child component");
  }

  return (
    <>
      {/* Info panel */}
      <Box id="employee-tabpanel-info" role="tabpanel" aria-labelledby="employee-tab-info" hidden={tab !== "info"} sx={{ display: tab === "info" ? "block" : "none" }}>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography component="h2" variant="h6" gutterBottom>
            Personal Information
          </Typography>

          {isEditing ? (
            <Stack spacing={2} maxWidth={400} component="form" aria-label="Edit personal information form">
              <TextField label="Phone" value={phone} onChange={({ target }) => onPhoneChange(target.value)} fullWidth />
              <TextField label="Telegram" value={telegram} onChange={({ target }) => onTelegramChange(target.value)} fullWidth />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={onSave} aria-label="Save changes">
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={onCancel} aria-label="Cancel changes">
                  Cancel
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={1.5} component="section" aria-label="Employee personal details">
              <Typography>Role: {employee.role}</Typography>
              <Typography>Department: {employee.department}</Typography>
              <Typography>Phone: {employee.phone || "—"}</Typography>
              <Typography>Telegram: {employee.telegram || "—"}</Typography>
              <Button variant="contained" onClick={() => onEditToggle(true)} aria-label="Edit personal information" sx={{ mt: 1, alignSelf: "flex-start" }}>
                Edit
              </Button>
            </Stack>
          )}
        </Paper>
      </Box>

      {/* Tasks panel */}
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
    </>
  );
};

export default memo(EmployeeTabPanels);
