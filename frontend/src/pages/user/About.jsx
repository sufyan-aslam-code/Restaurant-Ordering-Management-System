import { useNavigate } from "react-router-dom";

import {
  UtensilsCrossed,
  Truck,
  ShieldCheck,
  Star,
  Clock3,
} from "lucide-react";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";

const About = () => {

  const navigate = useNavigate();

  return (
    <section
      className="
        py-20
        min-h-screen
        bg-gradient-to-br
        from-orange-50
        via-white
        to-orange-100
        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950
      "
    >

      <Container>

        {/* Heading */}
        <div className="text-center mb-16">

          <span
            className="
              inline-block
              bg-orange-100
                dark:bg-orange-500/15
              text-orange-500
              font-semibold
              px-5
              py-2
              rounded-full
              mb-5
            "
          >
            About FoodieHub
          </span>

          <h1
            className="
              text-5xl
              font-bold
              text-gray-900
                dark:text-gray-100
              mb-6
            "
          >
            Delicious Food, Delivered Fast
          </h1>

          <p
            className="
              max-w-3xl
              mx-auto
              text-lg
              text-gray-500
                dark:text-gray-400
              leading-8
            "
          >
            FoodieHub is a modern food delivery
            platform built to connect food lovers
            with their favorite restaurants through
            a fast, reliable, and seamless digital
            experience.
          </p>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">

          {/* Image */}
          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1"
              alt="About FoodieHub"
              className="
                w-full
                h-[500px]
                object-cover
                rounded-[32px]
                shadow-2xl
              "
            />

            {/* Floating Card */}
            <div
              className="
                absolute
                bottom-6
                left-6
                bg-white/90
                theme-surface
                backdrop-blur-xl
                rounded-2xl
                shadow-xl
                px-6
                py-4
                border
                border-white/40 dark:border-gray-700
              "
            >

              <div className="flex items-center gap-3">

                <Star
                  size={22}
                  className="text-orange-500"
                />

                <div>

                  <h3 className="font-bold text-gray-900 dark:text-gray-100">
                    Trusted By Thousands
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Fast delivery & premium meals
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Text */}
          <div>

            <span
              className="
                inline-block
                bg-orange-100
                dark:bg-orange-500/15
                text-orange-500
                font-semibold
                px-4
                py-2
                rounded-full
                mb-6
              "
            >
              Why Choose Us
            </span>

            <h2
              className="
                text-4xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-6
                leading-tight
              "
            >
              Your Favorite Meals,
              Anytime Anywhere
            </h2>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                leading-8
                text-lg
                mb-6
              "
            >
              We aim to make food ordering easier,
              faster, and more enjoyable by combining
              modern technology with exceptional
              customer experience.
            </p>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                leading-8
                text-lg
                mb-10
              "
            >
              From burgers and pizzas to desserts
              and healthy meals, FoodieHub provides
              a wide variety of delicious options
              delivered directly to your doorstep.
            </p>

            {/* Features */}
            <div className="space-y-5 mb-10">

              <div className="flex items-start gap-4">

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <UtensilsCrossed
                    size={22}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Premium Food Quality
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400">
                    Freshly prepared meals from
                    trusted restaurants.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <Truck
                    size={22}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Fast Delivery
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400">
                    Quick and reliable doorstep
                    delivery service.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <ShieldCheck
                    size={22}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Safe & Secure Ordering
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400">
                    Secure payments and smooth
                    ordering experience.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <Clock3
                    size={22}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    24/7 Availability
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400">
                    Order your favorite meals
                    anytime you want.
                  </p>

                </div>

              </div>

            </div>

            {/* Button */}
            <Button
              onClick={() => navigate("/menu")}
              className="
                px-8
                py-4
                rounded-2xl
                text-lg
                shadow-lg
              "
            >
              Explore Menu
            </Button>

          </div>

        </div>

      </Container>

    </section>
  );
};

export default About;