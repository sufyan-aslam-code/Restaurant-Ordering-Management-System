import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../common/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  // =========================================
  // IMAGE URL
  // =========================================
  // Cloudinary already provides a full image URL
  const imageUrl = food.image || "/fallback-image.png";

  // =========================================
  // STOCK LOGIC
  // =========================================
  const isInStock = Number(food.stockQuantity) > 0;

  // =========================================
  // OPEN PRODUCT DETAILS
  // =========================================
  const openProductDetails = () => {
    navigate(`/product/${food.id}`);
  };

  // =========================================
  // ADD TO CART HANDLER
  // =========================================
  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart!");
      navigate("/login");
      return;
    }

    if (!isInStock) {
      toast.error("Product is currently unavailable!");
      return;
    }

    addToCart(food, 1);
    toast.success(`${food.name} added to cart`);
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
      className="group h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={food.name}
          className={`w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500 ${
            !isInStock ? "grayscale opacity-80" : ""
          }`}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

        {/* RATING */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star size={15} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-800">
            {Number(food.rating || 4.5).toFixed(1)}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 p-6">
        {/* CATEGORY */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wide">
            {food.categoryName || "Food"}
          </span>
        </div>

        {/* TITLE + PRICE */}
        <div className="flex items-start gap-3 mb-4">
          <h2 className="flex-1 text-2xl font-bold text-gray-900 leading-tight line-clamp-2 wrap-break-words">
            {food.name}
          </h2>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-2xl font-extrabold text-orange-500 whitespace-nowrap">
              Rs. {Number(food.discountPrice || food.price || 0).toFixed(0)}
            </span>

            {food.discountPrice && (
              <span className="text-sm text-gray-400 line-through font-medium">
                Rs. {Number(food.price).toFixed(0)}
              </span>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-500 text-[15px] leading-7 line-clamp-2 mb-6">
          {food.description || "Freshly prepared with premium ingredients."}
        </p>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between gap-3">
          {/* STOCK INDICATOR */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                isInStock ? "bg-green-500" : "bg-red-500"
              }`}
            />

            <span
              className={`text-sm font-semibold whitespace-nowrap ${
                isInStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {isInStock ? "In Stock" : "Unavailable"}
            </span>
          </div>

          {/* ADD TO CART BUTTON */}
          {user?.role !== "admin" && isInStock && (
            <Button
              onClick={handleAddToCart}
              className="ml-auto h-11 min-w-[135px] px-5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-md"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;