import React from 'react';

const ActiveCallDetail: React.FC<{
  assistantIsSpeaking: boolean;
  volumeLevel: number;
  onEndCallClick: () => void;
}> = ({ assistantIsSpeaking, volumeLevel, onEndCallClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <p>Assistant is {assistantIsSpeaking ? 'speaking' : 'listening'}</p>
          <p>Volume: {volumeLevel}</p>
        </div>
        <button
          onClick={onEndCallClick}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default ActiveCallDetail;
