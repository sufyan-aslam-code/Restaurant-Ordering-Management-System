import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({
  onSend,
  loading,
}) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    onSend(input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        border-t border-gray-200 dark:border-slate-700
        bg-white dark:bg-slate-900
        p-3
        shadow-[0_-2px_10px_rgba(0,0,0,0.04)]
      "
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for food recommendations..."
          disabled={loading}
          className="
            flex-1 h-12 px-4
            rounded-xl
            border border-gray-200 dark:border-slate-700
            bg-gray-50 dark:bg-slate-800
            text-gray-800 dark:text-gray-100
            placeholder:text-gray-500 dark:placeholder:text-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-orange-400
            text-sm
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            h-12 w-12 rounded-xl
            bg-gradient-to-r from-orange-500 to-red-500
            text-white
            flex items-center justify-center
            hover:scale-105 active:scale-95
            transition-all duration-200
            shadow-lg shadow-orange-200/40 dark:shadow-orange-900/30
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
          "
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </form>
  );
}