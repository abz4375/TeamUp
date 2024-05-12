import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { useEffect } from "react";
// import { connectDB } from "../../config/db";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Up",
  description: "Team Up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   const connect = async () => await connectDB();
  //   connect();
  // }, []);
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
