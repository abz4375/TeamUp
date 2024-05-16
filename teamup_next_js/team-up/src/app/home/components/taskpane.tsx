import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
import Task from "./Task";
// import Checkbox from '@mui/material/Checkbox';
import "./taskpane.css";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

// function ControlledCheckbox() {
//   const [checked, setChecked] = React.useState(true);

//   const handleChange = (event: any) => {
//     setChecked(event.target.checked);
//   };

//   return (
//     <Checkbox
//       checked={checked}
//       onChange={handleChange}
//       inputProps={{ "aria-label": "controlled" }}
//     />
//   );
// }
export default function TaskPane(props:any) {
  // making taskpane responsive
  // const [winWidth, setWidth] = useState(0);
  // const [winHeight, setHeight] = useState(0);
  // const [loading, setLoading] = React.useState(false);
  // function handleClick() {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 3000);
  // }

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWidth(window.innerWidth);
  //     setHeight(window.innerHeight);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   // Cleanup function to remove event listener on unmount
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <Box
      className="mx-auto border-none border-red-500 w-full grid px-2"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          // width: '100%',
          // height: '60%',
        },
      }}
    >
      <div className="w-full h-full pt-2 pb-4 paperTask border-2 border-gray-300 rounded-lg grid bg-gray-50">
        {/* <Paper elevation={0} className=' paperTask border-r-2 border-gray-400' > */}
        {/* <Stack
          direction="column"
          spacing={1}
          className=" border-none border-red-500 flex"
        > */}
        <span className="ml-5 text-3xl text-center mt-2 font-semibold"> Pending Tasks </span>
        {/* <br /> */}
        {/* <Task className="task"></Task>  
      <Task className="task"></Task>  
      <Task className="task"></Task>   */}
        {/* <div className="task border-2 border-gray-400 rounded-md bg-gray-200 w-11/12 h-14 mx-auto mt-4 flex flex-row">
          <FormGroup>
            <FormControlLabel
              className="ml-5 my-auto"
              control={
                <Checkbox
                  disableRipple
                  sx={{
                    color: "black",
                    "&.Mui-checked": {
                      color: "black",
                    },
                  }}
                  defaultChecked
                />
              }
              label="Task Description"
            />
          </FormGroup>
          <LoadingButton
            size="small"
            className="h-3/5 my-auto ml-auto mr-5"
            loading = {loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleClick}
            sx={{
              color:'white',
              borderColor:'gray',
              background:'black',
              '&:hover':{
                color:'white',
                background:'black',
                borderColor:'black'
              }
            }}
          >
            Submit
          </LoadingButton>
        </div> */}
        {/* <Task desc='Task Description'/>
        <Task desc='Task Description'/> */}
        {props.tasks &&
          props.tasks.map((project: any) => {
            // fetch project info
            return <Task desc='Sample Description' />;
          })}
        {!props.tasks || !props.tasks.length ? (
          <>
            <div className=" m-auto text-5xl font-light my-4 opacity-50 text-green-500 font-mono">
              🎉 No Pending Tasks!
            </div>
          </>
        ) : (
          <></>
        )}
        {/* <div className="task border-2 border-red-500">
            <ControlledCheckbox />
            <Task />
            <Button variant="contained">Submit</Button>
          </div>
          <div className="task">
            <ControlledCheckbox />
            <Task />
            <Button variant="contained">Submit</Button>
          </div>
          <div className="task">
            <ControlledCheckbox />
            <Task />
            <Button variant="contained">Submit</Button>
          </div> */}
        {/* </Stack> */}
        {/* </Pape
        r> */}
      </div>
    </Box>
  );
}
