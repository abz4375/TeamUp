"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";

interface SidebarProps {
  isDarkMode: boolean;
  funcToPass: (value: boolean) => void;
  createTeamToggle: boolean;
  setDeleteProjectPage: (value: boolean) => void;
  deleteProjectPage: boolean;
}

const Sidebar = (props: SidebarProps) => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);
      if (currentWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (width < 768 &&
          sidebarRef.current &&
          menuButtonRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          !menuButtonRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
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
    if (width < 768) setIsMobileMenuOpen(false);
  };

  const handleDeleteProject = () => {
    props.setDeleteProjectPage(true);
    if (width < 768) setIsMobileMenuOpen(false);
  };

  const iconSize = 20;
  // Consistent styling for sidebar buttons, responsive for collapsed/expanded states
  const sidebarButtonClasses = "w-full flex items-center justify-start md:justify-center lg:justify-start p-3 rounded-lg transition-colors text-sm font-medium h-12";
  const sidebarIconClasses = "md:mx-auto lg:mr-3 shrink-0"; // Ensures icon doesn't shrink and handles margin for collapsed/expanded

  return (
    <TooltipProvider delayDuration={100}>
      {/* Mobile Menu Toggle Button */}
      <Button
        ref={menuButtonRef}
        variant="ghost"
        size="icon"
        className={`md:hidden fixed top-4 left-4 z-50 transition-all duration-300
          ${props.isDarkMode
            ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
            : 'bg-white/80 text-slate-800 hover:bg-slate-100'
          } shadow-lg`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={iconSize + 4} /> : <Menu size={iconSize + 4} />}
      </Button>

      <div
        ref={sidebarRef}
        className={`
          transition-transform duration-300 ease-in-out flex flex-col
          fixed md:relative h-full z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          ${props.isDarkMode
            ? 'border-slate-700 bg-slate-900/95 md:bg-slate-900 text-slate-200'
            : 'border-slate-300 bg-white/95 md:bg-slate-50 text-slate-700'
          }
          border-r backdrop-blur-md md:backdrop-blur-none
          w-60 md:w-20 lg:w-60 py-4 px-3 space-y-6
        `} // Adjusted padding and width for different states
      >
        <div className="flex items-center justify-center md:justify-start lg:justify-center mb-6 shrink-0 h-10 px-1">
          <img
            src={logo.src}
            className="h-10 w-auto"
            alt="Team Up Logo"
          />
           <span className={`text-2xl font-semibold ml-2 md:hidden lg:inline-block ${props.isDarkMode ? 'text-white' : 'text-slate-800'}`}>TeamUp</span>
        </div>

        <nav className="flex flex-col space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={props.isDarkMode ? "ghost" : "outline"}
                className={`${sidebarButtonClasses} ${props.isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                onClick={handleCreateTeam}
              >
                <Users size={iconSize} className={sidebarIconClasses} />
                <span className="md:hidden lg:inline-block">Create Team</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="md:block hidden lg:hidden ml-2">
              <p>Create Team</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={props.isDarkMode ? "ghost" : "outline"}
                className={`${sidebarButtonClasses} ${props.isDarkMode ? 'hover:bg-slate-700 text-red-400 hover:text-red-300' : 'hover:bg-slate-200 text-red-500 hover:text-red-600'}`}
                onClick={handleDeleteProject}
              >
                <Trash2 size={iconSize} className={sidebarIconClasses} />
                <span className="md:hidden lg:inline-block">Delete Project</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="md:block hidden lg:hidden ml-2">
              <p>Delete Project</p>
            </TooltipContent>
          </Tooltip>
        </nav>
      </div>
    </TooltipProvider>
  );
}

export default Sidebar;
