import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

interface TaskProps {
  desc: string;
  isDarkMode: boolean;
}

export default function Task({ desc, isDarkMode }: TaskProps) {
  const [loading, setLoading] = React.useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }

  return (
    <div className={`task border-2 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-400 bg-gray-200'} rounded-md w-11/12 h-14 mx-auto mt-4 flex flex-row`}>
      <FormGroup>
        <FormControlLabel
          className="ml-5 my-auto"
          control={
            <Checkbox
              disableRipple
              sx={{
                color: isDarkMode ? "white" : "black",
                "&.Mui-checked": {
                  color: isDarkMode ? "white" : "black",
                },
              }}
            />
          }
          label={<span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{desc}</span>}
        />
      </FormGroup>
      <LoadingButton
        size="small"
        className="h-3/5 my-auto ml-auto mr-5"
        loading={loading}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
        onClick={handleClick}
        sx={{
          color: 'white',
          borderColor: isDarkMode ? 'gray' : 'black',
          background: isDarkMode ? 'gray' : 'black',
          '&:hover': {
            color: 'white',
            background: isDarkMode ? 'darkgray' : 'gray',
            borderColor: isDarkMode ? 'darkgray' : 'gray'
          }
        }}
      >
        Submit
      </LoadingButton>
    </div>
  );
}
