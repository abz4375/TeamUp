"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => void;
  isLoading?: boolean;
  className?: string;
}

export default function LoginForm({ onSubmit, isLoading, className }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8"
         style={{
           background: 'linear-gradient(to right, #2C2C54 50%, #F0F2F5 50%)', // Dark left, light right
           backgroundImage: `
             radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0),
             linear-gradient(to right, #2C2C54 50%, #F0F2F5 50%)
           `,
           backgroundSize: '20px 20px, 100% 100%', // Adjust grid size as needed
           backgroundPosition: '0 0, 0 0',
         }}
    >
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg"
           style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)' }} // Softer shadow
      >
        {/* Header: Welcome to Team Up! */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Icon - Updated SVG for the team-up icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5" // Adjusted stroke width for a bolder look
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12 text-indigo-600"
            style={{ color: '#6B46C1' }} // Purple color for the icon
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to <span className="text-indigo-600" style={{ color: '#6B46C1' }}>Team Up!</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
          {/* Email Address Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium sr-only">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium sr-only">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full h-11 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
            style={{
              background: 'linear-gradient(to right, #6B46C1, #805AD5)', // Purple gradient
              boxShadow: '0 4px 10px rgba(107, 70, 193, 0.25)', // Softer shadow
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 flex-shrink text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Sign In with Google Button */}
        <Button
          type="button"
          className="w-full h-11 bg-white border border-gray-300 text-gray-700 flex items-center justify-center space-x-2 shadow-sm transition-all duration-200"
          style={{
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)', // Softer shadow for Google button
            borderColor: '#E2E8F0', // Lighter border color
          }}
          onClick={() => console.log("Sign in with Google clicked")} // Placeholder for Google sign-in logic
        >
          {/* Google Icon SVG */}
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.307-7.439-7.399 0-4.093 3.344-7.399 7.439-7.399 2.181 0 4.156.884 5.642 2.305l3.056-3.056C19.451 3.237 16.262 2 12.24 2 6.863 2 2.203 6.46 2.203 12s4.66 10 10.037 10c5.868 0 9.484-4.28 9.484-9.757 0-.768-.068-1.495-.198-2.198H12.24z" />
          </svg>
          <span>Sign in with Google</span>
        </Button>
      </div>
    </div>
  );
}
