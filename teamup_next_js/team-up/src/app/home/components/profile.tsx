"use client";
import * as React from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
// import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Tooltip from '@mui/material/Tooltip';
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import { signOutBtnFunc } from "./signOut";

import './profile.css';
import { red } from "@mui/material/colors";

// interface ProfileProps {
//   userInfo: any;
// }

export default function Profile(props: any) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    // await signOut({redirectTo:'/log-in'});
    document.getElementById("LogOutBtn")?.click();
  };
  // console.log('props recieved:' , props.userInfo)

  return (
    <React.Fragment>
      <Box
        sx={{
          marginLeft: "-13px",
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography sx={{ minWidth: 0 }}></Typography>
        <Typography sx={{ minWidth: 0 }}></Typography>
        <Tooltip title={props.userInfo.name}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={props.userInfo.profilePic}
              sx={{ width: 42, height: 42 }}
            ></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
      className=" menuProfile"
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius:'0.5rem',
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disableRipple disableTouchRipple className="flex hover:bg-white m-1 rounded">
          {/* <Avatar src={props.userInfo.image} /> {props.userInfo.name} */}
          <span className="m-auto font-bold">{props.userInfo.name}</span>
        </MenuItem>
        <MenuItem onClick={handleClose} className="hover:bg-gray-200 m-1 rounded">
          <Avatar /> Manage Profile
        </MenuItem>
        <Divider />
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem disableRipple disableTouchRipple onClick={handleLogout} className="hover:bg-red-50 active:bg-red-100 m-1 mb-0 rounded transition text-red-700 text-lg flex">
          <ListItemIcon sx={{color:red[700]}}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <span className="mx-auto ml-1">Logout</span>
          <form action={signOutBtnFunc}>
            <button id="LogOutBtn" className="hidden"></button>
          </form>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
