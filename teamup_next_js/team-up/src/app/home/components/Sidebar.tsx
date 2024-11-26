"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import "./sidebar.css";
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import logo from "../../assets/logo.png";

const Sidebar = (props: any) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [width, setWidth] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsHidden(true);
        setIsCollapsed(true);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (width < 640 && 
          sidebarRef.current && 
          buttonRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setIsHidden(true);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [width]);

  const handleCreateTeam = () => {
    props.funcToPass(true);
  }

  return (
    <>
      {width < 640 && (
        <button
          ref={buttonRef}
          className={`fixed top-4 left-4 z-50
            p-2 rounded-full transition-all duration-300
            ${props.isDarkMode 
              ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700' 
              : 'bg-white/80 text-gray-800 hover:bg-gray-50'
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
        ref={sidebarRef}
        className={`transition-all duration-300 ease-in-out flex flex-col 
          ${width < 640 
            ? 'fixed h-full z-40 backdrop-blur-md' 
            : 'relative h-screen'} 
          ${isHidden && width < 640 ? '-translate-x-full' : 'translate-x-0'}
          ${props.isDarkMode 
            ? `border-gray-700 ${width < 640 ? 'bg-gray-800/80' : 'bg-gray-900'}`
            : `border-gray-200 ${width < 640 ? 'bg-white/80' : 'bg-gray-50'}`}
          border-r-2`}
      >
        <img 
          src={logo.src} 
          className="w-16 mx-auto mt-3"
          alt="Team Up Logo" 
        />
        
        <div className="flex flex-col gap-4 mt-16">
          <div className={`flex items-center mx-4 hover:bg-opacity-80 transition rounded-lg
            ${props.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Tooltip title="Create Team" placement="right">
              <button
                className={`p-2 border-2 rounded-full transition
                  ${props.isDarkMode 
                    ? 'border-amber-500 bg-amber-500 hover:bg-amber-600' 
                    : 'border-amber-900 bg-amber-900 hover:bg-amber-800'}`}
                onClick={handleCreateTeam}
              >
                <GroupAddRoundedIcon 
                  sx={{color:'white', fontSize: '1.5rem'}} 
                />
              </button>
            </Tooltip>
            {width < 640 && !isHidden && (
              <span className={`ml-3 text-sm ${
                props.isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Create Team
              </span>
            )}
          </div>

          <div className={`flex items-center mx-4 hover:bg-opacity-80 transition rounded-lg
            ${props.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <Tooltip title="Delete Project" placement="right">
              <button
                className={`p-2 border-2 rounded-full transition
                  ${props.isDarkMode 
                    ? 'border-red-500 bg-red-500 hover:bg-red-600' 
                    : 'border-red-700 bg-red-700 hover:bg-red-800'}`}
                onClick={() => props.setDeleteProjectPage(true)}
              >
                <DeleteForeverIcon 
                  sx={{color:'white', fontSize: '1.5rem'}} 
                />
              </button>
            </Tooltip>
            {width < 640 && !isHidden && (
              <span className={`ml-3 text-sm ${
                props.isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Delete Project
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
