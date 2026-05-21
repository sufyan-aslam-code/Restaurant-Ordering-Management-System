import { Link } from "react-router-dom";

import {
  Trash2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

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

  // Empty Cart
  if (cartItems.length === 0) {

    return (
      <section
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-50
          py-20
        "
      >

        <Container>

          <div
            className="
              max-w-xl
              mx-auto
              bg-white
              rounded-3xl
              shadow-sm
              border
              border-gray-100
              p-12
              text-center
            "
          >

            <div
              className="
                w-24
                h-24
                mx-auto
                rounded-full
                bg-orange-100
                flex
                items-center
                justify-center
                mb-6
              "
            >

              <ShoppingBag
                size={42}
                className="text-orange-500"
              />

            </div>

            <h1
              className="
                text-4xl
                font-bold
                text-gray-900
                mb-4
              "
            >
              Your Cart is Empty
            </h1>

            <p
              className="
                text-gray-500
                leading-8
                mb-8
              "
            >
              Looks like you haven’t added
              anything yet. Start exploring
              delicious meals now.
            </p>

            <Link to="/menu">

              <Button
                className="
                  px-8
                  py-4
                  rounded-2xl
                "
              >
                Explore Menu
              </Button>

            </Link>

          </div>

        </Container>

      </section>
    );
  }

  return (
    <section
      className="
        py-20
        min-h-screen
        bg-gray-50
      "
    >

      <Container>

        {/* Heading */}
        <div className="mb-12">

          <h1
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-gray-900
              mb-3
            "
          >
            Shopping Cart
          </h1>

          <p className="text-lg text-gray-500">
            Review your selected food items
            before checkout.
          </p>

        </div>

        {/* Layout */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-3
            gap-8
            items-start
          "
        >

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-gray-100
                  shadow-sm
                  p-5
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  justify-between
                  gap-6
                  hover:shadow-md
                  transition
                "
              >

                {/* Left */}
                <div className="flex items-center gap-5">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-28
                      h-28
                      rounded-2xl
                      object-cover
                    "
                  />

                  <div>

                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-gray-900
                        mb-1
                      "
                    >
                      {item.name}
                    </h2>

                    <p className="text-gray-500 mb-3">
                      {item.category}
                    </p>

                    <span
                      className="
                        text-xl
                        font-bold
                        text-orange-500
                      "
                    >
                      Rs. {item.price}
                    </span>

                  </div>

                </div>

                {/* Right */}
                <div
                  className="
                    flex
                    flex-col
                    items-end
                    gap-5
                  "
                >

                  {/* Quantity */}
                  <div
                    className="
                      flex
                      items-center
                      bg-gray-100
                      rounded-full
                      p-1
                    "
                  >

                    <Button
                      variant=""
                      disabled={item.quantity === 1}
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-white
                        hover:bg-gray-200
                        text-gray-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        p-0
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <span className="text-xl font-bold leading-none">-</span>

                    </Button>

                    <span
                      className="
                        w-12
                        text-center
                        font-semibold
                        text-gray-900
                      "
                    >
                      {item.quantity}
                    </span>

                    <Button
                      variant=""
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-white
                        hover:bg-gray-200
                        text-gray-700
                        p-0
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <span className="text-xl font-bold leading-none">+</span>

                    </Button>

                  </div>

                  {/* Price + Remove */}
                  <div className="text-right">

                    <h3
                      className="
                        text-2xl
                        font-bold
                        text-gray-900
                        mb-3
                      "
                    >
                      Rs. {item.price * item.quantity}
                    </h3>

                    <Button
                      variant=""
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="
                        bg-red-50
                        hover:bg-red-100
                        text-red-500
                        rounded-xl
                        px-4
                        py-2
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <Trash2 size={16} />

                      Remove

                    </Button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Summary */}
          <div
            className="
              bg-white
              rounded-3xl
              border
              border-gray-100
              shadow-sm
              p-8
              sticky
              top-28
            "
          >

            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                mb-8
              "
            >
              Order Summary
            </h2>

            <div className="space-y-5 mb-8">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Total Items
                </span>

                <span className="font-semibold">
                  {cartItems.length}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Delivery Fee
                </span>

                <span className="font-semibold">
                  Free
                </span>

              </div>

              <div className="border-t pt-5 flex items-center justify-between">

                <span
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-3xl
                    font-bold
                    text-orange-500
                  "
                >
                  Rs. {totalPrice}
                </span>

              </div>

            </div>

            <Link to="/checkout">

              <Button
                className="
                  w-full
                  py-4
                  rounded-2xl
                  text-lg
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                Proceed To Checkout

                <ArrowRight size={20} />

              </Button>

            </Link>

          </div>

        </div>

      </Container>

    </section>
  );
};

export default Cart;