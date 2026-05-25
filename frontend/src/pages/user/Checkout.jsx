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

// Loading the Stripe Key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

// =========================================
// STRIPE PAYMENT FORM COMPONENT
// =========================================
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

    const { error: paymentError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: billingDetails.fullName,
        email: billingDetails.email,
        phone: billingDetails.phoneNumber,
      }
    });

    if (paymentError) {
      setError(paymentError.message || "Payment method validation failed.");
      setProcessing(false);
      return;
    }

    try {
     const response = await createOrder({
  items: cartItems.map((item) => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
  })),
  totalAmount: totalPrice,
  paymentMethod: "Card",
  paymentStatus: "paid",
  deliveryAddress: billingDetails.deliveryAddress,
  phoneNumber: billingDetails.phoneNumber,
  city: billingDetails.city,
});

      onOrderPlaced(response.data.order);
    } catch (error) {
      setError(
        error?.response?.data?.message || "Unable to place order right now."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 rounded-xl border border-gray-300 dark:border-slate-700 bg-white p-4 shadow-sm">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                "::placeholder": {
                  color: "#9ca3af",
                },
                iconColor: "#f97316",
              },
              invalid: {
                color: "#ef4444",
                iconColor: "#ef4444",
              },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {processing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  );
};

// =========================================
// MAIN CHECKOUT LAYOUT
// =========================================
const CheckoutContent = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
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

  const handleOrderPlaced = (order) => {
    clearCart();
    navigate("/order-success", { state: { order } });
  };

  if (!cartItems.length) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-slate-950 min-h-screen flex items-center">
        <Container>
          <div className="max-w-2xl mx-auto rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Add some delicious food items before checkout.
            </p>
            <Button onClick={() => navigate("/menu")} className="px-8 py-3 rounded-xl">
              Browse Menu
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Checkout
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Complete your order details and payment.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-5 text-red-600 dark:text-red-400 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-4">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Billing Details
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed opacity-70"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>

              <textarea
                rows="4"
                name="deliveryAddress"
                value={billingDetails.deliveryAddress}
                onChange={handleFieldChange}
                placeholder="Full Delivery Address"
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none resize-none transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-8 sticky top-28">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1 pr-4 text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white mr-2">
                      {item.quantity}x
                    </span>
                    <span className="line-clamp-2 leading-relaxed">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap pt-0.5">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-gray-100 dark:border-slate-800 mb-6" />

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Delivery Fee</span>
                <span className="font-semibold text-green-500">Free</span>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-5 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-2xl font-bold text-orange-500">
                  Rs. {totalPrice}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
            
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