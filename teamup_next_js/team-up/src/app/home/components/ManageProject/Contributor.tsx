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

  useEffect(() => {
    const fetchData = async () => {
      if (fetchAgain && contributorEmailId) {
        const response = await fetch(
          "http://localhost:3000/api/user-search?t=" + contributorEmailId
        );
        if (response.ok) {
          const responseJson = await response.json();

          if (await responseJson[0]) {
            setContributorInfo(await responseJson[0]);
            setFetchAgain(false);
          }
        } else if (response.status === 404) {
          console.error("Fetch failed:", response.statusText);
          setFetchAgain(false);
        } else {
          setFetchAgain(true);
        }
      }
    };

    fetchData();
  }, [contributorEmailId]);

  return (
    <Tooltip title={contributorEmailId}>
      <div
        className={`p-2 text-lg font-light mx-1 mt-1 shadow-sm flex flex-row hover:shadow-md transition-all hover:cursor-pointer
        ${
          isDarkMode
            ? "bg-dark-bg-secondary text-dark-text border-0 border-dark-border hover:border-dark-border-hover"
            : "bg-white text-black border-2 border-gray-200 hover:border-gray-300"
        }`}
      >
        <Avatar src={contributorInfo.profilePic} className="my-auto mr-2" />
        <span className="my-auto overflow-x-hidden">
          {contributorInfo.name}
        </span>
      </div>
    </Tooltip>
  );
};

export default Contributor;
