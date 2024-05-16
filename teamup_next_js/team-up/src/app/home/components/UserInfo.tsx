'use client'
import React, { useState, useEffect } from 'react';
import { auth } from '../../../../auth';

export const UserInfo = () => {
  const [user, setUser] = useState<any>(null); // Initialize user state

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/api/auth/user');
      if (response.ok) {
        const responseJson = await response.json();
        setUser(responseJson.user)
        console.log("Fetch successful:", responseJson);
        // Handle successful fetch 
      } else {
        console.error("Fetch failed:", response.statusText);
        // Handle signup errors (e.g., display error message)
      }
    };

    fetchData(); // Call the function to fetch data on component mount
  }, []); // Empty dependency array to run effect only once

  return (
    <div>
      {user ? ( // Check if user exists before accessing properties
        <span>Name: {user?.name}</span>
      ) : (
        <span>Not logged in</span> // Display message if not logged in
      )}
    </div>
  );
};
