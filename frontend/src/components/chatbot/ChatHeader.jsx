import { Bot, X } from "lucide-react";

export default function ChatHeader({ onClose }) {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
          <Bot size={24} />
        </div>

        <div>
          <h2 className="font-semibold text-lg">FoodieHub AI</h2>
          <p className="text-sm text-orange-100">
            Your smart food assistant
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-white/20 transition"
      >
        <X size={22} />
      </button>
    </div>
  );
}