import React, { useState } from "react";

interface EnhancedPromptSectionProps {
  enhancedPrompt: string;
  onPromptChange: (newPrompt: string) => void;
}

const EnhancedPromptSection: React.FC<EnhancedPromptSectionProps> = ({
  enhancedPrompt,
  onPromptChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onPromptChange(event.target.value);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Enhanced Prompt</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      {isExpanded && (
        <textarea
          value={enhancedPrompt}
          onChange={handlePromptChange}
          className="w-full h-64 p-2 border border-gray-300 rounded"
        />
      )}
    </div>
  );
};

export default EnhancedPromptSection;
