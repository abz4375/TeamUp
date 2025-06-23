"use client";

import React from "react";
import logo from "../assets/logo.png";
import { signInBtnFunc } from "./components/signInWithGoogle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const [gLoading, setGLoading] = React.useState(false); // This state is not used

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your email login logic here
    console.log("Email login attempt with:", email, password);
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 dark:from-slate-900 dark:via-sky-950 dark:to-indigo-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-8 sm:p-10 mx-4">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-4 mb-10">
          <img src={logo.src} alt="logo" className="w-16 h-16 sm:w-20 sm:h-20" />
          <h1 className="text-center text-3xl sm:text-4xl font-light text-slate-700 dark:text-slate-200">
            Welcome to <span className="font-semibold text-blue-600 dark:text-blue-400">Team Up</span>!
          </h1>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6 mb-8">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-base"
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
              className="h-12 text-base"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
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
            Sign In with Google
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
