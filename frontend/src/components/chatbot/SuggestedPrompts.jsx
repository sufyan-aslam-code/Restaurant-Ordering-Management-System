export default function SuggestedPrompts({
  prompts,
  onPromptClick,
}) {
  return (
    <div
      className="
        px-3 pt-3 pb-2
        border-t border-gray-100 dark:border-slate-700
        bg-white dark:bg-slate-900
        overflow-x-auto scrollbar-none
        transition-colors duration-200
      "
    >
      <div className="flex gap-2 min-w-max">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="
              whitespace-nowrap
              px-4 py-2 rounded-full
              bg-orange-50 dark:bg-slate-800
              hover:bg-orange-100 dark:hover:bg-slate-700
              border border-orange-100 dark:border-slate-700
              text-orange-600 dark:text-orange-300
              text-sm font-medium
              transition-all duration-200
              hover:shadow-md
              hover:-translate-y-[1px]
            "
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}