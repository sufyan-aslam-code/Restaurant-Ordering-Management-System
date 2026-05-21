const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) => {

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
      className={`
        w-full
        border
        border-gray-300 dark:border-gray-700
        bg-white dark:bg-slate-900
        text-gray-900 dark:text-gray-100
        placeholder:text-gray-400 dark:placeholder:text-gray-500
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