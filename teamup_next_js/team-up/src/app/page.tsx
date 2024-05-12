'use client'
import { useEffect } from 'react';
import { connectDB } from '../../config/db';
import app from 'next/server';
export default function Home() {
  useEffect(() => {
    const connect = async () => await connectDB();
    connect();
  }, []);
  return (
    <></>
  );
}
