"use client";
import React, { FC } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./projectpane.css";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';

// interface ProjectProps {
//   id: string;
// }

const Project = (props: any) => {
  const [info, setInfo] = React.useState({
    title: "",
    ownerName: "",
    ownerPic: "",
    updatedAt: new Date(),
    ownerEmailId: "",
  });
  const [fetchAgain, setFetchAgain] = React.useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      // console.log('fetch again:',fetchAgain,'projectid:',props.projectId)
      if (fetchAgain && props.projectId) {
        // setTimeout(async() => {
        const response = await fetch(
          "http://localhost:3000/api/project?id=" +
            props.projectId +
            "&info=forDashboard"
        );
        if (response.ok) {
          const responseJson = await response.json();

          if (await responseJson) {
            // router.push('/log-in')
            setInfo(await responseJson);
            setFetchAgain(false);
            // console.log(responseJson);
          }
        } else if (response.status === 404) {
          console.error("Fetch failed:", response.statusText);
          // return;
          setFetchAgain(false);
        } else {
          setFetchAgain(true);
        }
        // }, 1000);
      }
    };

    fetchData();
  }, []);
  return (
    // <Box
    //   sx={{
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     '& > :not(style)': {
    //       m: 1,
    //       width: 160,
    //       height: 160,
    //     },
    //   }}
    // >
    //   <Paper elevation={5} >
    //   <Stack direction="row" spacing={1} >
    //   <center><code>Team-Name</code></center>
    // </Stack>
    //   </Paper>
    // </Box>
    <Tooltip arrow placement="right" title={` Open`}>
      <div 
        className={`cursor-pointer min-w-72 w-72 h-72 mx-3 my-4 border-2 rounded-xl hover:mt-3 hover:mb-5 transition-all grid select-none active:border-opacity-80 hover:shadow-lg
        ${props.isDarkMode 
          ? 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-700' 
          : 'bg-gray-50 border-gray-400 hover:border-gray-700 hover:bg-gray-100'}`} 
        onClick={() => {props.setProjectToggle(true); props.setProjectPageId(props.projectId)}}
      >
        <div className="flex my-2 mt-8 flex-col w-full p-2">
          <span className={`transition-all w-full text-center mx-auto my-2 text-3xl font-normal select-text
            ${props.isDarkMode ? 'text-gray-200 selection:bg-blue-800' : 'text-gray-800 selection:bg-blue-200'} 
            selection:blur-md`}>
            {info?.title}
          </span>
          {info?.ownerEmailId === props.email ? (
            <span className="w-full text-center mx-auto mt-auto mb-0 text-xs font-light">
              <Chip
                className={`text-md mt-2 cursor-pointer font-normal
                  ${props.isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
                label='Admin Panel'
                avatar={<TuneIcon className={props.isDarkMode ? 'text-gray-300' : 'text-gray-600'} />}
              />
            </span>
          ) : (
            <span className="w-full text-center mx-auto mt-auto mb-0 text-xs font-light">
              Owned by <br />
              <Chip
                className={`text-md mt-2 cursor-pointer font-normal
                  ${props.isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
                label={info?.ownerEmailId === props.email ? "You" : info?.ownerName}
                avatar={<Avatar src={info?.ownerPic} />}
              />
            </span>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

const ProjectPane = (props: any) => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  // const responsive = {
  //   desktop: {
  //     breakpoint: { max: 3000, min: 1024 },
  //     items: 3,
  //     slidesToSlide: 3 // optional, default to 1.
  //   },
  //   tablet: {
  //     breakpoint: { max: 1024, min: 464 },
  //     items: 2,
  //     slidesToSlide: 2 // optional, default to 1.
  //   },
  //   mobile: {
  //     breakpoint: { max: 464, min: 0 },
  //     items: 1,
  //     slidesToSlide: 1 // optional, default to 1.
  //   }
  // };
  return (
    <div
      className={`mt-2 ml-4 rounded-2xl flex flex-col h-full overflow-hidden
        ${props.isDarkMode 
          ? 'bg-gray-900 bg-opacity-90' 
          : 'bg-amber-50 bg-opacity-55'}`}
      style={{ width: "93vw" }}
    >
      <div
        className="w-full flex-1 overflow-x-auto overflow-y-hidden"
        style={{ scrollBehavior: "smooth", scrollbarColor: "transparent" }}
      >
        <div className="flex h-full">
          {props.projects &&
            props.projects.map((projectId: any, index: any) => (
              <Project
                projectId={projectId}
                id={index}
                key={projectId}
                isDarkMode={props.isDarkMode}
                {...props}
              />
            ))}
          {!props.projects || !props.projects.length ? (
            <div className={`w-full h-full flex items-center justify-center
              ${props.isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="text-center">
                <span className={`text-3xl font-light font-mono
                  ${props.isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                  &lt;\&gt; No Teams
                  <br />
                  <br />
                  <span className="text-4xl font-semibold">Form a Team!</span>
                </span>
                <hr className={`border-none w-4/5 border-2 mx-auto border-b-0 mt-4
                  ${props.isDarkMode ? 'border-amber-300' : 'border-amber-900'}`} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProjectPane;
