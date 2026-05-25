import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Star,
  ShoppingCart,
  ChefHat,
  Minus,
  Plus,
  Loader2
} from "lucide-react";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { getSingleProduct } from "../../api/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Destructure user to handle role-based UI
  const { isAuthenticated, user } = useAuth();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // =========================================
  // FETCH PRODUCT
  // =========================================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getSingleProduct(id);
        setFood(response.data.product);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================================
  // IMAGE URL FIX
  // =========================================
  const BACKEND_URL = "http://localhost:5000";
  const imageUrl = food?.image?.startsWith("http") 
    ? food.image 
    : `${BACKEND_URL}${food?.image}`;

  // =========================================
  // STOCK LOGIC
  // =========================================
  const stockQuantity = Number(food?.stockQuantity || 0);
  const isInStock = stockQuantity > 0;

  // =========================================
  // QUANTITY HANDLERS
  // =========================================
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < stockQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning(`Sorry, we only have ${stockQuantity} of these in stock right now.`);
    }
  };

  // =========================================
  // ADD TO CART HANDLER
  // =========================================
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart!");
      navigate("/login");
      return;
    }

    if (!isInStock) {
      toast.error("Product is currently unavailable!");
      return;
    }

    addToCart(food, quantity);
    toast.success(`Added ${quantity} ${food.name} to cart!`);
    
    // Optional: Reset quantity back to 1 after adding to cart
    setQuantity(1); 
  };

  // =========================================
  // LOADING STATE
  // =========================================
  if (loading) {
    return (
      <section className="py-20 min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400 tracking-wide">
            Preparing your food details...
          </h2>
        </div>
      </section>
    );
  }

  // =========================================
  // NOT FOUND STATE
  // =========================================
  if (!food) {
    return (
      <section className="py-20 min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <Container>
          <div className="max-w-md mx-auto text-center bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-800">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Item Not Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              The dish you are looking for is no longer available on our menu.
            </p>
            <Button onClick={() => navigate("/menu")} className="px-8 py-4 rounded-xl w-full text-lg shadow-orange-500/25 shadow-lg">
              Browse Menu
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  // =========================================
  // CALCULATIONS
  // =========================================
  const unitPrice = Number(food.discountPrice || food.price);
  const originalUnitPrice = Number(food.price);
  const totalPrice = unitPrice * quantity;
  const totalOriginalPrice = originalUnitPrice * quantity;
  const hasDiscount = Boolean(food.discountPrice);

  return (
    <section className="py-8 sm:py-12 lg:py-20 min-h-screen bg-[#f8f4ee] dark:bg-slate-950 font-sans pb-32 sm:pb-12 relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start max-w-6xl mx-auto">
          
          {/* LEFT SIDE: IMAGE */}
          <div className="lg:col-span-5 h-full">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-slate-800 relative group aspect-square lg:aspect-[4/5] sticky top-24">
              
              {/* Out of Stock Overlay */}
              {!isInStock && (
                <div className="absolute inset-0 bg-white/40 dark:bg-black/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <span className="bg-white/90 dark:bg-slate-800/90 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-extrabold tracking-widest text-sm sm:text-base shadow-2xl backdrop-blur-md border border-white/20">
                    OUT OF STOCK
                  </span>
                </div>
              )}

              {/* FIXED IMAGE SRC HERE */}
              <img
                src={imageUrl}
                alt={food.name}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  !isInStock ? "grayscale opacity-80" : ""
                }`}
              />
            </div>
          </div>

          {/* RIGHT SIDE: DETAILS */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 shadow-xl border border-gray-100 dark:border-slate-800">
              
              {/* HEADER: CATEGORY & RATING */}
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 text-xs font-extrabold uppercase tracking-wider">
                  {food.categoryName || "Food"}
                </span>

                <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-100 dark:border-yellow-500/20">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-extrabold text-sm text-yellow-700 dark:text-yellow-500 mt-0.5">
                    {Number(food.rating || 4.5).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* TITLE */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">
                {food.name}
              </h1>

              {/* DESCRIPTION */}
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
                {food.description || "Freshly prepared using premium ingredients and authentic flavors."}
              </p>

              {/* STOCK STATUS BADGE */}
              <div className="flex items-center gap-2.5 mb-10 pb-8 border-b border-gray-100 dark:border-slate-800/50">
                <div className={`w-3 h-3 rounded-full shadow-sm ${isInStock ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50"}`} />
                <span className={`text-sm font-bold tracking-wide uppercase ${isInStock ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {isInStock ? `In Stock (${food.stockQuantity})` : "Currently Unavailable"}
                </span>
              </div>

              {/* INGREDIENTS SECTION */}
              {food.ingredients && food.ingredients.length > 0 && (
                <div className="mb-10 pb-10 border-b border-gray-100 dark:border-slate-800/50">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <ChefHat size={20} className="text-orange-500" />
                    Fresh Ingredients
                  </h3>

                  <div className="flex flex-wrap gap-2.5">
                    {food.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors hover:border-orange-300 dark:hover:border-orange-500/50 cursor-default"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* BOTTOM BAR (Sticky on mobile, static on desktop) */}
              <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 border-t border-gray-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] sm:static sm:p-0 sm:border-0 sm:shadow-none sm:bg-transparent z-50 flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6 rounded-t-3xl sm:rounded-none">
                
                {/* PRICE CALCULATION */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-end w-full sm:w-auto h-full pb-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-0 sm:mb-1 uppercase tracking-wider">
                    Total Price
                  </p>

                  <div className="flex items-end gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                      <span className="text-orange-500 text-2xl mr-1 sm:mr-2">Rs.</span>
                      {totalPrice.toLocaleString()}
                    </span>

                    {hasDiscount && (
                      <span className="text-base sm:text-lg text-gray-400 dark:text-gray-500 line-through font-bold mb-1">
                        Rs. {totalOriginalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* ACTIONS (Only renders if User AND In Stock) */}
                {user?.role !== "admin" && isInStock && (
                  <div className="flex items-stretch gap-3 w-full sm:w-auto">
                    
                    {/* QUANTITY SELECTOR */}
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl h-14 w-36 px-1.5">
                      <button
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all shadow-sm disabled:shadow-none"
                      >
                        <Minus size={18} strokeWidth={3} />
                      </button>

                      <span className="font-black text-gray-900 dark:text-white text-lg w-8 text-center select-none">
                        {quantity}
                      </span>

                      <button
                        onClick={handleIncrease}
                        disabled={quantity >= stockQuantity}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all shadow-sm disabled:shadow-none"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>

                    {/* ADD TO CART BUTTON */}
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 sm:flex-none sm:w-auto px-6 sm:px-8 h-14 rounded-2xl text-base font-bold shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2.5 transition-all hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </Button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductDetails;