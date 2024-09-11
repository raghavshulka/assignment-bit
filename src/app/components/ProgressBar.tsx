"use client";
import React from "react";

interface ProgressBarProps {
  progress: number;
  fillColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, fillColor }) => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full gap-4 ">
      {/* Progress Container */}
      <div className="flex  justify-between items-center w-full space-x-4">
        {/* Progress Bar */}
        <div className="flex-grow bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-full text-center text-white rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: fillColor,
            }}
          />
        </div>
        {/* Display Progress */}
        <p className="text-sm font-semibold text-gray-700">{progress}%</p>
      </div>
    </div>
  );
};

export default ProgressBar;
