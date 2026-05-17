const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}) => {

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full
        border
        border-gray-300
        rounded-2xl
        px-4
        py-3
        outline-none
        focus:border-orange-500
        transition
        ${className}
      `}
    />
  );
};

export default Input;