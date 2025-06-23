"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button"; // Added Button for the "Form a New Team"
import { SlidersHorizontal, Loader2 } from "lucide-react";

interface ProjectInfo {
  title: string;
  ownerName: string;
  ownerPic: string;
  updatedAt: Date | string;
  ownerEmailId: string;
}

interface ProjectCardProps {
  projectId: string;
  isDarkMode: boolean;
  email: string;
  setProjectToggle: (value: boolean) => void;
  setProjectPageId: (id: string) => void;
}

const ProjectCard = (props: ProjectCardProps) => {
  const [info, setInfo] = useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Manage loading state for each card
  const [error, setError] = useState<string | null>(null); // Manage error state

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    const fetchData = async () => {
      if (!props.projectId) {
        setIsLoading(false);
        setError("Project ID is missing.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/project/${props.projectId}/dashboard`);
        if (!isMounted) return;

        if (response.ok) {
          const responseJson = await response.json();
          if (responseJson && responseJson.data) {
            setInfo(responseJson.data);
          } else {
            setError("Project data not found in response.");
            console.error("Project data not found in response:", responseJson);
          }
        } else {
          setError(`Fetch failed: ${response.status} ${response.statusText}`);
          console.error("Fetch failed:", response.status, response.statusText);
        }
      } catch (err) {
        if (!isMounted) return;
        setError("Error fetching project data.");
        console.error("Error fetching project data:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false when component unmounts
    };
  }, [props.projectId]); // Dependency array includes props.projectId

  if (isLoading) {
    return (
      <div className={`cursor-pointer min-w-[18rem] w-72 h-72 mx-3 my-4 border rounded-xl shadow-lg
        flex flex-col items-center justify-center p-4
        ${props.isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-slate-50 border-slate-300'}`}
      >
        <Loader2 className={`animate-spin h-12 w-12 ${props.isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
        <p className={`mt-4 text-sm ${props.isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Loading Project...</p>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className={`cursor-pointer min-w-[18rem] w-72 h-72 mx-3 my-4 border border-red-500/50 rounded-xl shadow-lg
        flex flex-col items-center justify-center p-4 text-center
        ${props.isDarkMode
          ? 'bg-slate-800 text-red-400'
          : 'bg-slate-50 text-red-600'}`}
      >
        <p className="font-semibold">Error loading project</p>
        <p className="text-xs mt-1">{error || "Details unavailable."}</p>
      </div>
    );
  }

  const isAdmin = info.ownerEmailId === props.email;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`cursor-pointer min-w-[18rem] w-72 h-72 mx-3 my-4 border rounded-xl
              hover:shadow-xl transition-all duration-200 group
              flex flex-col justify-between p-5 overflow-hidden relative
              ${props.isDarkMode
                ? 'bg-slate-800 border-slate-700 hover:border-blue-600 hover:bg-slate-700/60'
                : 'bg-white border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}
            onClick={() => { props.setProjectToggle(true); props.setProjectPageId(props.projectId); }}
          >
            <div className="flex flex-col items-center text-center pt-2">
              <h3 className={`text-xl font-semibold truncate w-full mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400
                ${props.isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                {info.title || "Untitled Project"}
              </h3>
              {/* Optional: Add a short description or last updated date here */}
            </div>

            <div className="flex flex-col items-center text-center text-xs pb-2">
              {isAdmin ? (
                <Badge variant={props.isDarkMode ? "outline" : "default"} className={`py-1.5 px-3 text-sm font-medium ${props.isDarkMode ? 'border-sky-500 text-sky-400' : 'bg-sky-600 text-white'}`}>
                  <SlidersHorizontal size={14} className="mr-1.5" />
                  Admin Panel
                </Badge>
              ) : (
                <>
                  <p className={`mb-1.5 ${props.isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Owned by</p>
                  <div className="flex items-center">
                    <ShadcnAvatar className="w-7 h-7 mr-2 border-2 dark:border-slate-600">
                      <AvatarImage src={info.ownerPic} alt={info.ownerName || 'Owner'} />
                      <AvatarFallback className="text-xs">{info.ownerName ? info.ownerName.substring(0, 1).toUpperCase() : 'U'}</AvatarFallback>
                    </ShadcnAvatar>
                    <span className={`${props.isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-medium text-sm`}>
                      {info.ownerEmailId === props.email ? "You" : (info.ownerName || "Unknown User")}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className={`absolute -bottom-8 -right-8 w-20 h-20 rounded-full
              ${props.isDarkMode ? 'bg-blue-600/10' : 'bg-blue-500/5'}
              group-hover:scale-[2.5] transition-transform duration-300 opacity-70 group-hover:opacity-100`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-800 text-white border-slate-700">
          <p>Open: {info.title || "Project"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface ProjectPaneProps {
  projects: string[] | null | undefined;
  isDarkMode: boolean;
  email: string;
  setProjectToggle: (value: boolean) => void; // For opening create/manage project modal
  setProjectPageId: (id: string) => void; // For opening specific project
  // funcToPass from Sidebar was for createTeamToggle, this is similar
  createTeamToggle?: boolean; // Prop from parent to trigger create team modal
  funcToPass?: (value: boolean) => void; // If create team is handled by this pane
}

const ProjectPane = (props: ProjectPaneProps) => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1600 }, items: 4, partialVisibilityGutter: 30 },
    desktop: { breakpoint: { max: 1600, min: 1280 }, items: 3, partialVisibilityGutter: 30 },
    largeTablet: { breakpoint: { max: 1280, min: 1024 }, items: 3, partialVisibilityGutter: 20 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, partialVisibilityGutter: 20 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, partialVisibilityGutter: 10 },
  };

  // Use funcToPass if available (likely from Sidebar's create team), otherwise use setProjectToggle directly
  const handleCreateTeamClick = () => {
    if (props.funcToPass) {
      props.funcToPass(true);
    } else {
      // Fallback or alternative logic if funcToPass is not provided
      // This might involve setting a local state or calling another prop
      // For now, let's assume setProjectToggle can also open a generic "add project" modal
      props.setProjectToggle(true);
      props.setProjectPageId(""); // Clear project page ID for new project
    }
  };


  return (
    <div
      className={`mt-1 ml-1 md:ml-2 rounded-xl flex flex-col h-full
        ${props.isDarkMode ? 'bg-slate-900/70' : 'bg-sky-50/60'}
        p-3 md:p-4 shadow-inner overflow-hidden`}
      style={{ width: "calc(100% - 0.5rem)" }} // Adjusted width for slightly less margin
    >
      {(!props.projects || props.projects.length === 0) ? (
        <div className={`w-full h-full flex items-center justify-center rounded-lg
          ${props.isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'} p-6 md:p-8`}>
          <div className="text-center">
            <h2 className={`text-2xl md:text-3xl font-light mb-3
              ${props.isDarkMode ? 'text-sky-300' : 'text-sky-700'}`}>
              No Teams Yet!
            </h2>
            <p className={`text-md md:text-lg mb-5 ${props.isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              It&apos;s a bit quiet here. Let&apos;s get a project started.
            </p>
            <Button
              onClick={handleCreateTeamClick}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-base px-6 py-3"
            >
              Create New Team
            </Button>
          </div>
        </div>
      ) : (
        <Carousel
          responsive={responsive}
          containerClass="w-full h-full py-2" // Added padding for items
          itemClass="px-1.5 md:px-2" // Padding around each item
          swipeable={true}
          draggable={true}
          showDots={props.projects.length > 5} // Show dots if many items
          arrows={props.projects.length > 3} // Show arrows if items exceed typical view
          infinite={false}
          keyBoardControl={true}
          transitionDuration={300}
          partialVisbile // Enable partial visibility for a more modern carousel feel
        >
          {props.projects.map((projectId: string) => (
            <ProjectCard
              projectId={projectId}
              key={projectId}
              isDarkMode={props.isDarkMode}
              email={props.email}
              setProjectToggle={props.setProjectToggle}
              setProjectPageId={props.setProjectPageId}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ProjectPane;
