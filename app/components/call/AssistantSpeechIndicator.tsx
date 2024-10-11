import React from "react";

interface AssistantSpeechIndicatorProps {
  isSpeaking: boolean;
}

const AssistantSpeechIndicator: React.FC<AssistantSpeechIndicatorProps> = ({ isSpeaking }) => {
  return (
    <div className="flex items-center mb-2">
      <div
        className={`w-5 h-5 mr-2 rounded ${
          isSpeaking ? "bg-[#3ef07c]" : "bg-[#f03e3e]"
        }`}
      />
      <p className="text-white m-0">
        {isSpeaking ? "Assistant speaking" : "Assistant not speaking"}
      </p>
    </div>
  );
};

export default AssistantSpeechIndicator;