import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import DoneIcon from "@mui/icons-material/Done";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface TaskProps {
  fetchID: string;
  isDarkMode: boolean;
  isMaintainer?: boolean; // Add this prop to check if current user is maintainer
  currentUserEmail: string; // Add this to identify current user
}

interface TaskDetails {
  description: string;
  fileUrl?: string;
  projectName: string;
  createdAt: string;
  assignees: string[];
  maintainers: string[]; // Ensure this is always an array, even if empty
  approvals: string[]; // Ensure this is always an array, even if empty
  submitted: boolean;
  projectId: string;
}

export default function Task({
  fetchID,
  isDarkMode,
  isMaintainer,
  currentUserEmail,
}: TaskProps) {
  const [loading, setLoading] = React.useState(true);
  const [taskDetails, setTaskDetails] = React.useState<TaskDetails | null>({
    description: "",
    projectName: "",
    createdAt: "",
    assignees: [],
    maintainers: [], // Initialize with empty array
    approvals: [], // Initialize with empty array
    submitted: false,
    projectId: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [approving, setApproving] = React.useState(false);

  // Calculate approval progress
  const approvalProgress =
    taskDetails && taskDetails.approvals && taskDetails.maintainers
      ? (taskDetails.approvals.length / taskDetails.maintainers.length) * 100
      : 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/task/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: fetchID,
          userEmail: currentUserEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTaskDetails((prev) => (prev ? { ...prev, submitted: true } : null));
      }
    } catch (err) {
      console.error("Error submitting task:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const response = await fetch("/api/task/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: fetchID,
          maintainerEmail: currentUserEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTaskDetails((prev) =>
          prev
            ? {
                ...prev,
                approvals: [...prev.approvals, currentUserEmail],
              }
            : null
        );
      }
    } catch (err) {
      console.error("Error approving task:", err);
    } finally {
      setApproving(false);
    }
  };

  React.useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/api/task?id=${fetchID}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTaskDetails(data.task);
          } else {
            setError(data.message);
          }
        } else {
          setError("Failed to fetch task details");
        }
      } catch (err) {
        setError("Error loading task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [fetchID]);

  if (loading || error) {
    return (
      <div
        className={`mb-3 p-4 rounded-lg ${
          isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
        } shadow-sm`}
      >
        <p className="text-sm">{loading ? "Loading..." : error}</p>
      </div>
    );
  }

  return (
    <div
      className={`mb-3 p-4 rounded-lg ${
        isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
      } shadow-sm hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center gap-4">
        {/* Project Name Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            isDarkMode
              ? "bg-blue-500/20 text-blue-300"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {taskDetails?.projectName}
        </div>

        {/* Description */}
        <div className="flex-grow">
          <p className="text-sm break-words">{taskDetails?.description}</p>
        </div>

        {/* File Attachment */}
        {taskDetails?.fileUrl && (
          <a
            href={taskDetails.fileUrl}
            className={`shrink-0 p-1.5 rounded-full hover:bg-opacity-10 ${
              isDarkMode ? "hover:bg-gray-300" : "hover:bg-gray-600"
            }`}
            target="_blank"
            rel="noopener noreferrer"
            title="Attached File"
          >
            📎
          </a>
        )}

        {/* Date */}
        <div className="text-xs opacity-75 whitespace-nowrap">
          {new Date(taskDetails?.createdAt || "").toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          {taskDetails?.assignees.includes(currentUserEmail) &&
            !taskDetails.submitted && (
              <LoadingButton
                loading={submitting}
                variant="contained"
                size="small"
                onClick={handleSubmit}
                className={isDarkMode ? "bg-blue-600" : "bg-blue-500"}
              >
                Submit
              </LoadingButton>
            )}

          {taskDetails?.submitted &&
            isMaintainer &&
            !taskDetails.approvals.includes(currentUserEmail) && (
              <LoadingButton
                loading={approving}
                variant="contained"
                size="small"
                onClick={handleApprove}
                className={isDarkMode ? "bg-green-600" : "bg-green-500"}
                startIcon={<CheckCircleIcon />}
              >
                Approve
              </LoadingButton>
            )}
        </div>
      </div>

      {/* Progress Bar - only show after submission */}
      {taskDetails?.submitted && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Approvals</span>
            <span>
              {taskDetails?.approvals?.length || 0}/
              {taskDetails?.maintainers?.length || 0}
            </span>
          </div>
          <LinearProgress
            variant="determinate"
            value={approvalProgress}
            className={isDarkMode ? "bg-gray-600" : "bg-gray-200"}
          />
        </div>
      )}
    </div>
    // </div>
  );
}
