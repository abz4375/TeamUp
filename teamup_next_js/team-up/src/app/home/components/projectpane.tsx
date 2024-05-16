"use client";
import React, { FC } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./projectpane.css";
import { Box, Paper, Stack } from "@mui/material";
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';

// interface ProjectProps {
//   id: string;
// }

const Project = (props: any) => {
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
    <div className=" w-80 h-80 m-auto border-gray-400 border-2 rounded-lg bg-gray-200 grid teamcard">
      <div className=" flex m-auto my-2 mt-8">
        {/* <img src={logo.src} alt="logo" className=" w-10 h-10 mx-2 my-2" /> */}
        <span className=" mx-auto my-2 text-md font-light">Team Name</span>
      </div>
    </div>
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
    <div className=" mt-4 ml-4" style={{width:'99.2%'}}>
      {/* <center>
        <code>Project-Pane</code>
      </center> */}
      <Carousel
        className="w-full border-none border-red-500 bg-amber-50 bg-opacity-55"
        responsive={responsive}
        keyBoardControl={true}
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
          props.projects.map((project: any) => {
            // fetch project info
            return <Project />;
          })}
        {!props.projects || !props.projects.length ? (
          <>
            <div className="w-7/8 h-80 m-auto rounded-lg grid">
              <div className=" grid m-auto my-2 mt-8">
                <span className=" m-auto text-3xl font-light text-amber-900 font-mono" >
                &lt;\&gt; No Teams
                  <br /><br /><span className="text-4xl font-semibold"> Form a Team!</span>
                </span>
                <hr className=" border-none w-4/5 border-2 mx-auto border-b-0 "/>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* <Project id="1" />
        <Project id="2" />
        <Project id="3" />
        <Project id="4" />
        <Project id="5" />
        <Project id="6" /> */}
      </Carousel>
    </div>
  );
};

export default ProjectPane;
