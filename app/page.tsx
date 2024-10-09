"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Vapi from "@vapi-ai/web";
import ActiveCallDetail from "./components/ActiveCallDetail";
import Button from "./components/base/Button";
import { isPublicKeyMissingError } from "./utils";
import EnhancedPromptSection from "./components/EnhancedPromptSelection";

// Dynamically import the SplineAnimation component
const SplineAnimation = dynamic(() => import("./components/SplineAnimation"), {
  ssr: false,
  loading: () => <p>Loading 3D model...</p>,
});

// Initialize Vapi with your public key
const vapi = new Vapi("f01641f9-77a0-49a5-976f-723273b4dea7");

// Log Vapi instance to check its configuration
console.log("Vapi instance:", vapi);

// Near the top of your file, after imports
const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
console.log("API Key:", apiKey); // Remove this in production

// Use a pre-created assistant ID
const ASSISTANT_ID = "e4e0c8ca-6298-4c8a-9851-a3d5fb0d6992";

// UserInputSection component (updated)
const UserInputSection = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } =
    usePublicKeyInvalid();

  const [micActive, setMicActive] = useState(false);
  const [micPermission, setMicPermission] = useState("prompt");
  const [userQuery, setUserQuery] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");

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
      vapi.start({
        ...assistantOptions,
        model: {
          ...assistantOptions.model,
          messages: [
            {
              role: "system",
              content:
                enhancedPrompt || assistantOptions.model.messages[0].content,
            },
          ],
        },
      });
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

  return (
    <div className="w-full">
      <input
        type="text"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder="Enter your query for the voice agent"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <EnhancedPromptSection
        userQuery={userQuery}
        onPromptChange={setEnhancedPrompt}
      />
      {!connected ? (
        <Button
          label="Call Vapi's Pizza Front Desk"
          onClick={startCallInline}
          isLoading={connecting}
        />
      ) : (
        <ActiveCallDetail
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
          onEndCallClick={endCall}
        />
      )}
      {showPublicKeyInvalidMessage && <PleaseSetYourPublicKeyMessage />}
      {connected && (
        <div className={`mic-indicator ${micActive ? "active" : ""}`}>
          Mic {micActive ? "Active" : "Inactive"}
        </div>
      )}
      <div>
        Microphone permission: {micPermission}
        {micPermission !== "granted" && (
          <button
            onClick={() => navigator.mediaDevices.getUserMedia({ audio: true })}
          >
            Request Microphone Access
          </button>
        )}
      </div>
    </div>
  );
};

const assistantOptions = {
  name: "Vapi's Pizza Front Desk",
  firstMessage: "Vappy's Pizzeria speaking, how can I help you?",
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
        content: `You are a voice assistant for Vappy's Pizzeria, a pizza shop located on the Internet.

Your job is to take the order of customers calling in. The menu has only 3 types
of items: pizza, sides, and drinks. There are no other types of items on the menu.

1) There are 3 kinds of pizza: cheese pizza, pepperoni pizza, and vegetarian pizza
(often called "veggie" pizza).
2) There are 3 kinds of sides: french fries, garlic bread, and chicken wings.
3) There are 2 kinds of drinks: soda, and water. (if a customer asks for a
brand name like "coca cola", just let them know that we only offer "soda")

Customers can only order 1 of each item. If a customer tries to order more
than 1 item within each category, politely inform them that only 1 item per
category may be ordered.

Customers must order 1 item from at least 1 category to have a complete order.
They can order just a pizza, or just a side, or just a drink.

Be sure to introduce the menu items, don't assume that the caller knows what
is on the menu (most appropriate at the start of the conversation).

If the customer goes off-topic or off-track and talks about anything but the
process of ordering, politely steer the conversation back to collecting their order.

Once you have all the information you need pertaining to their order, you can
end the conversation. You can say something like "Awesome, we'll have that ready
for you in 10-20 minutes." to naturally let the customer know the order has been
fully communicated.

It is important that you collect the order in an efficient manner (succinct replies
& direct questions). You only have 1 task here, and it is to collect the customers
order, then end the conversation.

- Be sure to be kind of funny and witty!
- Keep all your responses short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
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
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left half: Spline Animation */}
        <div className="w-full aspect-square md:aspect-auto md:h-[calc(100vh-4rem)] relative">
          <SplineAnimation isPlaying={isPlaying} />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {isPlaying ? "Pause Animation" : "Play Animation"}
          </button>
        </div>

        {/* Right half: User Input Section */}
        <div className="flex flex-col gap-8">
          <Image
            className="dark:invert self-start"
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <UserInputSection />
        </div>
      </main>
    </div>
  );
}
