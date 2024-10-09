import React from "react";

const numBars = 10;

const VolumeLevel = ({ volume }) => {
  return (
    <div className="p-5">
      <div className="text-white mb-2">
        <p>Volume Level:</p>
      </div>
      <div className="flex mb-2">
        {Array.from({ length: numBars }, (_, i) => (
          <div
            key={i}
            className={`w-5 h-5 m-0.5 rounded ${
              i / numBars < volume ? "bg-[#3ef07c]" : "bg-white"
            }`}
          />
        ))}
      </div>
      <div className="text-white">{volume}</div>
    </div>
  );
};

export default VolumeLevel;