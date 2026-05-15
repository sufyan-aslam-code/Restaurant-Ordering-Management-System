import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

    const navigate = useNavigate();

    return (
        <section className="py-20 bg-gray-50 min-h-screen">
            <Container>

                {/* Heading */}
                <div className="mb-12">

                    <h1 className="text-4xl font-bold text-gray-800">
                        Checkout
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Complete your order details
                    </p>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Side */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md">

                        <h2 className="text-2xl font-bold text-gray-800 mb-8">
                            Billing Details
                        </h2>

                        <form className="space-y-5">

                            <Input
                                type="text"
                                placeholder="Full Name"
                            />

                            <Input
                                type="email"
                                placeholder="Email Address"
                            />

                            <Input
                                type="text"
                                placeholder="Phone Number"
                            />

                            <Input
                                type="text"
                                placeholder="City"
                            />

                            <textarea
                                rows="5"
                                placeholder="Delivery Address"
                                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  resize-none
                  transition-all
                  duration-300
                  focus:border-orange-500
                  focus:ring-4
                  focus:ring-orange-100
                "
                            />

                        </form>

                    </div>

                    {/* Right Side */}
                    <div className="bg-white p-8 rounded-2xl shadow-md h-fit">

                        <h2 className="text-2xl font-bold text-gray-800 mb-8">
                            Order Summary
                        </h2>

                        <div className="space-y-5 mb-8">

                            <div className="flex justify-between text-gray-700">
                                <span>Cheese Burger x1</span>
                                <span>$12</span>
                            </div>

                            <div className="flex justify-between text-gray-700">
                                <span>Pepperoni Pizza x2</span>
                                <span>$36</span>
                            </div>

                            <div className="border-t pt-5 flex justify-between">

                                <span className="text-xl font-bold text-gray-800">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-orange-500">
                                    $48
                                </span>

                            </div>

                        </div>

                        <Button
                            className="w-full"
                            onClick={() => navigate("/order-success")}
                        >
                            Place Order
                        </Button>

                    </div>

                </div>

            </Container>
        </section>
    );
};

export default Checkout;