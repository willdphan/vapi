import React from "react";
// Assuming the correct paths are as follows:
import AssistantSpeechIndicator from "./call/AssistantSpeechIndicator";
import Button from "./base/Button";
import VolumeLevel from "./call/VolumeLevel";

const ActiveCallDetail = ({
  assistantIsSpeaking,
  volumeLevel,
  onEndCallClick,
}) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md shadow-md w-[400px] h-[200px]">
        <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
        <VolumeLevel volume={volumeLevel} />
      </div>
      <div className="mt-5 text-center">
        <Button label="End Call" onClick={onEndCallClick} />
      </div>
    </div>
  );
};

export default ActiveCallDetail;
