"use client";

import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import "./sidebar.css";
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MenuIcon from '@mui/icons-material/Menu'; // Added hamburger menu icon
import CloseIcon from '@mui/icons-material/Close'; // Added close icon
import logo from "../../assets/logo.png";

const Sidebar = (props: any) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Set width after component mounts
    setWidth(window.innerWidth);
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsHidden(true);
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateTeam = () => {
    props.funcToPass(true);
  }

  return (
    <>
      {width < 640 && (
        <button
        className={`fixed top-4 left-4 z-50
          p-2 rounded-full transition-all duration-300
         ba bg-opacity-30
          ${props.isDarkMode 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-800 hover:bg-gray-50'
          } ${!isHidden ? 'shadow-lg' : ''}`}
        onClick={() => setIsHidden(!isHidden)}
      >
        {isHidden 
          ? <MenuIcon sx={{ fontSize: '1.5rem' }} />
          : <CloseIcon sx={{ fontSize: '1.5rem' }} />
        }
      </button>
      )}
      
      <div 
  className={`transition-all duration-300 ease-in-out flex flex-col border-r-2 
    ${width < 640 
      ? 'fixed h-full z-40 backdrop-blur-md bg-white/30' 
      : 'relative h-screen'} 
    ${isHidden && width < 640 ? '-translate-x-full' : 'translate-x-0'}
    ${props.isDarkMode 
      ? width < 640 
        ? 'bg-gray-800/30' 
        : 'bg-dark-bg' 
      : width < 640 
        ? 'bg-white/30' 
        : 'bg-gray-50'}`}
>

        <img 
          src={logo.src} 
          className="w-16 mx-auto mt-3"
          alt="Team Up Logo" 
        />
        
        <div className="flex flex-col gap-4 mt-16">
          <div className="flex items-center mx-4 hover:bg-opacity-80 transition rounded-lg">
            <Tooltip title="Create Team" placement="right">
              <button
                className="p-2 border-2 rounded-full transition
                  border-amber-900 bg-amber-900"
                onClick={handleCreateTeam}
              >
                <GroupAddRoundedIcon 
                  sx={{color:'white', fontSize: '1.5rem'}} 
                />
              </button>
            </Tooltip>
            {width < 640 && !isHidden && (
              <span className="ml-3 text-sm">Create Team</span>
            )}
          </div>

          <div className="flex items-center mx-4 hover:bg-opacity-80 transition rounded-lg">
            <Tooltip title="Delete Project" placement="right">
              <button
                className={`p-2 border-2 rounded-full transition
                  ${props.isDarkMode ? 'border-red-500 bg-red-500' : 'border-red-700 bg-red-700'}`}
                onClick={() => props.setDeleteProjectPage(true)}
              >
                <DeleteForeverIcon 
                  sx={{color:'white', fontSize: '1.5rem'}} 
                />
              </button>
            </Tooltip>
            {width < 640 && !isHidden && (
              <span className="ml-3 text-sm">Delete Project</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
