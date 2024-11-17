"use client";

import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailId, setEmailId] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Please Confirm the Password");
      return;
    }

    const data = {
      firstName,
      lastName,
      username,
      emailId,
      password,
    };
    const baseURL = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const url = `${baseURL}/api/sign-up`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    //   console.log(response);

      if (response.ok) {
        const responseJson = await response.json();
        console.log("Signup successful:", responseJson);
        // Handle successful signup (e.g., redirect to login page)
      } else {
        console.error("Signup failed:", response.statusText);
        // Handle signup errors (e.g., display error message)
      }
    } catch (error) {
      console.error("Error during signup:", error);
      // Handle network or other errors
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f4f3",
        minHeight: "100vh",

        margin: "0px",
        padding: "0px",
      }}
    >
      <div
        style={{
          borderStyle: "double",
          borderRadius: "5px",
          minWidth: "60vw",
          backgroundColor: "white",
        }}
      >
        <div>
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            borderRadius={2}
          >
            <h2>SignUp</h2>
            <TextField
              margin="normal"
              id="name"
              placeholder="First name"
              type={"text"}
              name="firstName"
              onChange={(e) => {
                e.preventDefault;
                setFirstName(e.target.value);
              }}
              //    / value={details.name}
              //     autoComplete="name"
              //     helperText={errors.name && "Name is required."}
              //     error={errors.name}
              //     autoFocus
              style={{ width: "50%", minHeight: "20px" }}
            />
            <TextField
              margin="normal"
              id="name"
              placeholder="Last name"
              type={"text"}
              name="lastName"
              //    / value={details.name}
              onChange={(e) => {
                e.preventDefault;
                setLastName(e.target.value);
              }}
              //     autoComplete="name"
              //     helperText={errors.name && "Name is required."}
              //     error={errors.name}
              //     autoFocus
              style={{ width: "50%", minHeight: "20px" }}
            />
            <TextField
              margin="normal"
              id="name"
              placeholder="username"
              type={"text"}
              name="username"
              //    / value={details.name}
              onChange={(e) => {
                e.preventDefault;
                setUsername(e.target.value);
              }}
              //     autoComplete="name"
              //     helperText={errors.name && "Name is required."}
              //     error={errors.name}
              //     autoFocus
              style={{ width: "50%", minHeight: "20px" }}
            />
            <TextField
              margin="normal"
              id="email"
              placeholder="Email"
              autoComplete="email"
              name="email"
              // value={details.email}
              // error={errors.email}
              // helperText={errors.email && "Email is required."}
              onChange={(e) => {
                e.preventDefault;
                setEmailId(e.target.value);
              }}
              // autoFocus
              sx={{ width: "50%", minHeight: "20px" }}
            />
            {/* <TextField
                            margin="normal"
                            // required

                            id="mobileNum"
                            placeholder="Mobile number"
                            type={"text"}
                            name="mobileNum"
                            // value={details.mobileNum}
                            // error={errors.mobileNum}
                            // helperText={
                            //     errors.mobileNum && "Mobile number is required."
                            // }
                            // onChange={changeHandler}
                            // autoComplete="mobileNum"
                            sx={{ width: "50%", minHeight: "20px" }}
                        /> */}
            <TextField
              margin="normal"
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              // value={details.password}
              // error={errors.password}
              // helperText={errors.password && "Password is required."}
              onChange={(e) => {
                e.preventDefault;
                setPassword(e.target.value);
              }}
              autoComplete="password"
              sx={{ width: "50%", minHeight: "20px" }}
            />
            <TextField
              margin="normal"
              placeholder="Confirm password"
              name="confirmPassword"
              // value={details.confirmPassword}
              onChange={(e) => {
                e.preventDefault;
                setConfirmPassword(e.target.value);
              }}
              type="password"
              // error={errors.confirmPassword}
              // helperText={
              //     (details.confirmPassword.length > 0 &&
              //         details.confirmPassword !== details.password &&
              //         "This does not match with password.") ||
              //     (errors.confirmPassword &&
              //         "Please confirm the password")
              // }
              sx={{ width: "50%", minHeight: "20px" }}
            />
            <Button
              sx={{
                marginTop: 1,
                marginBottom: 2,
                width: "50%",
                height: "50px",
              }}
              style={{
                borderRadius: 3,
                backgroundColor: "black",
                padding: "10px 10px",
                fontSize: "20px",
              }}
              variant="contained"
              onClick={handleSignUp}
            >
              SignUp
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
