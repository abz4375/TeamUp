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
      <div className="cursor-pointer min-w-72 w-72 h-72 mx-3 my-4 border-gray-400 border-2 rounded-xl hover:mt-3 hover:mb-5 transition-all bg-gray-50 grid  select-none active:border-opacity-80 hover:shadow-lg hover:border-gray-700 hover:bg-gray-100" onClick={()=>{props.setProjectToggle(true); props.setProjectPageId(props.projectId)}}>
        <div className=" flex my-2 mt-8 flex-col w-full p-2">
          {/* <img src={logo.src} alt="logo" className=" w-10 h-10 mx-2 my-2" /> */}
          <span className=" transition-all w-full text-center mx-auto my-2 text-3xl font-normal  select-text selection:bg-blue-200 selection:blur-md ">
            {info?.title}
          </span>
          {info?.ownerEmailId === props.email ? (
            <span className="w-full text-center mx-auto mt-auto mb-0 text-xs font-light">
              {/* <Tooltip title={"Manage"}>
                <IconButton
                  aria-label="Manage"
                  className="bg-gray-100 border-2 border-gray-300"
                >
                  <TuneIcon />
                </IconButton>
              </Tooltip> */}
              {/* <Tooltip title='Manage Settings'> */}
                <Chip
                  className="text-md mt-2 cursor-pointer font-normal "
                  label={
                    'Admin Panel'
                  }
                  avatar={<TuneIcon/>}
                />
              {/* </Tooltip> */}
            </span>
          ) : (
            <span className="w-full text-center mx-auto mt-auto mb-0 text-xs font-light">
              Owned by <br />{" "}
              {/* <Tooltip title={info?.ownerEmailId}> */}
                <Chip
                  className="text-md mt-2 cursor-pointer font-normal"
                  label={
                    info?.ownerEmailId === props.email ? "You" : info?.ownerName
                  }
                  avatar={<Avatar src={info?.ownerPic} />}
                />
              {/* </Tooltip> */}
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
      className=" mt-2 ml-4 border-2 border-amber-200 rounded-2xl bg-amber-50 bg-opacity-55 flex flex-row h-80 overflow-y-hidden"
      style={{ width: "99.2%", height: "20rem" }}
    >
      {/* <center>
        <code>Project-Pane</code>
      </center> */}
      <div
        className="w-full flex h-fit overflow-auto"
        style={{ scrollBehavior: "smooth", scrollbarColor: "transparent" }}
        // responsive={responsive}
        // swipeable={false}
        // draggable={false}
        // ssr={true}
        // customTransition="all .5"
        // transitionDuration={500}
        // containerClass="carousel-container"
        // itemClass="carousel-item-padding-40-px"
        // keyBoardControl={true}
      >
        {/* <Carousel
  swipeable={false}
  draggable={false}
  showDots={true}
  responsive={responsive}
  ssr={true} // means to render carousel on server-side.
  infinite={true}
  autoPlay={this.props.deviceType !== "mobile" ? true : false}
  autoPlaySpeed={1000}
  keyBoardControl={true}
  customTransition="all .5"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
  deviceType={this.props.deviceType}
  dotListClass="custom-dot-list-style"
  itemClass="carousel-item-padding-40-px"
  > */}
        {/* <div>Project 1</div> */}
        {/* <div>Project 2</div> */}
        {/* <div>Project 3</div> */}
        {/* <div>Project 4</div> */}
        {props.projects &&
          props.projects.map((projectId: any, index: any) => (
            <Project
              projectId={projectId}
              id={index}
              key={projectId}
              {...props}
            />
          ))}
        {!props.projects || !props.projects.length ? (
          <>
            <div className="w-7/8 h-80 m-auto rounded-lg grid">
              <div className=" grid m-auto my-2 mt-8">
                <span className=" m-auto text-3xl font-light text-amber-900 font-mono">
                  &lt;\&gt; No Teams
                  <br />
                  <br />
                  <span className="text-4xl font-semibold"> Form a Team!</span>
                </span>
                <hr className=" border-none w-4/5 border-2 mx-auto border-b-0 " />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* <Project projectId="1" />
        <Project projectId="2" />
        <Project projectId="3" />
        <Project projectId="4" />
        <Project projectId="5" />
        <Project projectId="6" /> */}
      </div>
    </div>
  );
};

export default ProjectPane;
