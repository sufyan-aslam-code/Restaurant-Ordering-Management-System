const Button = ({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
}) => {

  const baseStyles =
    "px-6 py-3 rounded-xl font-semibold transition duration-300";

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
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;