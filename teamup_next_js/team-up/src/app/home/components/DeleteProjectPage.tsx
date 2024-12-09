"use client";
import * as React from "react";
import clsx from "clsx";
import { styled, css } from "@mui/system";
import { Portal } from "@mui/base/Portal";
import { FocusTrap } from "@mui/base/FocusTrap";
import { Button } from "@mui/base/Button";
import { unstable_useModal as useModal } from "@mui/base/unstable_useModal";
import Fade from "@mui/material/Fade";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DoneIcon from "@mui/icons-material/Done";
import InfoIcon from "@mui/icons-material/Info";
import logo from "../../assets/logo.png";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tooltip,
} from "@mui/material";
import "./DeleteProjectPage.css";

import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import LoadingButton from "@mui/lab/LoadingButton";
import { red } from "@mui/material/colors";

const Project = (props: any) => {
  const userEmail = props.userDetail.emailId;
  const [info, setInfo] = React.useState({
    title: "",
    owner: "",
    createdAt: "",
  });
  const [fetchAgain, setFetchAgain] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  // if (checked) alert('checked'); else alert('unchecked');

  const handleClick = () => {
    // console.log("now turned to ", !checked);

    if (!checked && props.type === "ownedByYou") {
      setChecked(!checked);
      props.func.addToDelete(props.projectId);
    } else if (!checked && props.type === "ownedByOthers") {
      setChecked(!checked);
      props.func.addToLeave(props.projectId);
    } else if (checked && props.type === "ownedByYou") {
      setChecked(!checked);
      props.func.dontDelete(props.projectId);
    } else if (checked && props.type === "ownedByOthers") {
      setChecked(!checked);
      props.func.dontLeave(props.projectId);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      // console.log('fetch again:',fetchAgain,'projectid:',props.projectId)
      if (fetchAgain && props.projectId) {
        // setTimeout(async() => {
        const baseURL = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";
        const response = await fetch(
          `/api/project/` + props.projectId + "/delete"
        );
        if (response.ok) {
          const responseJson = await response.json();

          if (await responseJson) {
            // router.push('/log-in')
            setInfo(await responseJson.data);
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
  }, [fetchAgain, props.projectId]);

  if (info.owner !== "") {
    // fetching complete
    if (props.type === "ownedByYou") {
      if (userEmail === info.owner) {
        return (
          <div className={`transition-all w-full border-2 p-2 mt-1 shadow-sm hover:shadow-md rounded-md
      ${props.isDarkMode ? 'border-red-400 bg-dark-secondary' : 'border-red-100 bg-white'}`}>
      <label className="flex items-center w-full cursor-pointer">
        <div className="relative flex items-center mr-3">
          <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={handleClick}
          />
          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors
            ${checked 
              ? (props.isDarkMode ? 'border-red-400 bg-red-400' : 'border-red-700 bg-red-700')
              : (props.isDarkMode ? 'border-red-400' : 'border-red-700')
            }`}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between w-full text-sm md:text-base">
          <div className={`truncate flex-1 mr-2
            ${props.isDarkMode ? 'text-dark-text' : 'text-teamuptext'}`}>
            {info.title}
          </div>
          <div className={`whitespace-nowrap flex-shrink-0
            ${props.isDarkMode ? 'text-dark-text' : 'text-teamuptext'}`}>
            {info.createdAt}
          </div>
        </div>
      </label>
    </div>
        );
      
      } else return <></>;
    } else {
      if (userEmail !== info.owner) {
        return (
          <div className={`transition-all w-full border-2 p-2 mt-1 shadow-sm hover:shadow-md rounded-md
      ${props.isDarkMode ? 'border-red-400 bg-dark-secondary' : 'border-red-100 bg-white'}`}>
      <label className="flex items-center w-full cursor-pointer">
        <div className="relative flex items-center mr-3">
          <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={handleClick}
          />
          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors
            ${checked 
              ? (props.isDarkMode ? 'border-red-400 bg-red-400' : 'border-red-700 bg-red-700')
              : (props.isDarkMode ? 'border-red-400' : 'border-red-700')
            }`}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between w-full text-sm md:text-base">
          <div className={`truncate flex-1 mr-2
            ${props.isDarkMode ? 'text-dark-text' : 'text-teamuptext'}`}>
            {info.title}
          </div>
          <div className={`whitespace-nowrap flex-shrink-0
            ${props.isDarkMode ? 'text-dark-text' : 'text-teamuptext'}`}>
            {info.createdAt}
          </div>
        </div>
      </label>
    </div>
        );
      
      } else return <></>;
    }
    // return (
    //   <div className=" transition-all w-full border-2 border-red-100 h-fit p-0 px-2 mt-1 bg-white shadow-sm hover:shadow-md rounded-md">
    //     <FormControlLabel
    //       className="w-full border-none border-black"
    //       style={{ width: "40rem" }}
    //       // disabled
    //       control={
    //         <Checkbox
    //           onClick={handleClick}
    //           checked={checked}
    //           style={{ color: "darkred" }}
    //         />
    //       }
    //       label={
    //         <div
    //           className="flex flex-row border-red-500 border-none w-full"
    //           style={{ width: "41vw" }}
    //         >
    //           <div className="w-1/2 border-none border-black overflow-x-hidden">
    //             {info.title}
    //           </div>
    //           <div className="w-1/2 text-right overflow-x-hidden">
    //             {info.createdAt}
    //           </div>
    //         </div>
    //       }
    //     />
    //   </div>
    // );
  }

  return <></>;
};

// const Contributor = (props: any) => {
//   const [fetchAgain, setFetchAgain] = React.useState(true);
//   const [contributorInfo, setContributorInfo] = React.useState({
//     name: "",
//     profilePic: "",
//   });

//   React.useEffect(() => {
//     const fetchData = async () => {
//       // console.log('fetch again:',fetchAgain,'projectid:',props.projectPageId)
//       if (fetchAgain && props.contributorEmailId) {
//         // setTimeout(async() => {
//         const response = await fetch(
//           "http://localhost:3000/api/user-search?t=" + props.contributorEmailId
//         );
//         if (response.ok) {
//           const responseJson = await response.json();

//           if (await responseJson[0]) {
//             // router.push('/log-in')
//             setContributorInfo(await responseJson[0]);
//             setFetchAgain(false);
//             // console.log(responseJson);
//           }
//         } else if (response.status === 404) {
//           console.error("Fetch failed:", response.statusText);
//           // return;
//           setFetchAgain(false);
//         } else {
//           setFetchAgain(true);
//         }
//         // }, 1000);
//       }
//     };

//     fetchData();
//   }, []);
//   // console.log(contributorInfo)

//   return (
//     <div className=" p-2 text-lg font-light bg-white border-2 border-gray-200 mx-1 mt-1 rounded-md shadow-sm flex flex-row ">
//       <Avatar src={contributorInfo.profilePic} className="my-auto mr-2" />
//       <span className="my-auto">{contributorInfo.name}</span>
//     </div>
//   );
// };
function DeleteProjectPage(props: any) {
  const [userSearchTerm, setUserSearchTerm] = React.useState("");
  const [users, setUsers] = React.useState<any>([{ empty: true }]);
  const [emptyList, setEmptyList] = React.useState("");
  const [fetchAgain, setFetchAgain] = React.useState(props.projectToggle);
  const [projectTitle, setProjectTitle] = React.useState("");
  const [awaitSubmit, setAwaitSubmit] = React.useState(false);
  const isDarkMode = props.isDarkMode;

  const [info, setInfo] = React.useState({
    title: "",
    description: "",
    owner: "",
    maintainers: [],
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
        const baseURL = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";
        const response = await fetch(`/api/project/` + props.projectPageId);
        if (response.ok) {
          const responseJson = await response.json();

          if (await responseJson) {
            // router.push('/log-in')
            setInfo(await responseJson);
            setFetchAgain(false);
            // console.log(responseJson);
          }
        } else if (response.status === 404) {
          console.error("Fetch failed:", response.statusText);
          // return;
          setInfo({
            title: "",
            description: "",
            owner: "",
            maintainers: [],
            contributors: [],
            tasks: [],
            contributions: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          setFetchAgain(false);
        } else {
          setFetchAgain(true);
        }
        // }, 1000);
      }
    };

    fetchData();
  }, [fetchAgain, props.projectPageId]);

  //   React.useEffect(() => {
  //     const fetchData = async () => {
  //       if (fetchAgain && userSearchTerm!=='') {
  //         setTimeout(async () => {
  //           const response = await fetch(
  //             "http://localhost:3000/api/user-search?t=" + userSearchTerm
  //           );
  //           if (response.ok) {
  //             const responseJson = await response.json();
  //             setUsers(await responseJson);
  //             setFetchAgain(false);
  //           } else if (response.status === 404) {
  //             // console.error("Fetch failed:", response.statusText);
  //             setEmptyList("No users found");
  //             setFetchAgain(false);
  //           } else {
  //             setEmptyList("🔎 Searching...");
  //             setFetchAgain(true);
  //           }
  //         }, 300);
  //       }
  //     };

  //     fetchData(); // Call the function to fetch data on component mount
  //   });

  // const users = [
  //   {
  //     name: "Ayush Sonkar",
  //     emailId: "theayushsonkar@gmail.com",
  //     profilePic:
  //       "data:image/jpeg;base64,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",
  //   },
  //   {
  //     name: "Aman Sharma",
  //     emailId: "amansharma@gmail.com",
  //     profilePic:
  //       "data:image/jpeg;base64,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",
  //   },
  //   {
  //     name: "Vaibhav Gupta",
  //     emailId: "vaibhavgupta@gmail.com",
  //     profilePic:
  //       "data:image/jpeg;base64,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",
  //   },
  // ];

  const [open, setOpen] = React.useState(props.toggle || false);
  const [currentPage, setCurrentPage] = React.useState("tasks");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.setDeleteProjectPage(false);
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
    const baseURL = process.env.VERCEL_URL;
    const url = `/api/create-project`;
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

  const fixedOptions = [top100Films[6]];
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
  const handleMarkdownPreview = (e: any) => {
    setProjDescMarkdown(e.target.value);
  };

  const [toShowMarkdownPreview, setToShowMarkdownPreview] =
    React.useState(false);

  const placeholderDesc = `Write Description in Markdown !`;

  const [toDelete, setToDelete] = React.useState<any>([]);
  const [toLeave, setToLeave] = React.useState<any>([]);
  const addToDelete = (projectId: any) => {
    setToDelete([...toDelete, projectId]);
    // console.log('you just clicked addtodelete, array: ',[...toDelete, projectId])
  };

  const dontDelete = (projectId: any) => {
    setToDelete(toDelete.filter((item: any) => item !== projectId));
    // console.log('you just clicked dontdelete, array: ',toDelete.filter((item: any) => item !== projectId))
  };

  const addToLeave = (projectId: any) => {
    setToLeave([...toLeave, projectId]);
    // console.log('you just clicked addtoleave, array: ',[...toLeave, projectId])
  };

  const dontLeave = (projectId: any) => {
    setToLeave(toLeave.filter((item: any) => item !== projectId));
    // console.log('you just clicked dontleave, array: ',toLeave.filter((item: any) => item !== projectId))
  };

  const onDelete = async () => {
    if (!toDelete.length) return;
    console.log("projects to delete: ", toDelete);

    setAwaitSubmit(true); // Show loading state

    try {
      const baseURL = process.env.VERCEL_URL;
      const response = await fetch(`/api/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toDelete: toDelete,
          toLeave: null,
          userEmail: props.userDetail.emailId,
        }),
      });

      if (response.status === 200) {
        // Update local state
        const updatedProjects = props.userDetail.projects.filter(
          (projectId: any) => !toDelete.includes(projectId)
        );
        props.setUserDetail({
          ...props.userDetail,
          projects: updatedProjects,
        });

        // Clear the toDelete array
        setToDelete([]);

        // Trigger refresh of home page
        props.setRefreshHomePage(true);

        // Show success message
        alert("Projects deleted successfully");
      } else {
        console.error("Project Deletion failed:", response.statusText);
        alert("Failed to delete projects. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting Project:", error);
      // alert("An error occurred while deleting projects. Please try again.");
    } finally {
      setAwaitSubmit(false); // Hide loading state
    }
  };

  const onLeave = async () => {
    if (!toLeave.length) return;
    console.log("projects to leave: ", toLeave);
    const baseURL = process.env.VERCEL_URL;
    const url = `/api/project`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toLeave: toLeave,
          toDelete: null,
          userEmail: props.userDetail.emailId,
        }),
      });
      //   console.log(response);

      if (response.status === 200) {
        // const responseJson = await response.json();
        // console.log("Signup successful:", responseJson);
        // Handle successful signup (e.g., redirect to login page)
        // setFetchAgain(true);
        props.setRefreshHomePage(true);
        // handleClose();
      } else {
        console.error("Project Deletion failed:", response.statusText);
        // setAwaitSubmit(false);
        // Handle signup errors (e.g., display error message)
      }
    } catch (error) {
      // setAwaitSubmit(false);
      console.error("Error deleting Project:", error);
      // Handle network or other errors
    }
  };

  return (
    <div>
      {/* <TriggerButton onClick={handleOpen}>Open modal</TriggerButton> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <ModalContent
            sx={{
              width: {
                xs: "95%",
                sm: "80%",
                md: "70%",
                lg: "50%",
              },
              maxHeight: {
                xs: "90vh",
                sm: "85vh",
                md: "80vh",
              },
              overflow: "auto",
            }}
            className={`${
              isDarkMode
                ? "bg-dark-bg text-dark-text"
                : "bg-white text-teamuptext"
            }`}
          >
            <div
              id="transition-modal-title"
              className="modal-title text-left text-2xl md:text-3xl font-semibold flex flex-row items-center gap-2 p-2"
            >
              {/* {currentPage == 0 ? "New Project" : ""}
              {currentPage == 1 ? "Create Team" : ""} */}
              {/* <div className="my-auto font-semibold h-full flex flex-row border-2 border-red-500"> */}
              <DeleteForeverIcon
                className="h-6 w-6 md:h-8 md:w-8"
                style={{ color: "red" }}
              />
              <div className="my-auto">Delete</div>
              <ExitToAppIcon
                className="h-6 w-6 md:h-8 md:w-8 ml-2"
                style={{ color: "red" }}
              />
              <div className="my-auto">Leave Projects</div>
              {/* </div> */}
              {/* <button
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
              </button> */}
            </div>
            {/* <span id="transition-modal-description" className="modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </span> */}
            <div
              className={`transition-all border-2 border-red-500 border-opacity-10 w-full mx-auto overflow-auto rounded-lg p-2
            ${isDarkMode ? "bg-dark-secondary" : "bg-red-500 bg-opacity-5"}`}
            >
              <div className="flex flex-col h-full">
                {/* Owned Projects Section */}
                <div className="mb-4">
                  <div
                    className={`w-full px-2 flex flex-row justify-between text-sm md:text-base
                  border-b-2 border-red-700 border-opacity-30 
                  ${isDarkMode ? "text-red-400" : "text-red-700"}`}
                  >
                    <div className="p-1 font-bold">Owned by You</div>
                    <div className="p-1 font-bold">Created at</div>
                  </div>

                  <div className="max-h-[30vh] overflow-y-auto">
                    {props.userDetail.projects.map(
                      (projectId: any, index: any) => (
                        <Project
                          key={index}
                          {...props}
                          type="ownedByYou"
                          projectId={projectId}
                          func={{
                            addToDelete,
                            dontDelete,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 my-2">
                <button
                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1
                    ${isDarkMode ? 'border-red-400 text-red-400' : 'border-red-700 text-red-700'}
                    hover:opacity-80`}
                  onClick={onDelete}
                >
                  <DeleteForeverIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
              <div className={`w-full px-2 flex flex-row justify-between text-sm md:text-base
    border-b-2 border-red-700 border-opacity-30 
    ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
    <div className="p-1 font-bold">Owned by Others</div>
    <div className="p-1 font-bold">Created at</div>
  </div>
                <div className="max-h-[30vh] overflow-y-auto">
    {props.userDetail.projects.map((projectId: any, index: any) => (
      <Project
        key={index}
        {...props}
        type="ownedByOthers"
        projectId={projectId}
        func={{
          addToLeave,
          dontLeave
        }}
      />
    ))}
  </div>
{/* </div> */}
<div className="flex justify-end gap-2 my-2">
  <button
    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1
      ${isDarkMode ? 'border-red-400 text-red-400' : 'border-red-700 text-red-700'}
      hover:opacity-80`}
    onClick={onLeave}
  >
    <ExitToAppIcon className="h-4 w-4" />
    <span className="hidden sm:inline">Leave</span>
  </button>
</div>
              </div>
              {/* <form action={() => {}} className=" mx-auto my-2 grid w-full">
                <div className="mx-auto my-2 flex flex-row text-lg w-full">
                  <span className="my-auto text-right mr-4 w-1/4">
                    Project Title:{" "}
                  </span>
                  <input
                    type="text"
                    name="projectTitle"
                    placeholder="Project Title"
                    className="my-auto w-3/4 border-gray-300 border-2 px-4 py-2 rounded-md focus:outline-blue-300 transition"
                    onChange={(e)=>setProjectTitle(e.target.value)}
                  />
                </div>
                <div className="mx-auto my-2 flex flex-row text-lg w-full">
                  <div className="my-0 mr-4 w-1/4 border-none border-red-500">
                    <div className="text-right">Project Description: </div>
                    <button
                      className={
                        !toShowMarkdownPreview
                          ? " ml-auto mr-0 mt-3 w-full border-2 border-dashed border-blue-200 px-4 py-2 text-blue-500 rounded-md hover:border-blue-300 active:border-blue-200 transition flex flex-row font-mono text-base font-normal"
                          : " ml-auto mr-0 mt-3 w-full px-4 py-2 text-white bg-blue-500 border-2 border-blue-500 rounded-md hover:opacity-90 transition flex flex-row font-mono text-base font-normal"
                      }
                      onClick={() => {
                        setToShowMarkdownPreview(!toShowMarkdownPreview);
                      }}
                    >
                      <WysiwygIcon className=" border-none border-red-500 my-auto h-full mr-2" />
                      Markdown Preview
                    </button>
                  </div>
                  <div className="my-auto w-3/4 flex flex-col">
                    <textarea
                      name="projectDesc"
                      placeholder={placeholderDesc}
                      rows={9}
                      className=" border-gray-300 border-2 px-4 py-2 rounded-md focus:outline-blue-300 active:outline-blue-300 transition resize-y font-mono text-sm"
                      onChange={(e) => handleMarkdownPreview(e)}
                      value={projDescMarkdown}
                    />

                    <div
                      className={
                        " bg-amber-20 bg-opacity-40 p-2 border-2 border-gray-200 rounded-md mt-2" +
                        (toShowMarkdownPreview === true ? "" : " hidden")
                      }
                    >
                      <div className="font-mono font-bold text-blue-500 bg-blue-50 bg-opacity-50 w-full p-1">
                        <WysiwygIcon className="my-auto mr-2" />
                        Preview:
                      </div>

                      <Markdown
                        // className={' pt-2' + (toShowMarkdownPreview)?'':' hidden'}
                        className=" text-md mt-4"
                        remarkPlugins={[remarkGfm]}
                        children={projDescMarkdown}
                        components={{
                          code(props) {
                            const { children, className, node, ...rest } =
                              props;
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return match ? (
                              <SyntaxHighlighter
                                {...rest}
                                PreTag="div"
                                children={String(children).replace(/\n$/, "")}
                                language={match[1]}
                                // style={dark}
                              />
                            ) : (
                              <div
                                {...rest}
                                className={
                                  className +
                                  " bg-gray-200 rounded-md px-1 font-mono w-fit inline-block"
                                }
                              >
                                {children}
                              </div>
                            );
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </form> */}
            </div>
            {/* <div
              className={
                " border-none border-red-500 w-11/12 mx-auto mt-3 modal-content h-full overflow-visible" +
                (currentPage !== 1 ? " hidden" : "")
              }
            >
              <form action={() => {}} className=" mx-auto my-2 grid w-full h-full ">
                <div className="mx-auto my-2 flex flex-row text-lg w-full h-full">
                  <Autocomplete
                    className=" mx-auto"
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
                      return option.emailId??'';
                    }}
                    renderOption={(props, option) =>
                      !option.empty ? (
                        <li
                          {...props}
                          className=" hover:bg-gray-100 m-2 p-1 rounded-lg transition flex flex-row cursor-pointer"
                        >
                          <Avatar src={option.profilePic??''} className="mr-3" />
                          <div className=" flex flex-col">
                            <span>{option.name??''}</span>
                            <span
                              style={{ fontSize: "smaller" }}
                              className=" text-gray-500"
                            >
                              {option.emailId??''}
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
                          disabled={option.emailId === props.userDetail.emailId}
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
                        label="Search People"
                        placeholder={value.length === 1 ? "Enter e-mail" : ""}
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
              <div className=" transition-all border-2 border-gray-200 rounded-full w-fit mx-auto mb-16 mt-auto h-fit hover:border-gray-300">
                {value.map((member,index)=>{
                  return( <Tooltip title={member.emailId}><Chip label={member.name}
                    avatar={<Avatar src={member.profilePic} />}
                    id={index}
                    className="m-2 text-lg bg-green-100 h-10 transition-all p-1 rounded-full cursor-pointer opacity-55 hover:opacity-75 hover:bg-green-100"/></Tooltip>);
                })}
              </div>
              </form>
            </div>
             */}
            {/* <div className=" flex flex-row w-full mt-auto mb-0">
              <Tooltip
                className=" border-2 border-transpatent"
                title={currentPage == 1 ? "Edit Project" : ""}
              >
                {currentPage !== 0 ? (
                  <button
                    className=" mr-auto ml-7 mt-auto mb-0 w-fit border-blue-400 px-4 py-2 text-blue-400 rounded-md  active:border-blue-200 transition flex flex-row"
                    onClick={handlePrev}
                    style={{ marginTop: "2px" }}
                  >
                    <ChevronLeftIcon className=" border-none border-red-500 my-auto h-full" />
                    Back
                  </button>
                ) : (
                  <div className="hidden"></div>
                )}
              </Tooltip>
              <Tooltip
                title={currentPage == 0 ? "Select Team Members" : "Submit"}
              >
                {currentPage !== 1 ? (
                  <button
                    className=" ml-auto mr-7 mt-auto mb-0 w-fit bg-blue-500 px-4 py-2 text-white rounded-md  active:bg-blue-600 transition flex flex-row"
                    // onClick={handleNext}
                  >
                    Next
                    <ChevronRightIcon className=" border-none border-red-500 my-auto h-full" />
                  </button>
                ) : (
                  // <button
                  //   className=" ml-auto mr-7 mt-auto mb-0 w-fit bg-green-600 px-4 py-2 text-white rounded-md  active:bg-green-700 transition flex flex-row "
                  //   onClick={handleSubmit}
                  // >
                  //   <DoneIcon
                  //     className="my-auto h-4/5 mr-1"
                  //     style={{ marginLeft: "-0.5rem" }}
                  //   />
                  //   Submit
                  // </button>
                  <LoadingButton
                    className=" ml-auto mr-7 mt-auto mb-0 w-fit bg-green-600 px-4 py-2 text-white rounded-md  active:bg-green-700 transition hover:bg-green-600"
                    loading={awaitSubmit}
                    loadingPosition="start"
                    startIcon={<DoneIcon />}
                    onClick={handleSubmit}
                    // variant="outlined"
                  >
                    Submit
                  </LoadingButton>
                )}
              </Tooltip>
            </div> */}
          </ModalContent>
        </Fade>
      </Modal>
    </div>
  );
}

// const users = [
//   { title:"Ayush Srivastava", year:2003 },
//   { title:"Aman Sharma", year:2004 },
//   { title:"Vaibhav Gupta", year:2001 },
// ];

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  {
    title:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  {
    title: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];

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
      {/*
       * Marking an element with the role presentation indicates to assistive technology
       * that this element should be ignored; it exists to support the web application and
       * is not meant for humans to interact with directly.
       * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
       */}
      <CustomModalRoot {...rootProps}>
        {!hideBackdrop ? <CustomModalBackdrop {...backdropProps} /> : null}
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
Modal.displayName = "Modal";

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
Backdrop.displayName = "Backdrop";

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

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

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

    @media (max-width: 768px) {
      width: 90vw !important;
      padding: 16px;
      margin: 10px;
    }

    @media (max-width: 480px) {
      padding: 12px;
    }
  `
);

const CustomModalRoot = styled("div")`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomModalBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(1px);
  -webkit-tap-highlight-color: transparent;
`;

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

export default DeleteProjectPage;
