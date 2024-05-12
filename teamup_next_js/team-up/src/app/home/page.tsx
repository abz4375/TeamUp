'use client'
import React, { useEffect } from "react";
import Sidebar from "./components/sidebar";
import Profile from "./components/profile";
import ProjectPane from "./components/projectpane";
import TaskPane from "./components/taskpane";
import "./home.css";
// import { connectDB } from "../../../db.js";

const Home = () => {
  // useEffect(() => {
  //   try {
  //     connectDB(); // Call the connection function
  //   } catch (error) {
  //     console.error('Error connecting to MongoDB:', error);
  //     // Display a user-friendly message or handle the error further
  //   }
  // }, []);
  return (
    <div>
      Home
      <div className="container">
        <Sidebar />
        <div className="mainFrame">
          <div className="middleFrame">
            <div className="projectpane"><ProjectPane /></div>
            <div className="taskpane"><TaskPane /></div>
          </div>
          <div className="profile">
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
