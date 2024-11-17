import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

interface TaskProps {
  fetchID: string;
  isDarkMode: boolean;
}

interface TaskDetails {
  description: string;
  fileUrl?: string;
  projectName: string;
  createdAt: string;
}

export default function Task({ fetchID, isDarkMode }: TaskProps) {
  const [loading, setLoading] = React.useState(true);
  const [taskDetails, setTaskDetails] = React.useState<TaskDetails | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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
          setError('Failed to fetch task details');
        }
      } catch (err) {
        setError('Error loading task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [fetchID]);

  if (loading || error) {
    return (
      <div className={`mb-3 p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
      } shadow-sm`}>
        <p className="text-sm">{loading ? 'Loading...' : error}</p>
      </div>
    );
  }

  return (
    <div className={`mb-3 p-4 rounded-lg ${
      isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
    } shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-4`}>
      {/* Project Name Badge */}
      <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-600'
      }`}>
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
            isDarkMode ? 'hover:bg-gray-300' : 'hover:bg-gray-600'
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
        {new Date(taskDetails?.createdAt || '').toLocaleDateString()}
      </div>
    </div>
  );
}
