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
import Logout from "@mui/icons-material/Logout";
import { signOutBtnFunc } from "./signOut";
import './profile.css';
import { red } from "@mui/material/colors";

interface ProfileProps {
  userInfo: {
    name: string;
    profilePic: string;
  };
  isDarkMode: boolean;
}

export default function Profile({ userInfo, isDarkMode }: ProfileProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    document.getElementById("LogOutBtn")?.click();
  };

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
        <Tooltip title={userInfo.name}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={userInfo.profilePic}
              sx={{ width: 42, height: 42 }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        className={`menuProfile ${isDarkMode ? 'dark' : ''}`}
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '0.5rem',
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            bgcolor: isDarkMode ? 'rgb(31, 41, 55)' : 'background.paper',
            color: isDarkMode ? 'rgb(229, 231, 235)' : 'inherit',
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
              bgcolor: isDarkMode ? 'rgb(31, 41, 55)' : 'background.paper',
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disableRipple disableTouchRipple className={`flex m-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <span className="m-auto font-bold">{userInfo.name}</span>
        </MenuItem>
        <MenuItem onClick={handleClose} className={`m-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
          <Avatar /> Manage Profile
        </MenuItem>
        <Divider sx={{ bgcolor: isDarkMode ? 'rgb(75, 85, 99)' : 'inherit' }} />
        <MenuItem 
          disableRipple 
          disableTouchRipple 
          onClick={handleLogout} 
          className={`m-1 mb-0 rounded transition text-lg flex ${
            isDarkMode 
              ? 'hover:bg-red-900 active:bg-red-800 text-white' 
              : 'hover:bg-red-50 active:bg-red-100 text-red-700'
          }`}
        >
          <ListItemIcon sx={{color: isDarkMode ? 'rgb(248, 113, 113)' : red[700]}}>
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
