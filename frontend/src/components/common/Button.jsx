const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) => {

  const baseStyles =
    "font-semibold transition duration-300 flex items-center justify-center";

  const variants = {

    primary:
      "bg-orange-500 hover:bg-orange-600 text-white",

    secondary:
      "border border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700",

    dark:
      "bg-gray-900 hover:bg-black text-white",

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