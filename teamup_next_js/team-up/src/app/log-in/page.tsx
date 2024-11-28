"use client";

import React from "react";
import logo from "../assets/logo.png";
import { signInBtnFunc } from "./components/signInWithGoogle";
import { TextField } from "@mui/material";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [gLoading, setGLoading] = React.useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your email login logic here
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mx-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <img src={logo.src} alt="logo" className="w-12 h-12 sm:w-10 sm:h-10" />
          <span className="text-center text-2xl sm:text-3xl font-light">
            Welcome to <span className="font-semibold">Team Up</span>!
          </span>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                     font-semibold rounded-lg transition 
                     flex items-center justify-center
                     shadow-sm hover:shadow focus:outline-none focus:ring-2 
                     focus:ring-blue-300 focus:ring-opacity-50"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <form action={signInBtnFunc} className="w-full">
          <button
            type="submit"
            className="w-full bg-blue-100 hover:bg-blue-200 px-6 py-3 
                     text-gray-800 font-semibold rounded-lg transition 
                     flex items-center justify-center gap-3 
                     shadow-sm hover:shadow focus:outline-none focus:ring-2 
                     focus:ring-blue-300 focus:ring-opacity-50"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="google-logo"
              className="w-6 h-6"
            />
            <span className="whitespace-nowrap">Sign In with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
