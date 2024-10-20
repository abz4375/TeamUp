import React from "react";
import Task from "./Task";
import "./taskpane.css";

interface TaskPaneProps {
  tasks: any[];
  isDarkMode: boolean;
}

export default function TaskPane({ tasks, isDarkMode }: TaskPaneProps) {
  return (
    <div className={`ml-5 mt-2 mr-1 w-full h-full pt-2 pb-4 paperTask border-2 ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'} rounded-lg grid overflow-auto mx-auto`}>
      <span className={`ml-5 text-3xl text-center mt-2 font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        Pending Tasks
      </span>
      
      {tasks && tasks.map((task, index) => (
        <Task key={index} desc={task.description} isDarkMode={isDarkMode} />
      ))}
      
      {(!tasks || tasks.length === 0) && (
        <div className={`m-auto text-5xl font-light my-4 opacity-50 ${isDarkMode ? 'text-green-400' : 'text-green-500'} font-mono`}>
          🎉 No Pending Tasks!
        </div>
      )}
    </div>
  );
}
