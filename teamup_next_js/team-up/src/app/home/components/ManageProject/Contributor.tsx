// components/Contributor.tsx
import React, { useState, useEffect } from 'react';
import { Avatar, Tooltip } from "@mui/material";

interface ContributorProps {
  contributorEmailId: string;
  isDarkMode: boolean;
}

const Contributor: React.FC<ContributorProps> = ({ contributorEmailId, isDarkMode }) => {
  const [fetchAgain, setFetchAgain] = useState(true);
  const [contributorInfo, setContributorInfo] = useState({
    name: "",
    profilePic: "",
  });

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/user?emailId=${contributorEmailId}`);
      if (!response.ok) throw new Error('Failed to fetch contributor data');
      
      const data = await response.json();
      setContributorInfo({
        name: data.name || "",
        profilePic: data.profilePic || "",
      });
      setFetchAgain(false);
    } catch (error) {
      console.error("Error fetching contributor data:", error);
      setFetchAgain(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contributorEmailId]);

  return (
    <Tooltip title={contributorEmailId}>
      <div
        className={`p-2 text-sm md:text-lg flex flex-row items-center justify-start 
          mx-1 mt-1 shadow-sm hover:shadow-md transition-all hover:cursor-pointer
          w-full md:w-auto min-w-[150px] max-w-full
          ${
            isDarkMode
              ? "bg-dark-bg-secondary text-dark-text border-0 border-dark-border hover:border-dark-border-hover"
              : "bg-white text-black border-2 border-gray-200 hover:border-gray-300"
          }`}
      >
        <Avatar 
          src={contributorInfo.profilePic} 
          className="w-6 h-6 md:w-8 md:h-8 my-auto mr-2 flex-shrink-0" 
        />
        <span className="my-auto truncate flex-1 overflow-hidden">
          {contributorInfo.name}
        </span>
      </div>
    </Tooltip>
  );
};

export default Contributor;
