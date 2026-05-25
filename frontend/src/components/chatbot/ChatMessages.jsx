import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatMessages({
  messages,
  loading,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div
      className="
        flex-1 overflow-y-auto scrollbar-none
        px-4 py-5 space-y-5
        bg-gray-50 dark:bg-slate-950
        transition-colors duration-200
      "
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 px-2">
          <div className="h-2 w-2 rounded-full bg-orange-400 animate-bounce" />
          <div className="h-2 w-2 rounded-full bg-orange-400 animate-bounce delay-100" />
          <div className="h-2 w-2 rounded-full bg-orange-400 animate-bounce delay-200" />

          <span className="ml-2">
            FoodieHub AI is thinking...
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}