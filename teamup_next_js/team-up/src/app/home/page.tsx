// "use client";
// import React, { useEffect, useState } from "react";
// import Sidebar from "./components/Sidebar";
// import Profile from "./components/Profile";
// import ProjectPane from "./components/ProjectPane";
// import TaskPane from "./components/TaskPane";
// import "./home.css";
// import { UserInfo } from "./components/UserInfo";
// import { useRouter } from "next/navigation";
// import { auth } from "../../../auth";
// import CreateTeamPage from "./components/CreateTeamPage";
// import logo from "../assets/logo.png";
// import Reloader from "./components/reloader";
// import ManageProject from "./components/ManageProject";
// import DeleteProjectPage from "./components/DeleteProjectPage";
// // import { connectDB } from "../../../db.js";

// const Home = () => {
// const [userInfo, setUserInfo] = useState({
//   name: "",
//   emailId: "",
//   profilePic: "",
//   projects: [],
//   tasks: [],
//   contributions: [],
//   updatedAt: new Date(),
//   createdAt: new Date(),
// });
// const [createTeamToggle, setCreateTeamToggle] = React.useState(false);
// const [refreshHomePage, setRefreshHomePage] = React.useState<any>(true);

// const funcToPass = (value: any) => {
//   setCreateTeamToggle(value);
// };

// // useEffect(() => {
// //   if(refreshHomePage) {clearTimeout;console.log('aborted');return;}
// //     setTimeout( () => {
// //       console.log('ding')
// //       // clearTimeout;
// //       setRefreshHomePage(()=> Reloader(userInfo.emailId));
// //     }, 3000);
// // });

// useEffect(() => {
//   // setTimeout(async () => {
//   //   setRefreshHomePage(await Reloader(userInfo.emailId));
//   // }, 10000);
//   const fetchData = async () => {
//     const response = await fetch("http://localhost:3000/api/userinfo");
//     if (response.ok) {
//       const responseJson = await response.json();

//       if (!(await responseJson[0])) {
//         // router.push('/log-in')
//       } else {
//         // showHome = false;
//         setUserInfo(await responseJson[0]);
//         // console.log(responseJson)
//         setRefreshHomePage(false);
//       }
//     } else if (response.status === 500) {
//       setRefreshHomePage(true);
//       // fetchData();
//     } else {
//       console.error("Fetch failed:", response.statusText);
//     }
//   };

//   if (refreshHomePage) {
//     fetchData();
//   } else
//     setTimeout(
//       async () =>
//         setRefreshHomePage(
//           await Reloader(userInfo.emailId, new Date(userInfo.updatedAt))
//         ),
//       10000
//     ); // Call the function to fetch data on component mount
// });

// const [projectToggle, setProjectToggle] = React.useState(false);
// const [projectPageId, setProjectPageId] = React.useState("");
// const [deleteProjectPage, setDeleteProjectPage] = React.useState(false);
// const [isDarkMode, setIsDarkMode] = useState(false);

// useEffect(() => {
//   const savedMode = localStorage.getItem("darkMode");
//   if (savedMode) {
//     setIsDarkMode(JSON.parse(savedMode));
//   }
// }, []);

// const toggleDarkMode = () => {
//   const newMode = !isDarkMode;
//   setIsDarkMode(newMode);
//   localStorage.setItem("darkMode", JSON.stringify(newMode));
// };

