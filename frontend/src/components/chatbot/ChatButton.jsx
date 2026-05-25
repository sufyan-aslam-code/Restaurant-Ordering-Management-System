import { MessageCircle } from "lucide-react";

export default function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-5 right-5 z-50
        h-14 w-14 sm:h-16 sm:w-16
        rounded-full
        bg-gradient-to-r from-orange-500 to-red-500
        text-white
        shadow-2xl
        flex items-center justify-center
        hover:scale-105 active:scale-95
        transition-all duration-300
      "
    >
      <MessageCircle size={26} />
    </button>
  );
}