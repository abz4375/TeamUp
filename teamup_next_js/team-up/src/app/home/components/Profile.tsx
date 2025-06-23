"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LogOut, UserCircle, Settings } from "lucide-react"; // Using UserCircle as a placeholder for "Manage Profile"
import { signOutBtnFunc } from "./signOut";

interface ProfileProps {
  userInfo: {
    name: string;
    profilePic: string;
  };
  isDarkMode: boolean; // isDarkMode might be used by parent for overall theme, not directly here if using shadcn's theme handling
}

export default function Profile({ userInfo, isDarkMode }: ProfileProps) {
  const handleLogout = async () => {
    // The form submission handles the actual logout
    document.getElementById("LogOutBtn")?.click();
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 1).toUpperCase();
    return names[0].substring(0, 1).toUpperCase() + names[names.length - 1].substring(0, 1).toUpperCase();
  };

  return (
    <TooltipProvider delayDuration={100}>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
                <ShadcnAvatar className="h-10 w-10 border-2 dark:border-slate-600 hover:opacity-90 transition-opacity">
                  <AvatarImage src={userInfo.profilePic} alt={userInfo.name} />
                  <AvatarFallback className="text-sm bg-slate-200 dark:bg-slate-700 dark:text-slate-200">
                    {getInitials(userInfo.name)}
                  </AvatarFallback>
                </ShadcnAvatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-slate-800 text-white border-slate-700">
            <p>{userInfo.name || "User Profile"}</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          className="w-56 mt-2 dark:bg-slate-800 dark:border-slate-700"
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal py-2 px-2 dark:text-slate-300">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userInfo.name || "User"}</p>
              {/* Can add email here if available and desired */}
              {/* <p className="text-xs leading-none text-muted-foreground">
                {userInfo.email}
              </p> */}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="dark:bg-slate-700" />
          {/* Placeholder for Manage Profile - can be linked to a settings page */}
          <DropdownMenuItem className="cursor-pointer dark:focus:bg-slate-700 dark:text-slate-200">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Manage Profile</span>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          {/* Placeholder for a settings item if needed
          <DropdownMenuItem className="cursor-pointer dark:focus:bg-slate-700 dark:text-slate-200">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          */}
          <DropdownMenuSeparator className="dark:bg-slate-700"/>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 dark:text-red-400 dark:focus:bg-red-900/50 dark:focus:text-red-300 focus:bg-red-50 focus:text-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Hidden form for logout */}
      <form action={signOutBtnFunc} className="hidden">
        <button id="LogOutBtn" type="submit"></button>
      </form>
    </TooltipProvider>
  );
}