//   const pageCode = (
//     <div className={`w-screen ${isDarkMode ? "dark" : ""}`}>
//       <div
//         className={
//           "h-screen w-full flex" +
//           (userInfo.name && userInfo.emailId ? " hidden" : "")
//           // ""
//         }
//       >
//         {" "}
//         <div className="m-auto font-mono border-none border-red-500">
//           <img src={logo.src} className="w-1/6 m-auto" />
//         </div>
//       </div>
//       <div
//         className={`container w-full flex flex-row transition-all ${
//           userInfo.name && userInfo.emailId ? "" : " hidden"
//         } ${
//           isDarkMode
//             ? "bg-dark-bg text-dark-text"
//             : "bg-teamupbg text-teamuptext"
//         }`}
//         style={{ transitionDuration: "1000ms" }}
//       >
//         <Sidebar
//           funcToPass={funcToPass}
//           createTeamToggle={createTeamToggle}
//           setDeleteProjectPage={setDeleteProjectPage}
//           deleteProjectPage={deleteProjectPage}
//           isDarkMode={isDarkMode}
//         />
//         <div
//           className={`mainFrame flex flex-row ${
//             isDarkMode ? "bg-dark-bg" : "bg-teamupbg"
//           }`}
//         >
//           <div className="middleFrame h-full">
//             <p className="text-4xl font-semibold ml-5 mt-5"> Team Up </p>
//             <div className="projectpane border-none border-gray-500 ">
//               <ProjectPane
//                 projectToggle={projectToggle}
//                 setProjectToggle={setProjectToggle}
//                 projects={userInfo.projects}
//                 email={userInfo.emailId}
//                 setProjectPageId={setProjectPageId}
//                 isDarkMode={isDarkMode}
//               />
//             </div>
//             <div className="taskpane border-none border-red-500 flex  overflow-hidden h-80 overflow-x-hidden mt-2 mb-0">
//               <TaskPane tasks={userInfo.tasks} />
//             </div>
//           </div>
//           <div className="profile border-none overflow-hidden flex items-center">
//             <button
//               onClick={toggleDarkMode}
//               className={`mr-4 p-2 rounded-full ${
//                 isDarkMode
//                   ? "bg-yellow-400 text-dark-bg"
//                   : "bg-gray-800 text-teamupbg"
//               }`}
//             >
//               {isDarkMode ? "☀️" : "🌙"}
//             </button>
//             <Profile
//               userInfo={{
//                 name: userInfo.name,
//                 profilePic: userInfo.profilePic,
//               }}
//               isDarkMode={isDarkMode}
//             />
//           </div>
//         </div>
//       </div>
//       {createTeamToggle ? (
//         <CreateTeamPage
//           toggle={true}
//           userDetail={userInfo}
//           setCreateTeamToggle={setCreateTeamToggle}
//           setRefreshHomePage={setRefreshHomePage}
//         />
//       ) : (
//         <></>
//       )}
//       {projectToggle ? (
//         <ManageProject
//           toggle={true}
//           userDetail={userInfo}
//           setProjectToggle={setProjectToggle}
//           setRefreshHomePage={setRefreshHomePage}
//           projectPageId={projectPageId}
//           projectToggle={projectToggle}
//         />
//       ) : (
//         <></>
//       )}
//       {deleteProjectPage ? (
//         <DeleteProjectPage
//           toggle={true}
//           userDetail={userInfo}
//           setDeleteProjectPage={setDeleteProjectPage}
//           setRefreshHomePage={setRefreshHomePage}
//           projectPageId={projectPageId}
//           deleteProjectPage={deleteProjectPage}
//         />
//       ) : (
//         <></>
//       )}
//       {/* <CreateTeamPage toggle={createTeamToggle} /> */}
//     </div>
//   );

//   return <div className=" w-screen h-screen">{pageCode}</div>;
// };

// // export async function getServerSideProps(ctx:any) {
// //   const session = await auth(ctx)

// //   return {
// //     props: {
// //       session,
// //     },
// //   }
// // }

// export default Home;

"use client";
export const dynamic = 'force-dynamic'
export const maxDuration = 60
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import ProjectPane from "./components/ProjectPane";
import TaskPane from "./components/TaskPane";
import "./home.css";
import { UserInfo } from "./components/UserInfo";
import { useRouter } from "next/navigation";
import { auth } from "../../../auth";
import CreateTeamPage from "./components/CreateTeamPage";
import logo from "../assets/logo.png";
import Reloader from "./components/reloader";
import ManageProject from "./components/ManageProject";
import DeleteProjectPage from "./components/DeleteProjectPage";

const Home = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    emailId: "",
    profilePic: "",
    projects: [],
    tasks: [],
    contributions: [],
    updatedAt: new Date(),
    createdAt: new Date(),
  });
  const [createTeamToggle, setCreateTeamToggle] = React.useState(false);
  const [refreshHomePage, setRefreshHomePage] = React.useState<any>(true);

  const funcToPass = (value: any) => {
    setCreateTeamToggle(value);
  };

  // useEffect(() => {
  //   if(refreshHomePage) {clearTimeout;console.log('aborted');return;}
  //     setTimeout( () => {
  //       console.log('ding')
  //       // clearTimeout;
  //       setRefreshHomePage(()=> Reloader(userInfo.emailId));
  //     }, 3000);
  // });

  useEffect(() => {
    // setTimeout(async () => {
    //   setRefreshHomePage(await Reloader(userInfo.emailId));
    // }, 10000);
    const fetchData = async () => {
      // Get the base URL depending on the environment
      const baseURL = process.env.VERCEL_URL
      const response = await fetch(`/api/userinfo`);
      if (response.ok) {
        const responseJson = await response.json();

        if (!(await responseJson[0])) {
          // router.push('/log-in')
        } else {
          // showHome = false;
          setUserInfo(await responseJson[0]);
          // console.log(responseJson)
          setRefreshHomePage(false);
        }
      } else if (response.status === 500) {
        setRefreshHomePage(true);
        // fetchData();
      } else {
        console.error("Fetch failed:", response.statusText);
      }
    };

    if (refreshHomePage) {
      fetchData();
    } else
      setTimeout(
        async () =>
          setRefreshHomePage(
            await Reloader(userInfo.emailId, new Date(userInfo.updatedAt))
          ),
        10000
      ); // Call the function to fetch data on component mount
  });

  const [projectToggle, setProjectToggle] = React.useState(false);
  const [projectPageId, setProjectPageId] = React.useState("");
  const [deleteProjectPage, setDeleteProjectPage] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

