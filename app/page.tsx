"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import Vapi from "@vapi-ai/web";
import ActiveCallDetail from "./components/ActiveCallDetail";
import Button from "./components/base/Button";
import { isPublicKeyMissingError } from "./utils";
import { Anthropic } from "@anthropic-ai/sdk";
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

// Use a pre-created assistant ID
const ASSISTANT_ID = "e4e0c8ca-6298-4c8a-9851-a3d5fb0d6992";

// UserInputSection component (updated)
const UserInputSection = () => {
  const [connecting, setConnecting] = useState(false);

  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } =
    usePublicKeyInvalid();

  const [userQuery, setUserQuery] = useState("");
  const [enhancedQuery, setEnhancedQuery] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

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
  }, [setShowPublicKeyInvalidMessage]);

  const startCallInline = async () => {
    setConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone access granted:", stream);

      // Create the full agent prompt by combining the template and enhanced query
      const fullAgentPrompt = `
You are a voice assistant for ${userQuery}, a business located on the Internet.

Your job is to assist customers calling in. Be friendly, helpful, and efficient in your responses.

1) Introduce yourself and the business when answering the call.
2) Ask how you can help the customer today.
3) Listen to the customer's request and respond appropriately.
4) If the customer goes off-topic, politely steer the conversation back to how you can assist them.
5) Once you've addressed the customer's needs, politely conclude the conversation.

Remember:
- Be kind of funny and witty!
- Keep all your responses short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
      `;

      // Update assistantOptions with the new agent prompt
      const updatedAssistantOptions = {
        ...assistantOptions,
        model: {
          ...assistantOptions.model,
          messages: [
            {
              role: "system",
              content: fullAgentPrompt,
            },
          ],
        },
      };

      vapi.start(updatedAssistantOptions);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setConnecting(false);
      alert(
        "Microphone access is required for this application to work. Please allow microphone access and try again."
      );
    }
  };

  const endCall = () => {
    vapi.stop();
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
          className="w-full p-2 border rounded-lg"
        />
        <div className="flex gap-4 mt-2">
          <button
            onClick={enhanceQuery}
            disabled={isEnhancing}
            className={`flex-1 bg-[#5FFECA] text-black p-2 rounded-lg ${
              isEnhancing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {isEnhancing ? "Creating..." : "Enhance"}
          </button>
          <Button
            label="Start Call with Enhanced Assistant"
            onClick={startCallInline}
            isLoading={connecting}
            disabled={!enhancedQuery && !userQuery}
            className="flex-1"
          />
        </div>
      </div>
      {enhancedQuery && (
        <div className="mt-4">
          <h3 className="font-bold">Enhanced Query:</h3>
          <p>{enhancedQuery}</p>
        </div>
      )}
    </div>
  );
};

// Update the assistantOptions object
const assistantOptions = {
  name: "",
  firstMessage: "Hello, How can I help you today?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer",
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "", // This will be filled with the enhanced query
      },
    ],
  },
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
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start h-full">
        {/* Left half: Spline Animation */}
        <div className="w-full aspect-square md:aspect-auto md:h-[calc(100vh-4rem)] relative">
          <SplineAnimation isPlaying={isPlaying} />
          {/* <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {isPlaying ? "Pause Animation" : "Play Animation"}
          </button> */}
        </div>

        {/* Right half: User Input Section */}
        <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
          <div className="flex flex-col items-center gap-4 max-w-md">
            <Image
              className=""
              src="/vapi.png"
              alt="Vapi logo"
              width={180}
              height={38}
              priority
            />
            <div className="text-center">
              Enter a prompt like &quot;Bob at Boba Store&quot; and press the
              &quot;button enhance&quot; prompt.
            </div>
            <UserInputSection />
          </div>
        </div>
      </main>
    </div>
  );
}
