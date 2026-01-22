"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react" // Assumes lucide-react is installed
import { useTheme } from "next-themes" // Assumes next-themes is installed

import { Button } from "@/components/ui/button" // Assumes shadcn/ui Button

export default function ModeToggle() {
  const { theme, setTheme } = useTheme() // Get both theme and setTheme

  // Function to toggle between light and dark themes
  const handleToggle = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      // If current theme is light or system, switch to dark
      setTheme("dark")
    }
  }

  return (
    // The button now directly triggers the theme toggle
    <Button variant="outline" size="icon" className="cursor-pointer" onClick={handleToggle}>
      {/* Sun icon visible in light mode, hidden in dark mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      {/* Moon icon hidden in light mode, visible in dark mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
