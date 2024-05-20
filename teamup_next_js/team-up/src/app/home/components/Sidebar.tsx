"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Box, Paper, Button, Stack, Tooltip } from "@mui/material";
import "./sidebar.css";
// import createTeam from "../../assets/createTeam.png";
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import logo from "../../assets/logo.png";
export default function Sidebar(props:any) {
  // making sidebar responsive
  const [winWidth, setWidth] = useState(0);
  const [winHeight, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreateTeam = () => {
    // console.log(!props.createTeamToggle)
    props.funcToPass(true);
  }

  return (
    <div className=" border-r-2 h-screen  flex flex-col sidebar bg-gray-50" >
      <img src={logo.src} className="w-5/6 mx-auto mt-3" />
      <Tooltip title="Create Team">
        <button
          className=" mx-auto mt-16 border-2 border-amber-900 rounded-full createTeamBtn bg-amber-900 transition" 
          onClick={handleCreateTeam}
        >
          {/* <img
            src={createTeam.src}
            className=" border-2 border-gray-400 rounded-full createTeam"
          /> */}
          <GroupAddRoundedIcon sx={{color:'white'}} className="w-3/5 h-3/5 m-auto createTeam"/>
        </button>
      </Tooltip>
    </div>
  );
}
