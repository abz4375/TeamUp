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
      const response = await fetch(`${baseURL}/api/userinfo`);
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
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
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
        }`}
      >
        <div className="text-center">
          <img
            src={logo.src}
            className="w-32 md:w-48 mx-auto mb-4"
            alt="Team Up Logo"
          />
          <p className="text-xl font-semibold">Loading...</p>
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
            <h1 className="text-3xl md:text-4xl font-semibold">Team Up</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  isDarkMode
                    ? "bg-yellow-400 text-dark-bg"
                    : "bg-gray-800 text-teamupbg"
                }`}
              >
                {isDarkMode ? "☀️" : "🌙"}
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
        />
      )}
    </div>
  );

  return pageCode;
};

export default Home;
