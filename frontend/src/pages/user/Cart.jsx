import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const cartItems = [
  {
    id: 1,
    name: "Cheese Burger",
    price: 12,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },

  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 18,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },
];

const Cart = () => {
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <Container>

        {/* Heading */}
        <div className="mb-12">

          <h1 className="text-4xl font-bold text-gray-800">
            Your Cart
          </h1>

          <p className="text-gray-500 mt-2">
            Review your selected food items
          </p>

        </div>

        {/* Cart Items */}
        <div className="space-y-6">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="
                bg-white
                rounded-2xl
                shadow-md
                p-5
                flex
                flex-col
                md:flex-row
                items-center
                justify-between
                gap-6
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
                    rounded-xl
                    object-cover
                  "
                />

                <div>

                  <h2 className="text-2xl font-semibold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Quantity: {item.quantity}
                  </p>

                </div>

              </div>

              {/* Right */}
              <div className="text-center md:text-right">

                <p className="text-2xl font-bold text-orange-500 mb-4">
                  ${item.price * item.quantity}
                </p>

                <Button variant="secondary">
                  Remove
                </Button>

              </div>

            </div>
          ))}

        </div>

        {/* Summary */}
        <div
          className="
            mt-12
            bg-white
            rounded-2xl
            shadow-md
            p-8
            max-w-md
            ml-auto
          "
        >

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              Total
            </h2>

            <span className="text-3xl font-bold text-orange-500">
              ${totalPrice}
            </span>

          </div>

          <Button
            className="w-full"
            onClick={() => navigate("/checkout")}
          >
            Proceed To Checkout
          </Button>

        </div>

      </Container>
    </section>
  );
};

export default Cart;