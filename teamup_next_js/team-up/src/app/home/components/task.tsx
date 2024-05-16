import React,{useState,useEffect} from 'react';
import {Box, Checkbox, FormControlLabel, FormGroup, Paper, Stack} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Stack from '@mui/material/Stack';

export default function Task(props:any) {
  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }
  return (
    <div className="task border-2 border-gray-400 rounded-md bg-gray-200 w-11/12 h-14 mx-auto mt-4 flex flex-row">
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
                  
                />
              }
              label={props.desc}
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
        </div>
  );
}