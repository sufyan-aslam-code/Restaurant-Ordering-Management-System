import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import Container from "../common/Container";

const HeroSection = () => {

  const navigate = useNavigate();

  return (
    <section
      className="
        py-20
        bg-gradient-to-br
        from-orange-50
        to-white
      "
    >

      <Container>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-14
            items-center
          "
        >

          {/* Left Side */}
          <div>

            <span
              className="
                inline-block
                bg-orange-100
                text-orange-500
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                mb-6
              "
            >
              Fast Delivery & Fresh Food
            </span>

            <h1
              className="
                text-5xl
                lg:text-6xl
                font-bold
                leading-tight
                text-gray-900
              "
            >
              Delicious Food
              <span className="text-orange-500">
                {" "}Delivered Fast
              </span>
            </h1>

            <p
              className="
                mt-6
                text-lg
                text-gray-600
                leading-8
                max-w-xl
              "
            >
              Order your favorite meals from
              top restaurants near you with
              fast delivery and amazing taste.
            </p>

            <div className="flex items-center gap-4 mt-8">

              <Button
                onClick={() => navigate("/menu")}
              >
                Order Now
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/menu")}
              >
                Explore Menu
              </Button>

            </div>

          </div>

          {/* Right Side */}
          <div>

            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
              alt="Food"
              className="
                w-full
                h-[500px]
                object-cover
                rounded-3xl
                shadow-xl
              "
            />

          </div>

        </div>

      </Container>

    </section>
  );
};

export default HeroSection;