"use client";

import { useState, memo, useMemo, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useEmployees } from "../../hooks/useEmployees";
import TaskBoard from "../../components/TaskBoard";

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
      return <div>Employee not found</div>;
    }

    switch (tab) {
      case "info":
        return (
          <div>
            <h2>Personal Information</h2>
            {!isEditing ? (
              <div>
                <p>Role: {employee.role}</p>
                <p>Department: {employee.department}</p>
                <p>Phone: {employee.phone}</p>
                <p>Telegram: {employee.telegram}</p>
                <button onClick={() => setIsEditing(true)}>Edit</button>
              </div>
            ) : (
              <div>
                <div>
                  <label>Phone:</label>
                  <input type="text" value={phone} onChange={({ target }) => setPhone(target.value)} />
                </div>
                <div>
                  <label>Telegram:</label>
                  <input type="text" value={telegram} onChange={({ target }) => setTelegram(target.value)} />
                </div>
                <button onClick={handleSaveChanges}>Save Changes</button>
                <button onClick={handleCancelChanges}>Cancel</button>
              </div>
            )}
          </div>
        );
      case "tasks":
        return (
          <div>
            <h2>Tasks</h2>
            <TaskBoard />
          </div>
        );
      default:
        return null;
    }
  }, [tab, employee, isEditing, phone, telegram, handleSaveChanges, handleCancelChanges]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{employee?.name}&apos;s Profile</h1>

      <div>
        <button onClick={() => setTab("info")}>Personal Info</button>
        <button onClick={() => setTab("tasks")}>Tasks</button>
      </div>

      {tabContent}

      <ConfirmationDialog open={openDialog} onClose={() => setOpenDialog(false)} onConfirm={handleConfirmSave} title="Confirm Changes" message="Are you sure you want to save these changes?" />
    </div>
  );
};

export default memo(EmployeeProfilePage);
