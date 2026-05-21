import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../api/orders";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

const CheckoutForm = ({
  billingDetails,
  cartItems,
  totalPrice,
  onOrderPlaced,
  setError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Payment is not ready yet. Please try again.");
      return;
    }

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !billingDetails.fullName ||
      !billingDetails.phoneNumber ||
      !billingDetails.city ||
      !billingDetails.deliveryAddress
    ) {
      setError("Please complete all billing fields.");
      return;
    }

    setProcessing(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    const { error: paymentError } =
      await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

    if (paymentError) {
      setError(paymentError.message || "Payment method validation failed.");
      setProcessing(false);
      return;
    }

    try {
      const response = await createOrder({
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: totalPrice,
        paymentStatus: "paid",
        deliveryAddress: billingDetails.deliveryAddress,
        city: billingDetails.city,
      });

      onOrderPlaced(response.data.order);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Unable to place order right now."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 rounded-xl border border-gray-300 dark:border-gray-600 p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#374151",
                "::placeholder": {
                  color: "#9ca3af",
                },
              },
              invalid: {
                color: "#dc2626",
              },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? "Processing..." : "Place Order"}
      </Button>
    </form>
  );
};

const CheckoutContent = () => {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [error, setError] = useState("");

  const [billingDetails, setBillingDetails] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    city: "",
    deliveryAddress: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setBillingDetails((currentDetails) => ({
      ...currentDetails,
      [name]: value,
    }));
  };

  const formattedTotal = useMemo(
    () => `Rs. ${Number(totalPrice || 0).toFixed(2)}`,
    [totalPrice]
  );

  const handleOrderPlaced = (order) => {
    clearCart();
    navigate("/order-success", { state: { order } });
  };

  if (!cartItems.length) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <Container>
          <div className="max-w-2xl mx-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Add some delicious food items before checkout.
            </p>
            <Button onClick={() => navigate("/menu")}>Browse Menu</Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Checkout</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Complete your order details</p>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">
              Billing Details
            </h2>

            <form className="space-y-5">
              <Input
                type="text"
                name="fullName"
                value={billingDetails.fullName}
                onChange={handleFieldChange}
                placeholder="Full Name"
              />

              <Input
                type="email"
                name="email"
                value={billingDetails.email}
                disabled
                placeholder="Email Address"
                className="bg-gray-100 text-gray-500 cursor-not-allowed"
              />

              <Input
                type="text"
                name="phoneNumber"
                value={billingDetails.phoneNumber}
                onChange={handleFieldChange}
                placeholder="Phone Number"
              />

              <Input
                type="text"
                name="city"
                value={billingDetails.city}
                onChange={handleFieldChange}
                placeholder="City"
              />

              <textarea
                rows="5"
                name="deliveryAddress"
                value={billingDetails.deliveryAddress}
                onChange={handleFieldChange}
                placeholder="Delivery Address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </form>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md h-fit">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Order Summary</h2>

            <div className="space-y-5 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t dark:border-gray-700 pt-5 flex justify-between">
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Total</span>
                <span className="text-2xl font-bold text-orange-500">{formattedTotal}</span>
              </div>
            </div>

            <CheckoutForm
              billingDetails={billingDetails}
              cartItems={cartItems}
              totalPrice={totalPrice}
              onOrderPlaced={handleOrderPlaced}
              setError={setError}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutContent />
  </Elements>
);

export default Checkout;
