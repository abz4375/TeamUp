"use client";
import * as React from "react";
import clsx from "clsx";
import { styled, css } from "@mui/system";
import { Portal } from "@mui/base/Portal";
import { FocusTrap } from "@mui/base/FocusTrap";
import { unstable_useModal as useModal } from "@mui/base/unstable_useModal";
import Fade from "@mui/material/Fade";
import InfoIcon from "@mui/icons-material/Info";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  twilight,
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CreateTask from "./ManageProject/CreateTask";
import Contributor from "./ManageProject/Contributor";
import Task from "./Task";

interface Props {
  userDetail: {
    emailId: string;
    name: string;
    profilePic: string;
  };
  projectToggle: boolean;
  projectPageId: string;
  setProjectToggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: boolean;
  setRefreshHomePage: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean; // Add this line
}

function ManageProject(props: Props) {
  const [userSearchTerm, setUserSearchTerm] = React.useState("");
  const [users, setUsers] = React.useState<any>([{ empty: true }]);
  const [emptyList, setEmptyList] = React.useState("");
  const [fetchAgain, setFetchAgain] = React.useState(props.projectToggle);
  const [projectTasks, setProjectTasks] = React.useState<any[]>([]);
  const isDarkMode = props.isDarkMode;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedDescription, setEditedDescription] = React.useState("");
  const [showPreview, setShowPreview] = React.useState(true);

  const handleEditClick = () => {
    setEditedDescription(info?.description || "");
    // Set showPreview first, then isEditing
    setShowPreview(false);
    setIsEditing(true);
  };

  const handleSaveDescription = async () => {
    try {
      const response = await fetch(`/api/project`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: props.projectPageId,
          description: editedDescription,
        }),
      });
  
      if (response.ok) {
        setInfo({ ...info, description: editedDescription });
        // Set isEditing first, then showPreview
        setIsEditing(false);
        setShowPreview(true);
      } else {
        console.error('Failed to update description');
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  const [info, setInfo] = React.useState({
    title: "",
    description: "",
    owner: "",
    maintainers: [""],
    contributors: [],
    tasks: [],
    contributions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  React.useEffect(() => {
    const fetchData = async () => {
      if (fetchAgain && props.projectPageId) {
        const baseURL = process.env.VERCEL_URL;
        const response = await fetch(`/api/project?id=` + props.projectPageId);
        if (response.ok) {
          const responseJson = await response.json();

          if (await responseJson[0]) {
            setInfo(await responseJson[0]);
            setFetchAgain(false);
          }
        } else if (response.status === 404) {
          console.error("Fetch failed:", response.statusText);
          setFetchAgain(false);
        } else {
          setFetchAgain(true);
        }
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchProjectTasks = async () => {
      try {
        const response = await fetch(
          `/api/task?projectId=${props.projectPageId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProjectTasks(data.tasks);
          }
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (props.projectPageId) {
      fetchProjectTasks();
    }
  }, [props.projectPageId]);

  const [open, setOpen] = React.useState(props.toggle || false);
  const [currentPage, setCurrentPage] = React.useState("tasks");
  const [createTask, setCreateTask] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    props.setProjectToggle(false);
  };

  const [value, setValue] = React.useState<any[]>([]);

  const handleCreateTask = async (taskData: any) => {
    console.log("Creating task:", taskData);

    // Create a FormData object to send files and other task data
    const formData = new FormData();

    // Append task data to formData
    Object.keys(taskData).forEach((key) => {
      if (key !== "files") {
        formData.append(key, taskData[key]);
      }
    });

    // Append files to formData
    if (taskData.files && taskData.files.length > 0) {
      taskData.files.forEach((file: File, index: number) => {
        formData.append(`file-${index}`, file);
      });
    }

    try {
      // Send a POST request to your server to create the task and upload files
      const response = await fetch("/api/task", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (response.ok) {
        const result = await response.json();
        console.log("Task created successfully:", result);

        // Update the local state or trigger a refresh
        setFetchAgain(true);

        // Close the create task modal
        setCreateTask(false);
      } else {
        console.error("Failed to create task:", await response.text());
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleTaskCreated = () => {
    setCreateTask(false); // Close the create task modal
    // Optionally refresh the task list
    // fetchTasks(); // You'll need to implement this
  };

  return (
    <div className={props.isDarkMode ? "dark" : ""}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <ModalContent
            sx={style}
            className={`
    overflow-auto overflow-x-hidden
    ${props.isDarkMode ? "bg-dark-bg text-dark-text" : "bg-white text-black"}
    w-[90%] md:w-11/12 lg:w-4/5 xl:w-3/4  
    h-[90vh] md:h-[90vh] lg:h-[85vh]
    p-2 md:p-4 lg:p-6
    mx-auto
    flex flex-col
    rounded-lg
  `}
            isDarkMode={props.isDarkMode}
          >
            <div
              id="transition-modal-title"
              className={`modal-title text-left text-2xl md:text-3xl flex flex-row items-center gap-4 p-2 ${
                props.isDarkMode ? "text-dark-text" : "text-black"
              }`}
            >
              <span className="font-semibold truncate flex-1">
                {info?.title}
              </span>
              <button
                className={`flex items-center px-3 py-1 text-sm md:text-base border-2 rounded-md transition-all ${
                  currentPage === "info"
                    ? props.isDarkMode
                      ? "bg-blue-900 border-blue-500"
                      : "bg-blue-50 border-blue-500"
                    : props.isDarkMode
                    ? "hover:bg-blue-900 border-blue-400"
                    : "hover:bg-blue-50 border-blue-400"
                }`}
                onClick={() => {
                  if (currentPage !== "info") setCurrentPage("info");
                  else setCurrentPage("tasks");
                }}
              >
                <InfoIcon
                  className="h-4 w-4 md:h-5 md:w-5"
                  style={{ color: blue[500] }}
                />
                <span className="ml-2 text-blue-500">Info</span>
              </button>
            </div>

            <div
              className={
                currentPage === "info"
                  ? `border-none w-full mx-auto mt-0 overflow-auto modal-content h-full rounded-lg p-1 ${
                      props.isDarkMode
                        ? "bg-dark-bg-secondary"
                        : "bg-gray-200 bg-opacity-30"
                    } min-h-96`
                  : `border-t-2 border-gray-500 w-full mt-0 overflow-hidden modal-content h-0 p-0`
              }
            >
              <div
                className={
                  "w-full h-full flex flex-col md:flex-row " +
                  (currentPage === "info" ? "" : " hidden")
                }
              >
                {/* <div
                  className={`
      w-full md:w-2/3 
      border-2 border-blue-500 border-opacity-10 
      rounded-md m-1 p-2 md:p-4 
      text-base md:text-lg 
      flex flex-col overflow-auto border-none
      ${
        props.isDarkMode
          ? "text-dark-text bg-dark-bg-secondary bg-opacity-100"
          : "text-black"
      }
    `}
                >
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    children={info?.description}
                    components={{
                      code(props) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <SyntaxHighlighter
                            {...rest}
                            PreTag="div"
                            children={String(children).replace(/\n$/, "")}
                            language={match[1]}
                            style={vscDarkPlus}
                            ref={null}
                          />
                        ) : (
                          <div
                            {...rest}
                            className={
                              isDarkMode
                                ? "bg-gray-700 rounded-md px-1 font-mono w-fit inline-block"
                                : "bg-gray-200 rounded-md px-1 font-mono w-fit inline-block"
                            }
                            ref={null}
                          >
                            {children}
                          </div>
                        );
                      },
                    }}
                  />
                </div> */}
                <div
                  className={`
  w-full md:w-2/3 
  border-2 border-blue-500 border-opacity-10 
  rounded-md m-1 p-2 md:p-4 
  text-base md:text-lg 
  flex flex-col overflow-auto border-none
  ${
    props.isDarkMode
      ? "text-dark-text bg-dark-bg-secondary bg-opacity-100"
      : "text-black"
  }
`}
                >
                  {/* Add edit button for maintainers */}
                  {info.maintainers.indexOf(props.userDetail.emailId) !==
                    -1 && (
                    <div className="flex justify-end mb-2 gap-2">
                      {isEditing ? (
                        <>
                          <button
                            className={`px-3 py-1 rounded-md text-sm transition ${
                              props.isDarkMode
                                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            onClick={() => setShowPreview(!showPreview)}
                          >
                            {showPreview ? "Edit" : "Preview"}
                          </button>
                          <button
                            className={`px-3 py-1 rounded-md text-sm transition ${
                              props.isDarkMode
                                ? "bg-green-700 text-green-100 hover:bg-green-600"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                            onClick={handleSaveDescription}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          className={`px-3 py-1 rounded-md text-sm transition ${
                            props.isDarkMode
                              ? "bg-blue-700 text-blue-100 hover:bg-blue-600"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          onClick={() => {
                            setIsEditing(true);
                            setEditedDescription(info?.description);
                            setShowPreview(false);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  )}

                  {/* Show either editor or preview */}
                  {isEditing && !showPreview ? (
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className={`w-full h-full min-h-[300px] p-4 rounded-md border-2 font-mono text-sm ${
                        props.isDarkMode
                          ? "bg-gray-800 text-gray-200 border-gray-700"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  ) : (
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      children={
                        isEditing ? editedDescription : info?.description
                      }
                      components={{
                        code(props) {
                          const { children, className, node, ...rest } = props;
                          const match = /language-(\w+)/.exec(className || "");
                          return match ? (
                            <SyntaxHighlighter
                              {...rest}
                              PreTag="div"
                              children={String(children).replace(/\n$/, "")}
                              language={match[1]}
                              style={vscDarkPlus}
                              // ref={null}
                            />
                          ) : (
                            <div
                              {...rest}
                              className={
                                isDarkMode
                                  ? "bg-gray-700 rounded-md px-1 font-mono w-fit inline-block"
                                  : "bg-gray-200 rounded-md px-1 font-mono w-fit inline-block"
                              }
                              // ref={null}
                            >
                              {children}
                            </div>
                          );
                        },
                      }}
                    />
                  )}
                </div>

                <div
                  className={`
      w-full md:w-1/3
      mt-4 md:mt-0
      border-2 rounded-md m-1 
      flex flex-col overflow-hidden
      ${
        props.isDarkMode
          ? "bg-dark-bg-secondary border-white border-opacity-25"
          : "bg-gray-50 border-gray-600 border-opacity-15"
      }
    `}
                >
                  <span
                    className={`mt-0 w-full px-4 py-2 font-light text-xl h-fit text-center border-b-2  ${
                      props.isDarkMode
                        ? "bg-dark-bg-secondary border-white border-opacity-25"
                        : "bg-gray-200 border-gray-400"
                    }`}
                  >
                    Contributors
                  </span>
                  <div className="flex flex-col overflow-auto">
                    {info?.contributors.map((contributorEmailId) => (
                      <Contributor
                        key={contributorEmailId}
                        contributorEmailId={contributorEmailId}
                        isDarkMode={props.isDarkMode}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className=" border-none border-red-500 h-full min-h-full">
              <div
                id="transition-modal-title"
                className="modal-title text-left text-2xl font-extralight transition h-fit border-none border-red-500 pt-4 flex flex-row pl-0"
              >
                <span
                  className={`
                              text-xl md:text-2xl 
                              font-sans w-full md:w-auto 
                              px-3 md:px-5 py-2
                              rounded-md font-normal border-b-2
                              mb-4 md:mb-0
                              text-center md:text-left mx-4
                              ${
                                props.isDarkMode
                                  ? "text-blue-300 bg-blue-900 border-blue-300"
                                  : "text-blue-900 bg-blue-100 border-blue-900"
                              }
                            `}
                >
                  🎯&nbsp; Manage Tasks
                </span>

                <div
                  className={`
  flex flex-row h-fit 
  ml-auto mr-4 mt-0 mb-1
  max-w-[200px] // Added max width
  ${info.maintainers.indexOf(props.userDetail.emailId) === -1 ? "hidden" : ""}
`}
                >
                  <button
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition h-11 ${
                      props.isDarkMode
                        ? "bg-blue-700 text-blue-100 hover:bg-blue-600 active:bg-blue-800"
                        : "bg-blue-400 text-white hover:bg-blue-500 active:bg-blue-600"
                    }`}
                    onClick={() => {
                      setCreateTask(!createTask);
                    }}
                  >
                    <AddTaskIcon className="w-5 h-5" />
                    <span className="hidden md:inline text-sm">
                      Create Task
                    </span>
                  </button>
                </div>
              </div>
              <div className=" h-full mt-0 border-none">
                <div
                  className={
                    createTask
                      ? " w-full mx-auto mt-2 overflow-auto modal-content rounded-lg p-1  "
                      : " w-full mt-2 overflow-hidden modal-content h-0 p-0"
                  }
                >
                  {createTask && (
                    <CreateTask
                      isDarkMode={isDarkMode}
                      userDetail={props.userDetail}
                      users={users}
                      emptyList={emptyList}
                      userSearchTerm={userSearchTerm}
                      setUserSearchTerm={setUserSearchTerm}
                      setFetchAgain={setFetchAgain}
                      value={value}
                      setValue={setValue}
                      onTaskCreated={handleTaskCreated}
                      fetchAgain={fetchAgain}
                      setEmptyList={setEmptyList}
                      setUsers={setUsers}
                      projectName={info?.title}
                      projectId={props.projectPageId}
                      projectMembers={[
                        info.owner,
                        ...info.maintainers,
                        ...info.contributors,
                      ]}
                    />
                  )}
                </div>
                {currentPage && (
                  <>
                    {/* Your existing Manage Task content */}

                    {/* Add the task list */}
                    <div className="task-list mt-6">
                      {projectTasks.map((task) => (
                        <Task
                          key={task.id}
                          fetchID={task.id}
                          isDarkMode={isDarkMode}
                          currentUserEmail={props.userDetail.emailId}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </ModalContent>
        </Fade>
      </Modal>
    </div>
  );
}

interface ModalProps {
  children: React.ReactElement;
  closeAfterTransition?: boolean;
  container?: Element | (() => Element | null) | null;
  disableAutoFocus?: boolean;
  disableEnforceFocus?: boolean;
  disableEscapeKeyDown?: boolean;
  disablePortal?: boolean;
  disableRestoreFocus?: boolean;
  disableScrollLock?: boolean;
  hideBackdrop?: boolean;
  keepMounted?: boolean;
  onClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
  onTransitionEnter?: () => void;
  onTransitionExited?: () => void;
  open: boolean;
}

const Modal = React.forwardRef(function Modal(
  props: ModalProps,
  forwardedRef: React.ForwardedRef<HTMLElement>
) {
  const {
    children,
    closeAfterTransition = false,
    container,
    disableAutoFocus = false,
    disableEnforceFocus = false,
    disableEscapeKeyDown = false,
    disablePortal = false,
    disableRestoreFocus = false,
    disableScrollLock = false,
    hideBackdrop = false,
    keepMounted = false,
    onClose,
    open,
    onTransitionEnter,
    onTransitionExited,
    ...other
  } = props;

  const propsWithDefaults = {
    ...props,
    closeAfterTransition,
    disableAutoFocus,
    disableEnforceFocus,
    disableEscapeKeyDown,
    disablePortal,
    disableRestoreFocus,
    disableScrollLock,
    hideBackdrop,
    keepMounted,
  };

  const {
    getRootProps,
    getBackdropProps,
    getTransitionProps,
    portalRef,
    isTopModal,
    exited,
    hasTransition,
  } = useModal({
    ...propsWithDefaults,
    rootRef: forwardedRef,
  });

  const classes = {
    hidden: !open && exited,
  };

  const childProps: {
    onEnter?: () => void;
    onExited?: () => void;
    tabIndex?: string;
  } = {};
  if (children.props.tabIndex === undefined) {
    childProps.tabIndex = "-1";
  }

  if (hasTransition) {
    const { onEnter, onExited } = getTransitionProps();
    childProps.onEnter = onEnter;
    childProps.onExited = onExited;
  }

  const rootProps = {
    ...other,
    className: clsx(classes),
    ...getRootProps(other),
  };

  const backdropProps = {
    open,
    ...getBackdropProps(),
  };

  if (!keepMounted && !open && (!hasTransition || exited)) {
    return null;
  }

  return (
    <Portal ref={portalRef} container={container} disablePortal={disablePortal}>
      <CustomModalRoot {...rootProps}>
        {!hideBackdrop ? (
          <CustomModalBackdrop isDarkMode={true} {...backdropProps} />
        ) : null}
        <FocusTrap
          disableEnforceFocus={disableEnforceFocus}
          disableAutoFocus={disableAutoFocus}
          disableRestoreFocus={disableRestoreFocus}
          isEnabled={isTopModal}
          open={open}
        >
          {React.cloneElement(children, childProps)}
        </FocusTrap>
      </CustomModalRoot>
    </Portal>
  );
});

const Backdrop = React.forwardRef<HTMLDivElement, { open?: boolean }>(
  (props, ref) => {
    const { open, ...other } = props;
    return (
      <Fade in={open}>
        <div ref={ref} {...other} />
      </Fade>
    );
  }
);

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "95%", // Mobile
    sm: "90%", // Small tablets
    md: "85%", // Tablets
    lg: "80%", // Small desktop
    xl: "75%", // Large desktop
  },
  maxHeight: {
    xs: "95vh", // Mobile
    sm: "90vh", // Tablets
    md: "85vh", // Desktop
    xl: "80vh", // Large screens
  },
  margin: {
    xs: "10px", // Mobile
    sm: "20px", // Tablets
    md: "30px", // Desktop
  },
};

interface ModalContentProps {
  isDarkMode: boolean;
}

const ModalContent = styled("div")<ModalContentProps>(
  ({ theme, isDarkMode }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${isDarkMode
      ? theme.palette.mode === "dark"
        ? grey[900]
        : grey[800]
      : "#fff"};
    border-radius: 8px;
    border: 1px solid
      ${isDarkMode
        ? theme.palette.mode === "dark"
          ? grey[700]
          : grey[600]
        : grey[200]};
    box-shadow: 0 4px 12px
      ${isDarkMode
        ? "rgb(0 0 0 / 0.7)"
        : theme.palette.mode === "dark"
        ? "rgb(0 0 0 / 0.5)"
        : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${isDarkMode
      ? theme.palette.mode === "dark"
        ? grey[50]
        : grey[100]
      : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

interface ModalContentProps {
  isDarkMode: boolean;
}

const CustomModalRoot = styled("div")`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CustomModalBackdropProps {
  isDarkMode: boolean;
}

const CustomModalBackdrop = styled(Backdrop)<ModalContentProps>(
  ({ theme, isDarkMode }) => css`
    z-index: -1;
    position: fixed;
    inset: 0;
    background-color: ${isDarkMode ? "rgb(0 0 0 / 0.7)" : "rgb(0 0 0 / 0.5)"};
    backdrop-filter: blur(1px);
    -webkit-tap-highlight-color: transparent;
  `
);

export default ManageProject;
