'use client'
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
// import { connectDB } from "../../../db.js";

const Home = () => {
  const [createTeamToggle, setCreateTeamToggle] = React.useState(false);
  // if (!session.user) return <div>Not authenticated</div>
  // // ------------------ SHOW LOGIN ---------------------
  
  // if(!createTeamToggle) console.log('createTeamToggle is False'); else console.log('createTeamToggle is True');

  const funcToPass = (value:any) => {
    setCreateTeamToggle(value);
  }

  const [userInfo,setUserInfo] = useState({
    name: null,
    emailId: null,
    profilePic: null,
    projects: null,
    tasks:null,
    contributions:null
  });
  const router = useRouter();
  // const [showHome, setShowHome] = useState(false);
  let showHome = false;
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/api/userinfo');
      if (response.ok) {
        const responseJson = await response.json();
        
        if ( !await responseJson[0] ) {
          // router.push('/log-in')          
        } else {
          // showHome = false;
          setUserInfo(await responseJson[0])
          // console.log(responseJson)       
        }
      } else {
        console.error("Fetch failed:", response.statusText);
      }
    };
    
    fetchData(); // Call the function to fetch data on component mount
  }, []);
  
  const pageCode = (
    <div className={"w-screen" + ((userInfo.name && userInfo.emailId)?"":" hidden")}>
      <div className={'h-full w-full'+((userInfo.name && userInfo.emailId)?" hidden":"")}> <span className="m-auto font-mono"> Loading... </span> </div>
      <div className="container w-full flex flex-row">
        <Sidebar funcToPass={funcToPass} createTeamToggle={createTeamToggle} />
        <div className="mainFrame flex flex-row" >
          <div className="middleFrame ">
            <p className="text-4xl font-semibold ml-5 mt-5"> Team Up </p>
            <div className="projectpane border-none border-gray-500 "><ProjectPane projects={userInfo.projects}/></div>
            <div className="taskpane border-none border-red-500 flex mt-4 h-2/5 overflow-auto"><TaskPane tasks={userInfo.tasks} /></div>
          </div>
          <div className="profile border-none border-red-500 overflow-hidden">
            <Profile userInfo = {{name: userInfo.name, profilePic: userInfo.profilePic}}/>
          </div>
        </div>
      </div>
      {(createTeamToggle)?<CreateTeamPage toggle={true} userDetail = {userInfo} setCreateTeamToggle={setCreateTeamToggle}/>:<></>}
      {/* <CreateTeamPage toggle={createTeamToggle} /> */}
    </div>
  );

  return (
    <div className=" w-screen h-screen">
      {pageCode}
    </div>
  );
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
