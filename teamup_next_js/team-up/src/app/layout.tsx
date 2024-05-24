import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import mongoose from "mongoose";
// import { useEffect } from "react";
// import { connectDB } from "../../config/db";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Up",
  description: "Team Up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const connect = async () =>{
    await mongoose.connect(process.env.MONGODB_URI + "");
    // console.log('mongodb connected');

  }
  connect();
  return (
    <html lang="en">
      {/* <body> */}
      <body>{children}</body>
    </html>
  );
}
