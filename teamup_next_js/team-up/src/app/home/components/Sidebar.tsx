"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import "./sidebar.css";
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import logo from "../../assets/logo.png";

export default function Sidebar(props: {
  funcToPass: (value: boolean) => void;
  createTeamToggle: boolean;
  setDeleteProjectPage: (value: boolean) => void;
  deleteProjectPage: boolean;
  isDarkMode: boolean;
}) {
  const [winWidth, setWidth] = useState(0);
  const [winHeight, setHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreateTeam = () => {
    props.funcToPass(true);
  }

  return (
    <div className={`border-r-2 h-screen flex flex-col sidebar ${props.isDarkMode ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <img src={logo.src} className="w-5/6 mx-auto mt-3" alt="Team Up Logo" />
      <Tooltip title="Create Team">
        <button
          className={`mx-auto mt-16 border-2 rounded-full createTeamBtn transition border-amber-900 bg-amber-900`}
          onClick={handleCreateTeam}
        >
          <GroupAddRoundedIcon sx={{color:'white'}} className="w-3/5 h-3/5 m-auto createTeam"/>
        </button>
      </Tooltip>
      <Tooltip title="Delete Project">
        <button
          className={`mx-auto mt-16 border-2 rounded-full createTeamBtn transition ${
            props.isDarkMode ? 'border-red-500 bg-red-500' : 'border-red-700 bg-red-700'
          }`}
          onClick={() => props.setDeleteProjectPage(true)}
        >
          <DeleteForeverIcon sx={{color:'white'}} className="w-3/5 h-3/5 m-auto createTeam"/>
        </button>
      </Tooltip>
    </div>
  );
}
