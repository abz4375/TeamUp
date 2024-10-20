"use client";
import * as React from "react";
import clsx from "clsx";
import { styled, css } from "@mui/system";
import { Portal } from "@mui/base/Portal";
import { FocusTrap } from "@mui/base/FocusTrap";
import { Button } from "@mui/base/Button";
import { unstable_useModal as useModal } from "@mui/base/unstable_useModal";
import Fade from "@mui/material/Fade";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import DoneIcon from "@mui/icons-material/Done";
import InfoIcon from "@mui/icons-material/Info";
// import logo from "../../assets/logo.png";
// import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import { Avatar, Tooltip } from "@mui/material";

import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import AddTaskIcon from "@mui/icons-material/AddTask";
import PublishIcon from "@mui/icons-material/Publish";
import { Theme } from "@emotion/react";

// import LoadingButton from "@mui/lab/LoadingButton";

const Contributor = (props: any) => {
  const [fetchAgain, setFetchAgain] = React.useState(true);
  const [contributorInfo, setContributorInfo] = React.useState({
    name: "",
    profilePic: "",
  });

  React.useEffect(() => {
    const fetchData = async () => {
      // console.log('fetch again:',fetchAgain,'projectid:',props.projectPageId)
      if (fetchAgain && props.contributorEmailId) {
        // setTimeout(async() => {
        const response = await fetch(
          "http://localhost:3000/api/user-search?t=" + props.contributorEmailId
        );
        if (response.ok) {
          const responseJson = await response.json();

          if (await responseJson[0]) {
            // router.push('/log-in')
            setContributorInfo(await responseJson[0]);
            setFetchAgain(false);
            // console.log(responseJson);
          }
        } else if (response.status === 404) {
          console.error("Fetch failed:", response.statusText);
          // return;
          setFetchAgain(false);
        } else {
          setFetchAgain(true);
        }
        // }, 1000);
      }
    };

    fetchData();
  }, []);
  // console.log(contributorInfo)

  return (
    <Tooltip title={props.contributorEmailId}>
      <div className=" p-2 text-lg font-light bg-white border-2 border-gray-200 mx-1 mt-1 shadow-sm flex flex-row hover:shadow-md transition-all hover:border-gray-300 hover:cursor-pointer">
        <Avatar src={contributorInfo.profilePic} className="my-auto mr-2" />
        <span className="my-auto overflow-x-hidden">
          {contributorInfo.name}
        </span>
      </div>
    </Tooltip>
  );
};

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
  const [projectTitle, setProjectTitle] = React.useState("");
  const [awaitSubmit, setAwaitSubmit] = React.useState(false);

  const [info, setInfo] = React.useState({
    title: "",
    description: "",
    owner: "",
    maintainers: [''],
    contributors: [],
    tasks: [],
    contributions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  React.useEffect(() => {
    const fetchData = async () => {
      // console.log('fetch again:',fetchAgain,'projectid:',props.projectPageId)
      if (fetchAgain && props.projectPageId) {
        // setTimeout(async() => {
        const response = await fetch(
          "http://localhost:3000/api/project?id=" + props.projectPageId
        );
        if (response.ok) {
          const responseJson = await response.json();

          if (await responseJson[0]) {
            // router.push('/log-in')
            setInfo(await responseJson[0]);
            setFetchAgain(false);
            // console.log(responseJson);
          }
        } else if (response.status === 404) {
          console.error("Fetch failed:", response.statusText);
          // return;
          setFetchAgain(false);
        } else {
          setFetchAgain(true);
        }
        // }, 1000);
      }
    };

    fetchData();
  }, []);


  const [open, setOpen] = React.useState(props.toggle || false);
  const [currentPage, setCurrentPage] = React.useState("tasks");
  const [createTask, setCreateTask] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.setProjectToggle(false);
  };
  //   const handleNext = () => {
  //     setCurrentPage((currentPage + 1) % 2);
  //     // console.log("currpage is: ", currentPage);
  //   };

  // const handlePrev = () => {
  //   setCurrentPage(currentPage - 1);
  //   // console.log("currpage is: ", currentPage);
  // };

  const handleSubmit = async () => {
    setAwaitSubmit(true);
    const contributors = Array.from(new Set(value.map((user) => user.emailId)));
    const data = {
      title: projectTitle,
      description: projDescMarkdown,
      owner: props.userDetail.emailId,
      maintainers: [props.userDetail.emailId],
      contributors: contributors,
      tasks: [],
      contributions: [],
    };
    if ((!data.title || data.title === "") && data.contributors.length === 1) {
      setAwaitSubmit(false);
      return;
    }
    const url = "http://localhost:3000/api/create-project";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      //   console.log(response);

      if (response.status === 201) {
        // const responseJson = await response.json();
        // console.log("Signup successful:", responseJson);
        // Handle successful signup (e.g., redirect to login page)
        setAwaitSubmit(false);
        props.setRefreshHomePage(true);
        handleClose();
      } else {
        console.error("Project Creation failed:", response.statusText);
        setAwaitSubmit(false);
        // Handle signup errors (e.g., display error message)
      }
    } catch (error) {
      setAwaitSubmit(false);
      console.error("Error creating Project:", error);
      // Handle network or other errors
    }
  };

  // const fixedOptions = [top100Films[6]];
  const fixedOptionsTemp: any = [];
  // const [value, setValue] = React.useState([...fixedOptions, top100Films[13]]);
  // const [value, setValue] = React.useState([...fixedOptions]);
  const [value, setValue] = React.useState([
    {
      name: props.userDetail.name,
      emailId: props.userDetail.emailId,
      profilePic: props.userDetail.profilePic,
    },
  ]);
  // const [value, setValue] = React.useState([...fixedOptionsTemp, {
  //   name: props.userDetail.name,
  //   emailId: props.userDetail.emailId,
  //   profilePic: props.userDetail.profilePic
  // }]);

  const [projDescMarkdown, setProjDescMarkdown] = React.useState(
    "* [ ] Write Description in 📝 `Markdown`!"
  );


  const [toShowMarkdownPreview, setToShowMarkdownPreview] =
    React.useState(false);

  const placeholderDesc = `Write Description in Markdown !`;
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
            className={`w-4/5 h-4/5 overflow-auto overflow-x-hidden ${
              props.isDarkMode ? "bg-dark-bg text-dark-text" : "bg-white text-black"
            }`}
            isDarkMode = {props.isDarkMode}
            // theme = {"dark"}
          >
            <div
              id="transition-modal-title"
              className={`modal-title text-left text-3xl font-extralight transition h-fit border-none pt-0 flex flex-row ${
                props.isDarkMode ? "text-dark-text" : "text-black"
              }`}
            >
              <span className="my-auto font-semibold">{info?.title}</span>
              <button
                className={
                  " ml-4 text-lg w-fit h-full p-1 border-2 rounded-md flex flex-row my-auto hover:border-blue-500 hover:bg-blue-50 transition-all" +
                  (currentPage === "info" ? " bg-blue-50 border-blue-500" : "")
                }
                onClick={() => {
                  if (currentPage !== "info") setCurrentPage("info");
                  else setCurrentPage("tasks");
                }}
              >
                <InfoIcon className=" h-full" style={{ color: blue[500] }} />
                <span className="my-auto m-2 text-blue-500"> Info </span>
              </button>
            </div>
            <div
              className={
                currentPage === "info"
                  ? `border-none w-full mx-auto mt-0 overflow-auto modal-content h-full rounded-lg p-1 ${
                      props.isDarkMode ? "bg-dark-bg-secondary" : "bg-gray-200 bg-opacity-30"
                    } min-h-96`
                  : `border-t-2 border-gray-500 w-full mt-0 overflow-hidden modal-content h-0 p-0`
              }
            >
              <div
                className={
                  "w-full h-full flex flex-row " +
                  (currentPage === "info" ? "" : " hidden")
                }
              >
                <div className=" w-2/3 border-2 border-blue-500 border-opacity-10 rounded-md m-1  bg-white p-4 text-lg flex flex-col overflow-auto">
                  <Markdown
                    // className={' pt-2' + (toShowMarkdownPreview)?'':' hidden'}
                    className={`text-lg border-none ${
                      props.isDarkMode ? "text-dark-text" : "text-black"
                    }`}
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
                            style={vs}
                            ref={null}
                          />
                        ) : (
                          <div
                            {...rest}
                            className={
                              className +
                              " bg-gray-200 rounded-md px-1 font-mono w-fit inline-block"
                            }
                            ref={null}
                          >
                            {children}
                          </div>
                        );
                      },
                    }}
                  />
                </div>
                <div className={`w-1/3 border-2 rounded-md m-1 flex flex-col overflow-hidden border-opacity-15 ${
              props.isDarkMode ? "bg-dark-bg-secondary border-dark-border" : "bg-gray-50 border-gray-600"
            }`}>
                  <span className="mt-0 w-full px-4 py-2 font-light text-xl h-fit text-center bg-gray-200 border-b-2 border-gray-400">
                    Contributors
                  </span>
                  <div className="flex flex-col overflow-auto">
                    {info?.contributors.map((contributorEmailId) => (
                      <Contributor contributorEmailId={contributorEmailId} />
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
                <span className="my-auto font-sans text-blue-900 ml-4 w-fit bg-blue-100 px-5 py-2 rounded-md font-normal border-b-2 border-blue-900">
                  {" "}
                  🎯&nbsp; Manage Tasks
                </span>
                <div
                  className={
                    "flex flex-row h-fit w-fit ml-auto mr-4 mt-0 mb-1 border-none bg-gray-50 p-2 rounded-lg pl-0 pr-4 shadow-sm" +
                    (info.maintainers.indexOf(props.userDetail.emailId) === -1
                      ? " hidden"
                      : "")
                  }
                >
                  <button
                    className=" hover:bg-blue-500 ml-4 mr-2 w-fit h-fit bg-blue-400 px-2 py-2 text-white rounded-full  active:bg-blue-600 transition flex flex-row my-auto"
                    onClick={() => {
                      if (!createTask) setCreateTask(true);
                      else setCreateTask(false);
                    }}
                  >
                    <AddTaskIcon className=" w-5 h-5" />
                  </button>
                  <div className=" border-none h-fit  my-auto text-lg font-normal text-blue-500 font-sans">
                    Create Task
                  </div>
                </div>
              </div>
              <div className=" h-full mt-0 border-none">
                <div
                  className={
                    createTask
                      ? " w-full mx-auto mt-2 overflow-auto modal-content rounded-lg p-1 bg-gray-100 "
                      : " w-full mt-2 overflow-hidden modal-content h-0 p-0"
                  }
                  //   style={{height:'75vh'}}
                >
                  <div
                    className={
                      "w-full h-fit flex flex-row shadow-sm" +
                      (createTask ? "" : " hidden")
                    }
                  >
                    <div className=" w-2/3 m-1">
                      <textarea
                        className=" w-full border-2 border-blue-900 border-opacity-10 rounded-md  bg-white p-4 text-2xl flex flex-col overflow-auto resize-none h-60"
                        placeholder="Task Description..."
                      >
                        
                      </textarea>
                      <form
                        action={() => {}}
                        className=" mx-auto grid w-full h-20 mt-3"
                      >
                        <div className="mx-auto flex flex-row text-lg w-full h-full border-none rounded-md bg-white">
                          <Autocomplete
                            className=" ml-2 mr-auto my-auto"
                            sx={{width:'80vw'}}
                            multiple
                            id="fixed-tags-demo"
                            value={value}
                            onChange={(event, newValue) => {
                              setValue([
                                {
                                  name: props.userDetail.name,
                                  emailId: props.userDetail.emailId,
                                  profilePic: props.userDetail.profilePic,
                                },
                                ...newValue.filter(
                                  (option) =>
                                    option.emailId !== props.userDetail.emailId
                                  // (option) => value.filter((member)=>member.emailId !== option.emailId)
                                ),
                              ]);
                              setUserSearchTerm(userSearchTerm);
                            }}
                            // options={top100Films}
                            options={users}
                            // getOptionLabel={(option) => option.year}
                            getOptionLabel={(option) => {
                              // return "<div>"+option.title+"<br/>"+option.year+"</div>"
                              // return option.title + ` ( ` + option.year + ` )`
                              return option.emailId ?? "";
                            }}
                            renderOption={(props, option) =>
                              option.emailId ? (
                                <li
                                  {...props}
                                  className=" hover:bg-gray-100 m-2 p-1 rounded-lg transition flex flex-row cursor-pointer"
                                >
                                  <Avatar
                                    src={option.profilePic ?? ""}
                                    className="mr-3"
                                  />
                                  <div className=" flex flex-col">
                                    <span>{option.name ?? ""}</span>
                                    <span
                                      style={{ fontSize: "smaller" }}
                                      className=" text-gray-500"
                                    >
                                      {option.emailId ?? ""}
                                    </span>
                                  </div>
                                </li>
                              ) : (
                                <div className="text-center text-gray-400">
                                  search...
                                </div>
                              )
                            }
                            renderTags={(tagValue, getTagProps) =>
                              tagValue.map((option, index) => (
                                <Tooltip title={option.emailId}>
                                  <Chip
                                    label={option.name}
                                    avatar={<Avatar src={option.profilePic} />}
                                    {...getTagProps({ index })}
                                    disabled={
                                      option.emailId ===
                                      props.userDetail.emailId
                                    }
                                    className="m-1 transition-all"
                                    // disabled={fixedOptionsTemp.indexOf(option) !== -1}
                                  />
                                </Tooltip>
                              ))
                            }
                            style={{ width: 600 }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Assign To"
                                placeholder={
                                  value.length === 1 ? "Search by e-mail" : ""
                                }
                                onChange={(e) => {
                                  setUserSearchTerm(e.target.value);
                                  setFetchAgain(true);
                                }}
                                value={userSearchTerm}
                                // onChange={(e)=>set}
                              />
                            )}
                            noOptionsText={emptyList}
                          />
                        </div>
                      </form>
                    </div>

                    <div className=" flex flex-col w-1/3">
                      <div className=" border-2 border-gray-600 rounded-md m-1 bg-white flex flex-col overflow-hidden border-opacity-15 h-60">
                        <span className="mt-0 w-full px-4 py-2 font-light text-xl h-fit text-center bg-white border-b-2 border-gray-400">
                          📎 - Add Documents
                        </span>
                        <div className="flex flex-col overflow-auto py-2 ">
                          <div className="flex flex-row h-fit w-full overflow-hidden ml-0 mr-auto mt-0 border-none bg-gray-50 p-1 rounded-lg pl-0 pr-4">
                            <button
                              className=" hover:bg-gray-500 ml-auto mr-2 bg-gray-400 text-white rounded-full  active:bg-gray-600 transition flex flex-row my-auto p-1"
                            >
                              <PublishIcon className="w-6 h-6 mx-auto my-auto" />
                              <input
                                type="file"
                                className=" opacity-0 absolute cursor-pointer"
                                onChange={(event) => {
                                  const selectedFile = event.target.files
                                    ? event.target.files[0]
                                    : null;
                                    
                                  console.log(selectedFile?.name);
                                }}
                              ></input>
                            </button>
                            <div className=" border-none h-fit  my-auto text-lg font-normal font-sans ml-0 mr-auto">
                              Upload
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="h-20 m-2 border-green-500 border-2 rounded-lg bg-green-100  text-lg font-semibold active:bg-green-200 transition-all">
                        💾 Save
                      </button>
                    </div>
                  </div>
                </div>
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

  // It's a Transition like component
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
        {!hideBackdrop ? <CustomModalBackdrop isDarkMode={true} {...backdropProps} /> : null}
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
  width: 400,
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
    background-color: ${isDarkMode ? theme.palette.mode === "dark" ? grey[900] : grey[800] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${isDarkMode ? theme.palette.mode === "dark" ? grey[700] : grey[600] : grey[200]};
    box-shadow: 0 4px 12px
      ${isDarkMode ? "rgb(0 0 0 / 0.7)" : theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${isDarkMode ? theme.palette.mode === "dark" ? grey[50] : grey[100] : grey[900]};

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
`);

const TriggerButton = styled(Button)(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? blue[300] : blue[200]};
      outline: none;
    }
  `
);

export default ManageProject;
