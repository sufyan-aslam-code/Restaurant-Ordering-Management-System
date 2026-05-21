const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) => {

  const baseStyles =
    "font-semibold transition duration-300 flex items-center justify-center px-6 py-3 rounded-lg gap-2 hover:shadow-lg hover:shadow-orange-200/60";

  const variants = {

    primary:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200/60",

    secondary:
      "border-2 border-orange-500 bg-white dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 hover:shadow-md text-orange-600 dark:text-orange-400 font-semibold",

    dark:
      "bg-gray-900 hover:bg-black text-white shadow-md",

  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant] || ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;