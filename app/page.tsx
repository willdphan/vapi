"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Vapi from "@vapi-ai/web";
import Button from "./components/base/Button";
import { isPublicKeyMissingError } from "./utils";
import { useState, useEffect } from "react";

// Dynamically import the SplineAnimation component
const SplineAnimation = dynamic(() => import("./components/SplineAnimation"), {
  ssr: false,
  loading: () => <p>Loading 3D model...</p>,
});

const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
// Initialize Vapi with your public key
const vapi = new Vapi(apiKey);

// Log Vapi instance to check its configuration
console.log("Vapi instance:", vapi);

// Near the top of your file, after imports
console.log("API Key:", apiKey); // Remove this in production

// UserInputSection component (updated)
const UserInputSection = ({
  setConnected,
  setMicActive,
  setAssistantIsSpeaking,
  setVolumeLevel,
}: {
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setMicActive: React.Dispatch<React.SetStateAction<boolean>>;
  setAssistantIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>;
  setVolumeLevel: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [connecting, setConnecting] = useState(false);

  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } =
    usePublicKeyInvalid();

  const [userQuery, setUserQuery] = useState("");
  const [enhancedQuery, setEnhancedQuery] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("Vapi call started");
      setConnecting(false);
      setConnected(true);
      setShowPublicKeyInvalidMessage(false);
      setMicActive(true);
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
      setShowPublicKeyInvalidMessage(false);
      setMicActive(false);
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, [
    setShowPublicKeyInvalidMessage,
    setConnected,
    setMicActive,
    setAssistantIsSpeaking,
    setVolumeLevel,
  ]);

  const startCallInline = async () => {
    setConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted:", stream);

      const updatedAssistantOptions = {
        model: {
          provider: "openai" as const,
          model: "gpt-3.5-turbo" as const, // Specify the exact model name
          messages: [
            { role: "system" as const, content: enhancedQuery },
            { role: "user" as const, content: "Hello" },
          ],
        },
        name: "Ava",
        firstMessage: "Hello, I'm Ava. How can I assist you today?",
        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "en-US" as const,
        },
        voice: {
          provider: "11labs" as const,
          voiceId: "paula",
        },
      };

      await vapi.start(updatedAssistantOptions);
    } catch (error) {
      console.error("Error starting call:", error);
      setConnecting(false);
    }
  };

  const enhanceQuery = async () => {
    setIsEnhancing(true);
    try {
      // Create a new template based on the user's input
      const customTemplate = `
You are ${userQuery}. Your persona is that of a seasoned customer support agent in your early 30s, combining deep technical knowledge with strong emotional intelligence. Your voice is clear, warm, and engaging, with a neutral accent for widespread accessibility.

Your primary role is to serve as a dynamic training platform for customer support agents, simulating a broad array of service scenarios—from basic inquiries to intricate problem-solving challenges. Your advanced programming allows you to replicate diverse customer service situations, making you an invaluable tool for training purposes.

Major Mode of Interaction:
You interact mainly through audio, adeptly interpreting spoken queries and replying in kind. This capability makes you an excellent resource for training agents, preparing them for live customer interactions. You're engineered to recognize and adapt to the emotional tone of conversations, allowing trainees to practice managing emotional nuances effectively.

Training Instructions:
1. Encourage trainees to practice active listening by acknowledging every query with confirmation of your engagement, e.g., "Yes, I'm here. How can I help?"
2. Emphasize the importance of clear, empathetic communication, tailored to the context of each interaction.
3. Demonstrate how to handle complex or vague customer queries by asking open-ended questions for clarification, without appearing repetitive or artificial.
4. Teach trainees to express empathy and understanding, especially when customers are frustrated or dissatisfied, ensuring issues are addressed with care and a commitment to resolution.
5. Prepare agents to escalate calls smoothly to human colleagues when necessary, highlighting the value of personal touch in certain situations.

Your overarching mission is to enhance the human aspect of customer support through comprehensive scenario-based training. You're not merely an answer machine but a sophisticated platform designed to foster the development of knowledgeable, empathetic, and adaptable customer support professionals.

Remember:
- Adapt your responses to simulate various customer personalities and scenarios.
- Provide constructive feedback to trainees after each interaction.
- Use a warm, engaging tone while maintaining professionalism.
- Keep your responses concise and relevant to the current training scenario.
- Encourage trainees to think critically and problem-solve independently.
      `;

      setEnhancedQuery(customTemplate);
    } catch (error) {
      console.error("Error enhancing query:", error);
      setEnhancedQuery("Error: Unable to enhance query. Please try again.");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full">
      {showPublicKeyInvalidMessage && <PleaseSetYourPublicKeyMessage />}

      <div className="">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Create Voice Assistant"
          className="w-full p-2 border rounded-lg text-black"
        />
        <div className="flex gap-4 mt-5 ">
          <button
            onClick={enhanceQuery}
            disabled={isEnhancing}
            className={`flex-1 bg-[#5FFECA] text-black p-2 rounded-lg ${
              isEnhancing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#1B6882]"
            }`}
          >
            {isEnhancing ? "Creating..." : "Enhance"}
          </button>
          <Button
            label="Start Call with Enhanced Assistant"
            onClick={startCallInline}
            isLoading={connecting}
            disabled={!enhancedQuery && !userQuery}
          />
        </div>
      </div>
      {enhancedQuery && (
        <div className="mt-4 text-center">
          <h3 className="font-bold mb-[-1em] z-[99] bg-[#0A0A0A]">
            Enhanced Query
          </h3>
          <div
            className={`${
              showFullPrompt
                ? "max-h-80 overflow-y-auto"
                : "max-h-20 overflow-hidden"
            } transition-all duration-300 ease-in-out`}
          >
            <p className="whitespace-pre-wrap">{enhancedQuery}</p>
          </div>
          <button
            onClick={() => setShowFullPrompt(!showFullPrompt)}
            className="mt-2 text-[#5FFECA] hover:text-[#1B6882]"
          >
            {showFullPrompt ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

const usePublicKeyInvalid = () => {
  const [showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage] =
    useState(false);

  // close public key invalid message after delay
  useEffect(() => {
    if (showPublicKeyInvalidMessage) {
      setTimeout(() => {
        setShowPublicKeyInvalidMessage(false);
      }, 3000);
    }
  }, [showPublicKeyInvalidMessage]);

  return {
    showPublicKeyInvalidMessage,
    setShowPublicKeyInvalidMessage,
  };
};

const PleaseSetYourPublicKeyMessage = () => {
  return (
    <div className="fixed bottom-6 left-6 p-3 bg-red-500 text-white rounded-md shadow-md">
      Is your Vapi Public Key missing? (recheck your code)
    </div>
  );
};

export default function Home() {
  const [isPlaying] = useState(true);
  const [connected, setConnected] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col md:grid md:grid-cols-2 h-screen">
        {/* Spline Animation */}
        <div className="w-full h-1/2 md:h-full relative">
          <SplineAnimation isPlaying={isPlaying} />
        </div>

        {/* User Input Section */}
        <div className="flex flex-col justify-center items-center h-1/2 md:h-full p-4 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <Image
              className="w-32 md:w-44"
              src="/vapi.png"
              alt="Vapi logo"
              width={180}
              height={38}
              priority
            />
            <div className="text-center text-sm md:text-base">
              Enter a prompt like &quot;Bob at Boba Store&quot;, press
              &quot;enhance&quot; to enhance prompt, then talk to the voice
              assistant!
            </div>
            <UserInputSection
              setConnected={setConnected}
              setMicActive={setMicActive}
              setAssistantIsSpeaking={setAssistantIsSpeaking}
              setVolumeLevel={setVolumeLevel}
            />
            {connected && (
              <div>
                <p>Connection status: {connected ? 'Connected' : 'Disconnected'}</p>
                <p>Microphone: {micActive ? 'Active' : 'Inactive'}</p>
                <p>Assistant: {assistantIsSpeaking ? 'Speaking' : 'Not speaking'}</p>
                <p>Volume level: {volumeLevel}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}