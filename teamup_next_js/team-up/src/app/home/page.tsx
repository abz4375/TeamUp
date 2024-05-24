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
// import { connectDB } from "../../../db.js";

const Home = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    emailId: '',
    profilePic: '',
    projects: [],
    tasks: [],
    contributions: [],
    updatedAt:new Date(),
    createdAt:new Date()
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
      const response = await fetch("http://localhost:3000/api/userinfo");
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
      } else if(response.status===500){
        setRefreshHomePage(true);
        // fetchData();
      } else {
        console.error("Fetch failed:", response.statusText);
      }
    };
    
    if (refreshHomePage) {
      fetchData();
    } else setTimeout(async()=>setRefreshHomePage(await Reloader(userInfo.emailId,new Date (userInfo.updatedAt))),10000)// Call the function to fetch data on component mount
  });

  const [projectToggle, setProjectToggle] = React.useState(false);
  const [projectPageId, setProjectPageId] = React.useState('');

  const pageCode = (
    <div className="w-screen">
      <div
        className={
          "h-screen w-full flex" +
          (userInfo.name && userInfo.emailId ? " hidden" : "")
          // ""
        }
      >
        {" "}
        <div className="m-auto font-mono border-none border-red-500">
          <img src={logo.src} className="w-1/6 m-auto" />
        </div>
      </div>
      <div
        className={
          "container w-full flex flex-row transition-all" +
          (userInfo.name && userInfo.emailId ? "" : " hidden")
          // " hidden"
        }
        style={{ transitionDuration: "1000ms" }}
      >
        <Sidebar funcToPass={funcToPass} createTeamToggle={createTeamToggle} />
        <div className="mainFrame flex flex-row">
          <div className="middleFrame h-full">
            <p className="text-4xl font-semibold ml-5 mt-5"> Team Up </p>
            <div className="projectpane border-none border-gray-500 ">
              <ProjectPane projectToggle={projectToggle} setProjectToggle={setProjectToggle} projects={userInfo.projects} email = {userInfo.emailId} setProjectPageId={setProjectPageId} />
            </div>
            <div className="taskpane border-none border-red-500 flex  overflow-hidden h-80 overflow-x-hidden mt-2 mb-0">
              <TaskPane tasks={userInfo.tasks} />
            </div>
          </div>
          <div className="profile border-none border-red-500 overflow-hidden">
            <Profile
              userInfo={{
                name: userInfo.name,
                profilePic: userInfo.profilePic,
              }}
            />
          </div>
        </div>
      </div>
      {createTeamToggle ? (
        <CreateTeamPage
          toggle={true}
          userDetail={userInfo}
          setCreateTeamToggle={setCreateTeamToggle}
          setRefreshHomePage={setRefreshHomePage}
        />
      ) : (
        <></>
      )}
      {projectToggle ? (
        <ManageProject
          toggle={true}
          userDetail={userInfo}
          setProjectToggle={setProjectToggle}
          setRefreshHomePage={setRefreshHomePage}
          projectPageId={projectPageId}
          projectToggle={projectToggle}
        />
      ) : (
        <></>
      )}
      {/* <CreateTeamPage toggle={createTeamToggle} /> */}
    </div>
  );

  return <div className=" w-screen h-screen">{pageCode}</div>;
};

// export async function getServerSideProps(ctx:any) {
//   const session = await auth(ctx)

//   return {
//     props: {
//       session,
//     },
//   }
// }

export default Home;
