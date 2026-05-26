import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useCart();

  // =========================================
  // QUANTITY HANDLER WITH STOCK CHECK
  // =========================================
  const handleIncreaseQuantity = (item) => {
    const maxStock =
      item.stockQuantity !== undefined
        ? Number(item.stockQuantity)
        : Infinity;

    if (item.quantity < maxStock) {
      increaseQuantity(item.id);
    } else {
      toast.warning(
        `Sorry, we only have ${maxStock} of these in stock right now.`
      );
    }
  };

  // =========================================
  // EMPTY CART STATE
  // =========================================
  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f8f4ee] dark:bg-slate-950 py-20 px-4">
        <Container>
          <div className="max-w-xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 dark:border-slate-800 p-10 sm:p-14 text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-500/5 flex items-center justify-center mb-8 shadow-inner">
              <ShoppingBag
                size={48}
                className="text-orange-500"
                strokeWidth={1.5}
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Your Cart is Empty
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10">
              Looks like you haven’t added anything yet. Start exploring
              delicious meals now.
            </p>

            <div className="flex justify-center">
              <Link to="/menu">
                <Button className="px-8 py-4 rounded-2xl">
                  Explore Menu
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // =========================================
  // ACTIVE CART STATE
  // =========================================
  return (
    <section className="py-12 sm:py-20 min-h-screen bg-[#f8f4ee] dark:bg-slate-950 px-4">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="mb-10 sm:mb-14">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
              Shopping Cart
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Review your selected food items before checkout.
            </p>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* =========================================
                LEFT: CART ITEMS LIST
            ========================================= */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              {cartItems.map((item) => {
                const maxStock =
                  item.stockQuantity !== undefined
                    ? Number(item.stockQuantity)
                    : Infinity;

                const isAtMaxStock = item.quantity >= maxStock;

                // =========================================
                // PRICE CALCULATION LOGIC
                // =========================================
                const regularPrice = Number(item.price);
                const discountPrice = Number(item.discountPrice);

                const finalPrice =
                  discountPrice && discountPrice > 0
                    ? discountPrice
                    : regularPrice;

                // =========================================
                // CLOUDINARY IMAGE URL
                // =========================================
                const imageUrl =
                  item.image || "/fallback-image.png";

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Left - Image & Details */}
                    <div className="flex items-center gap-5">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm border border-gray-50 dark:border-slate-800/50"
                      />

                      <div className="flex flex-col">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 text-[10px] font-extrabold uppercase tracking-wider mb-2 w-fit">
                          {item.category || "Food"}
                        </span>

                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {item.name}
                        </h2>

                        {/* Updated Price Display */}
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-orange-500">
                            Rs. {finalPrice.toLocaleString()}
                          </span>

                          {discountPrice > 0 && (
                            <span className="text-sm font-semibold text-gray-400 line-through">
                              Rs. {regularPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-5 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-gray-50 sm:border-0 dark:border-slate-800/50">

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl h-12 w-32 px-1">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity === 1}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all shadow-sm disabled:shadow-none"
                        >
                          <Minus size={16} strokeWidth={3} />
                        </button>

                        <span className="font-bold text-gray-900 dark:text-white text-base w-6 text-center select-none">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={isAtMaxStock}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-xl transition-all shadow-sm disabled:shadow-none"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Total Item Price + Remove */}
                      <div className="flex flex-col items-end gap-2">
                        <h3 className="hidden sm:block text-xl font-black text-gray-900 dark:text-white">
                          Rs. {(finalPrice * item.quantity).toLocaleString()}
                        </h3>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm font-semibold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =========================================
                RIGHT: ORDER SUMMARY
            ========================================= */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl p-6 sm:p-8 lg:sticky lg:top-28">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                  Order Summary
                </h2>

                {/* DYNAMIC ITEM BREAKDOWN */}
                <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                  {cartItems.map((item) => {
                    const regularPrice = Number(item.price);
                    const discountPrice = Number(item.discountPrice);

                    const finalPrice =
                      discountPrice && discountPrice > 0
                        ? discountPrice
                        : regularPrice;

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-start text-sm sm:text-base"
                      >
                        <div className="flex-1 pr-4 text-gray-600 dark:text-gray-400">
                          <span className="font-bold text-gray-900 dark:text-white mr-2">
                            {item.quantity}x
                          </span>

                          <span className="line-clamp-2 leading-relaxed">
                            {item.name}
                          </span>
                        </div>

                        <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap pt-0.5">
                          Rs. {(finalPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="h-px bg-gray-100 dark:bg-slate-800 w-full mb-6"></div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-base">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      Total Items
                    </span>

                    <span className="font-bold text-gray-900 dark:text-white">
                      {cartItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-base">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      Delivery Fee
                    </span>

                    <span className="font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-md">
                      Free
                    </span>
                  </div>

                  <div className="border-t border-gray-100 dark:border-slate-800 pt-5 mt-5 flex items-end justify-between">
                    <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      Total
                    </span>

                    <span className="text-3xl sm:text-4xl font-black text-orange-500 tracking-tight">
                      <span className="text-2xl mr-1">Rs.</span>
                      {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full py-4 rounded-2xl text-base sm:text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                    Proceed To Checkout
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
};

export default Cart;