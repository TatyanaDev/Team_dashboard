// This function simulates sending the updated task status to the server
export const updateTaskOnServer = async (taskId: string, status: string) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Error updating task with ID ${taskId}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw new Error("Error while updating the task");
  }
};
