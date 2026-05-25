import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-[10000]
        flex items-center justify-center
        bg-black/50 backdrop-blur-sm
        px-4
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl
          bg-white dark:bg-slate-900
          border border-gray-200 dark:border-slate-700
          shadow-2xl
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div
              className="
                h-12 w-12 rounded-2xl
                bg-red-100 dark:bg-red-500/10
                flex items-center justify-center
              "
            >
              <AlertTriangle
                size={24}
                className="text-red-500"
              />
            </div>

            <div>
              <h2
                className="
                  text-lg font-semibold
                  text-gray-900 dark:text-white
                "
              >
                {title}
              </h2>

              <p
                className="
                  mt-1 text-sm leading-relaxed
                  text-gray-600 dark:text-slate-300
                "
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            px-6 py-4
            bg-gray-50 dark:bg-slate-800/50
            border-t border-gray-100 dark:border-slate-700
            flex items-center justify-end gap-3
          "
        >
          <button
            onClick={onCancel}
            disabled={loading}
            className="
              px-5 py-2.5 rounded-xl
              border border-gray-200 dark:border-slate-600
              bg-white dark:bg-slate-800
              text-gray-700 dark:text-slate-200
              hover:bg-gray-100 dark:hover:bg-slate-700
              transition-all duration-200
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-red-500 to-orange-500
              text-white font-medium
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            {loading
              ? "Deleting..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}