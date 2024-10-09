import React, { useState, useEffect } from "react";

interface EnhancedPromptSectionProps {
  userQuery: string;
  onPromptChange: (newPrompt: string) => void;
}

const EnhancedPromptSection: React.FC<EnhancedPromptSectionProps> = ({
  userQuery,
  onPromptChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    // Here, you would typically call your backend to generate the enhanced prompt
    // For now, we'll use a simple template
    const enhancedPrompt = `You are a helpful voice assistant named Vapi. Your primary goal is to assist with pizza orders.

User Query: ${userQuery}

Based on the user's query, your response should:
1. Address the specific topic or question raised
2. Provide clear and concise information about our pizza menu
3. Use a friendly and engaging tone suitable for voice interaction
4. Guide the user towards placing an order if appropriate

Remember to speak naturally and use appropriate pauses and intonation in your responses.`;

    setPrompt(enhancedPrompt);
    onPromptChange(enhancedPrompt);
  }, [userQuery, onPromptChange]);

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
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
          value={prompt}
          onChange={handlePromptChange}
          className="w-full h-64 p-2 border border-gray-300 rounded"
        />
      )}
    </div>
  );
};

export default EnhancedPromptSection;
