import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import ChatButton from "./ChatButton";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";

import { sendMessageToAI } from "../../services/aiService";
import { useAuth } from "../../context/AuthContext";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi! I can help you discover meals, suggest foods based on your taste and budget, and recommend popular dishes 🍔",
  },
];

const suggestedPrompts = [
  "Spicy dishes",
  "Fast food",
  "Drinks",
  "Cheap meals",
  "Desserts",
  "Healthy foods",
];

export default function ChatWidget() {
  const { user } = useAuth();

  const storageKey = `chat_messages_${
    user?.id || user?.email || "guest"
  }`;

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(storageKey);

    return savedMessages
      ? JSON.parse(savedMessages)
      : initialMessages;
  });

  const [loading, setLoading] = useState(false);

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(messages)
    );
  }, [messages, storageKey]);

  // Load correct messages when account changes
  useEffect(() => {
    const savedMessages = localStorage.getItem(storageKey);

    setMessages(
      savedMessages
        ? JSON.parse(savedMessages)
        : initialMessages
    );
  }, [storageKey]);

  // Prevent body scroll on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSendMessage = async (message) => {
    if (!message.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const recentHistory = updatedMessages
        .slice(-6)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await sendMessageToAI(
        message,
        recentHistory
      );

      const botReply = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.reply,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Something went wrong while processing your request.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    {!isOpen && (
      <ChatButton onClick={() => setIsOpen(true)} />
    )}

    <div
      className={`
        fixed z-[9999]

        bg-white/95 dark:bg-slate-900/95
        backdrop-blur-xl

        border border-gray-200 dark:border-slate-700

        shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]

        transition-all duration-300 ease-in-out

        w-full h-full bottom-0 right-0

        sm:w-[420px]
        sm:h-[650px]
        sm:bottom-5
        sm:right-5
        sm:rounded-3xl

        flex flex-col overflow-hidden

        ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }
      `}
    >
      <ChatHeader onClose={() => setIsOpen(false)} />

      <div
        className="
          bg-gradient-to-r
          from-orange-50 to-red-50
          dark:from-slate-800 dark:to-slate-800

          px-4 py-3

          border-b border-gray-100 dark:border-slate-700

          transition-colors duration-200
        "
      >
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
          <Sparkles
            size={16}
            className="text-orange-500"
          />

          <span>
            AI-powered meal recommendations
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessages
          messages={messages}
          loading={loading}
        />

        <SuggestedPrompts
          prompts={suggestedPrompts}
          onPromptClick={(prompt) => {
            if (!loading) {
              handleSendMessage(prompt);
            }
          }}
        />

        <ChatInput
          onSend={handleSendMessage}
          loading={loading}
        />
      </div>
    </div>
  </>
);
}