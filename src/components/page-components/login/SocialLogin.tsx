"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chrome, Github, Twitter } from "lucide-react";
import Image from "next/image";
import googleLogo from "@/assets/login/google-logo.svg";

interface SocialLoginProps {
  onGoogleLogin: () => void;
  onGithubLogin?: () => void;
  onTwitterLogin?: () => void;
  className?: string;
}

export function SocialLogin({ 
  onGoogleLogin, 
  onGithubLogin, 
  onTwitterLogin, 
  className 
}: SocialLoginProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleLogin}
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <Image
            src={googleLogo}
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="hidden sm:inline">Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onGithubLogin}
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <Github className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onTwitterLogin}
          className="w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <Twitter className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>
      </div>
    </div>
  );
}
