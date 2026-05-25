import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[82%]
          px-4 py-3 rounded-2xl
          text-sm leading-relaxed
          shadow-sm
          transition-colors duration-200

          ${
            isUser
              ? `
                bg-gradient-to-r from-orange-500 to-red-500
                text-white
                rounded-br-md
                shadow-orange-200/40 dark:shadow-orange-900/30
              `
              : `
                bg-white dark:bg-slate-800
                border border-gray-100 dark:border-slate-700
                text-gray-800 dark:text-gray-100
                rounded-bl-md
              `
          }
        `}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <ReactMarkdown
            components={{
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
              ),

              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
              ),

              strong: ({ node, ...props }) => (
                <strong className="font-bold" {...props} />
              ),

              p: ({ node, ...props }) => (
                <p className="mb-2 last:mb-0" {...props} />
              ),

              code: ({ node, ...props }) => (
                <code
                  className="
                    bg-gray-100 dark:bg-slate-700
                    px-1 py-0.5 rounded
                    text-orange-600 dark:text-orange-300
                  "
                  {...props}
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}