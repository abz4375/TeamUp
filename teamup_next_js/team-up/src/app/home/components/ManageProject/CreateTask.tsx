import React from "react";
import { Avatar, Tooltip, Chip, TextField, Autocomplete } from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";

interface CreateTaskProps {
  isDarkMode: boolean;
  userDetail: {
    emailId: string;
    name: string;
    profilePic: string;
  };
  users: any[];
  emptyList: string;
  userSearchTerm: string;
  setUserSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
  value: any[];
  setValue: React.Dispatch<React.SetStateAction<any[]>>;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  isDarkMode,
  userDetail,
  users,
  emptyList,
  userSearchTerm,
  setUserSearchTerm,
  setFetchAgain,
  value,
  setValue,
}) => {
  const [taskDescription, setTaskDescription] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);

  const handleSave = async () => {
    // Create a task object with all the necessary information
    const task = {
      description: taskDescription,
      assignees: value.map((user) => user.emailId),
      file: uploadedFile,
    };

    try {
      // Here, you would typically make an API call to save the task
      // For example:
      // await api.createTask(task);

      console.log("Task saved:", task);

      // Clear the form after successful save
      setTaskDescription("");
      setValue([
        {
          name: userDetail.name,
          emailId: userDetail.emailId,
          profilePic: userDetail.profilePic,
        },
      ]);
      setUploadedFile(null);

      // You might want to close the create task modal or update the task list here
    } catch (error) {
      console.error("Error saving task:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  return (
    <div
      className={`w-full h-fit flex flex-row shadow-sm ${
        isDarkMode ? "bg-dark-bg-secondary" : "bg-white"
      }`}
    >
      <div className="w-2/3 m-1">
        <textarea
          className={`w-full border-2 rounded-md p-4 text-2xl flex flex-col overflow-auto resize-none h-60 ${
            isDarkMode
              ? "bg-gray-800 text-dark-text border-dark-border"
              : "bg-white text-black border-blue-900 border-opacity-10"
          }`}
          placeholder="Task Description..."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        ></textarea>
        <form action={() => {}} className="mx-auto grid w-full h-20 mt-3">
          <div
            className={`mx-auto flex flex-row text-lg w-full h-full border-none rounded-md ${
              isDarkMode ? "bg-dark-bg-secondary" : "bg-white"
            }`}
          >
            <Autocomplete
              className="ml-2 mr-auto my-auto"
              sx={(theme) => ({
                width: "80vw",
                "& .MuiInputBase-root": {
                  color: isDarkMode
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                  backgroundColor: isDarkMode
                    ? theme.palette.grey[800]
                    : theme.palette.background.paper,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode
                    ? theme.palette.grey[700]
                    : theme.palette.grey[300],
                },
                "& .MuiInputLabel-root": {
                  color: isDarkMode
                    ? theme.palette.grey[400]
                    : theme.palette.grey[600],
                },
                "& .MuiAutocomplete-popupIndicator": {
                  color: isDarkMode
                    ? theme.palette.grey[400]
                    : theme.palette.grey[600],
                },
                "& .MuiAutocomplete-clearIndicator": {
                  color: isDarkMode
                    ? theme.palette.grey[400]
                    : theme.palette.grey[600],
                },
              })}
              multiple
              id="fixed-tags-demo"
              value={value}
              onChange={(event, newValue) => {
                setValue([
                  {
                    name: userDetail.name,
                    emailId: userDetail.emailId,
                    profilePic: userDetail.profilePic,
                  },
                  ...newValue.filter(
                    (option) => option.emailId !== userDetail.emailId
                  ),
                ]);
                setUserSearchTerm(userSearchTerm);
              }}
              options={users}
              getOptionLabel={(option) => option.emailId ?? ""}
              renderOption={(props, option) =>
                option.emailId ? (
                  <li
                    {...props}
                    className={`m-2 p-1 rounded-lg transition flex flex-row cursor-pointer ${
                      isDarkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-gray-100 text-gray-900"
                    }`}
                  >
                    <Avatar src={option.profilePic ?? ""} className="mr-3" />
                    <div className="flex flex-col">
                      <span
                        className={
                          isDarkMode ? "text-gray-200" : "text-gray-900"
                        }
                      >
                        {option.name ?? ""}
                      </span>
                      <span
                        style={{ fontSize: "smaller" }}
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      >
                        {option.emailId ?? ""}
                      </span>
                    </div>
                  </li>
                ) : (
                  <div
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    search...
                  </div>
                )
              }
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Tooltip title={option.emailId} key={index}>
                    <Chip
                      label={option.name}
                      avatar={<Avatar src={option.profilePic} />}
                      {...getTagProps({ index })}
                      disabled={option.emailId === userDetail.emailId}
                      className={`m-1 transition-all ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    />
                  </Tooltip>
                ))
              }
              style={{ width: 600 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign To"
                  placeholder={value.length === 1 ? "Search by e-mail" : ""}
                  onChange={(e) => {
                    setUserSearchTerm(e.target.value);
                    setFetchAgain(true);
                  }}
                  value={userSearchTerm}
                  InputProps={{
                    ...params.InputProps,
                    style: { color: isDarkMode ? "#E5E7EB" : undefined },
                  }}
                  InputLabelProps={{
                    style: { color: isDarkMode ? "#9CA3AF" : undefined },
                  }}
                />
              )}
              noOptionsText={
                <span
                  className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                >
                  {emptyList}
                </span>
              }
              componentsProps={{
                paper: {
                  className: isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-900",
                },
              }}
            />
          </div>
        </form>
      </div>

      <div className="flex flex-col w-1/3">
        <div
          className={`border rounded-md m-1 flex flex-col overflow-hidden h-60 ${
            isDarkMode
              ? "bg-dark-bg-secondary border-dark-border"
              : "bg-white border-gray-600 border-opacity-15"
          }`}
        >
          <span
            className={`mt-0 w-full px-4 py-2 font-light text-xl h-fit text-center border-b-2 ${
              isDarkMode
                ? "bg-dark-bg-secondary text-dark-text border-dark-border"
                : "bg-white text-black border-gray-400"
            }`}
          >
            📎 - Add Documents
          </span>
          <div className="flex flex-col overflow-auto py-2">
            <div
              className={`flex flex-row h-fit w-full overflow-hidden ml-0 mr-auto mt-0 border-none p-1 rounded-lg pl-0 pr-4 ${
                isDarkMode ? "bg-dark-bg" : "bg-gray-50"
              }`}
            >
              <button
                className={`hover:bg-gray-500 ml-auto mr-2 text-white rounded-full active:bg-gray-600 transition flex flex-row my-auto p-1 ${
                  isDarkMode ? "bg-gray-600" : "bg-gray-400"
                }`}
              >
                <PublishIcon className="w-6 h-6 mx-auto my-auto" />
                <input
                  type="file"
                  className="opacity-0 absolute cursor-pointer"
                  onChange={(event) => {
                    const selectedFile = event.target.files
                      ? event.target.files[0]
                      : null;
                    setUploadedFile(selectedFile);
                    console.log(selectedFile?.name);
                  }}
                />
              </button>
              <div
                className={`border-none h-fit my-auto text-lg font-normal font-sans ml-0 mr-auto ${
                  isDarkMode ? "text-dark-text" : "text-black"
                }`}
              >
                Upload
              </div>
            </div>
          </div>
        </div>
        <button
          className={`h-20 m-2 border-2 rounded-lg text-lg font-semibold transition-all ${
            isDarkMode
              ? "border-green-700 bg-green-900 text-green-100 active:bg-green-800"
              : "border-green-500 bg-green-100 text-green-900 active:bg-green-200"
          }`}
          onClick={handleSave}
        >
          💾 Save
        </button>
      </div>
    </div>
  );
};

export default CreateTask;