useEffect(() => {
  // Check for saved preference first
  const savedMode = localStorage.getItem("darkMode");
  
  if (savedMode !== null) {
    setIsDarkMode(JSON.parse(savedMode));
  } else {
    // If no saved preference, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    localStorage.setItem("darkMode", JSON.stringify(prefersDark));
  }

  // Add listener for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e: MediaQueryListEvent) => {
    const newMode = e.matches;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  mediaQuery.addEventListener('change', handleChange);
  
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const pageCode = (
    <div
      className={`w-full min-h-screen flex flex-col ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {/* Loading screen */}
      <div
  className={`h-screen w-full flex items-center justify-center ${
    userInfo.name && userInfo.emailId ? "hidden" : ""
  } ${
    isDarkMode ? "bg-dark-bg" : "bg-teamupbg"
  }`}
>
  <div className="text-center">
    <img
      src={logo.src}
      className="w-32 md:w-48 mx-auto mb-8 animate-pulse"
      alt="Team Up Logo"
    />
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 mb-4 ${
        isDarkMode ? "text-dark-text" : "text-teamuptext"
      }`}>
        <svg 
          className="animate-spin" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
            fill="none"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {/* <p className={`text-xl font-semibold animate-pulse ${
        isDarkMode ? "text-dark-text" : "text-teamuptext"
      }`}>
        Loading...
      </p> */}
    </div>
  </div>
</div>


      {/* Main content */}
      <div
        className={`flex-grow flex flex-col md:flex-row transition-all duration-1000 ${
          userInfo.name && userInfo.emailId ? "" : "hidden"
        } ${
          isDarkMode
            ? "bg-dark-bg text-dark-text"
            : "bg-teamupbg text-teamuptext"
        }`}
      >
        <Sidebar
          funcToPass={funcToPass}
          createTeamToggle={createTeamToggle}
          setDeleteProjectPage={setDeleteProjectPage}
          deleteProjectPage={deleteProjectPage}
          isDarkMode={isDarkMode}
        />
        <div
          className={`flex-grow flex flex-col ${
            isDarkMode ? "bg-dark-bg" : "bg-teamupbg"
          }`}
        >
          <header className="flex justify-between items-center p-4">
  <h1 className="text-3xl md:text-4xl font-semibold ml-auto mr-10">Team Up</h1>
  <div className="flex items-center">
  <button
    onClick={toggleDarkMode}
    className="relative inline-flex h-6 w-11 items-center rounded-full mx-3"
    role="switch"
    aria-checked={isDarkMode}
  >
    <span className="sr-only">Toggle dark mode</span>
    <div
      className={`absolute w-full h-full rounded-full transition ${
        isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    />
    <div
      className={`${
        isDarkMode ? 'translate-x-6' : 'translate-x-1'
      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
    >
      <span className="absolute inset-0 flex items-center justify-center text-xs">
        {isDarkMode ? '🌙' : '☀️'}
      </span>
    </div>
  </button>
  <Profile
    userInfo={{
      name: userInfo.name,
      profilePic: userInfo.profilePic,
    }}
    isDarkMode={isDarkMode}
  />
</div>

</header>

          <main className="flex-grow overflow-hidden flex flex-col p-0">
  <div className="overflow-y-hidden mb-0">
    <ProjectPane
      projectToggle={projectToggle}
      setProjectToggle={setProjectToggle}
      projects={userInfo.projects}
      email={userInfo.emailId}
      setProjectPageId={setProjectPageId}
      isDarkMode={isDarkMode}
    />
  </div>
  <div className="h-72 flex-grow flex-shrink-0 mr-8" style={{marginLeft:'-8px'}}>
    <TaskPane tasks={userInfo.tasks} isDarkMode={isDarkMode} />
  </div>
</main>

        </div>
      </div>

      {/* Modals */}
      {createTeamToggle && (
        <CreateTeamPage
          toggle={true}
          userDetail={userInfo}
          setCreateTeamToggle={setCreateTeamToggle}
          setRefreshHomePage={setRefreshHomePage}
          isDarkMode={isDarkMode}
        />
      )}
      {projectToggle && (
        <ManageProject
          toggle={true}
          userDetail={userInfo}
          setProjectToggle={setProjectToggle}
          setRefreshHomePage={setRefreshHomePage}
          projectPageId={projectPageId}
          projectToggle={projectToggle}
          isDarkMode={isDarkMode}
        />
      )}
      {deleteProjectPage && (
        <DeleteProjectPage
          toggle={true}
          userDetail={userInfo}
          setDeleteProjectPage={setDeleteProjectPage}
          setRefreshHomePage={setRefreshHomePage}
          projectPageId={projectPageId}
          deleteProjectPage={deleteProjectPage}
          isDarkMode={isDarkMode}
          setUserDetail={setUserInfo}
        />
      )}
    </div>
  );

  return pageCode;
};

export default Home;
