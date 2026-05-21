import { Clock3, Eye, Star } from "lucide-react";

import { useNavigate } from "react-router-dom";

import Button from "../common/Button";

import { useCart } from "../../context/CartContext";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const openProductDetails = () => {
    navigate(`/product/${food.id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openProductDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProductDetails();
        }
      }}
      className="
        group
        h-full
        flex
        flex-col
        bg-white
        rounded-3xl
        overflow-hidden
        border
        border-gray-100
        shadow-sm
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
      "
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="
            w-full
            h-60
            object-cover
            group-hover:scale-105
            transition-transform
            duration-500
          "
        />

        {/* Overlay Gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-tfrom-black/40
            to-transparent
          "
        />

        {/* Rating */}
        <div
          className="
            absolute
            top-4
            left-4
            bg-white
            px-3
            py-1.5
            rounded-full
            flex
            items-center
            gap-1
            shadow-md
          "
        >
          <Star
            size={16}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="text-sm font-semibold">4.8</span>
        </div>

        {/* Delivery Time */}
        <div
          className="
            absolute
            bottom-4
            left-4
            bg-white/90
            backdrop-blur-md
            px-3
            py-1.5
            rounded-full
            flex
            items-center
            gap-2
            shadow-md
          "
        >
          <Clock3
            size={16}
            className="text-orange-500"
          />

          <span className="text-sm font-medium text-gray-700">20-30 min</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <p
          className="
            text-sm
            font-medium
            text-orange-500
            uppercase
            tracking-wide
            mb-2
          "
        >
          {food.category}
        </p>

        {/* Name */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2
            className="
              text-xl
              font-bold
              text-gray-900
              leading-snug
              min-h-[64px]
            "
          >
            {food.name}
          </h2>

          <span
            className="
              text-xl
              font-bold
              text-gray-900
              whitespace-nowrap
            "
          >
            Rs. {food.price}
          </span>
        </div>

        {/* Description */}
        <p
          className="
            text-gray-500
            text-sm
            leading-relaxed
            mb-5
            min-h-[76px]
          "
        >
          {food.description || "Freshly prepared with premium ingredients and rich flavors for the perfect meal experience."}
        </p>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div
              className="
                w-2
                h-2
                rounded-full
                bg-green-500
              "
            />

            <span className="text-sm text-gray-500">Available</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openProductDetails();
              }}
              className="h-12 px-4 rounded-2xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition inline-flex items-center gap-2"
            >
              <Eye size={18} />
              <span className="text-sm font-semibold">View</span>
            </button>

            <Button
              onClick={(event) => {
                event.stopPropagation();
                addToCart(food);
              }}
              className="
                w-12
                h-12
                rounded-2xl
                shadow-lg
              "
              aria-label="Add to cart"
            >
              <span className="text-2xl font-bold leading-none text-white">+</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
