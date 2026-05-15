import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="relative">

      <input
        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          border
          border-gray-300
          rounded-xl
          px-4
          py-3
          outline-none
          transition-all
          duration-300
          focus:border-orange-500
          focus:ring-4
          focus:ring-orange-100
        "
      />

      {isPassword && (
        <button
          type="button"
          onClick={() =>
            setShowPassword(!showPassword)
          }
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-500
            hover:text-orange-500
            transition
          "
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      )}

    </div>
  );
};

export default Input;