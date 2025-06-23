"use client";

import React, { useState } from "react";
import logo from "../assets/logo.png";
import { signInBtnFunc } from "../log-in/components/signInWithGoogle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailId, setEmailId] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please confirm your password.");
      return;
    }

    const data = {
      firstName,
      lastName,
      username,
      emailId,
      password,
    };

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseJson = await response.json();
        console.log("Signup successful:", responseJson);
        // Handle successful signup (e.g., redirect to login page or show a success message)
        alert("Sign up successful! Please log in.");
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmailId("");
        setPassword("");
        setConfirmPassword("");
        // Consider redirecting: window.location.href = '/log-in';
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", response.statusText, errorData);
        alert(`Sign up failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An unexpected error occurred during sign up. Please try again.");
    }
  };

  return (
    <div className="flex w-screen min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 dark:from-slate-900 dark:via-sky-950 dark:to-indigo-950">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-8 sm:p-10 mx-4 my-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <img src={logo.src} alt="logo" className="w-16 h-16 sm:w-20 sm:h-20" />
          <h1 className="text-center text-3xl sm:text-4xl font-light text-slate-700 dark:text-slate-200">
            Join <span className="font-semibold text-blue-600 dark:text-blue-400">Team Up</span>!
          </h1>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                First Name
              </label>
              <Input
                id="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11 text-base"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Last Name
              </label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 text-base"
              />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Username
            </label>
            <Input
              id="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11 text-base"
            />
          </div>
          <div>
            <label htmlFor="emailId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email address
            </label>
            <Input
              id="emailId"
              type="email"
              placeholder="you@example.com"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              required
              className="h-11 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 text-base"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-11 text-base"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              or sign up with
            </span>
          </div>
        </div>

        {/* Google Sign Up Button */}
        <form action={signInBtnFunc} className="w-full">
          <Button
            type="submit"
            variant="outline"
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="google-logo"
              className="w-5 h-5 mr-3"
            />
            Sign Up with Google
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <a href="/log-in" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
