import { useNavigate } from "react-router-dom";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";

const About = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <Container>

        {/* Heading */}
        <div className="text-center mb-14">

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About FoodieHub
          </h1>

          <p className="max-w-3xl mx-auto text-gray-500 leading-8">
            FoodieHub is a modern online food ordering platform
            designed to deliver delicious meals quickly and
            efficiently. We connect food lovers with their
            favorite restaurants through a seamless and modern
            digital experience.
          </p>

        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Image */}
          <div>

            <img
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1"
              alt="About FoodieHub"
              className="
                w-full
                h-[450px]
                object-cover
                rounded-3xl
                shadow-lg
              "
            />

          </div>

          {/* Text */}
          <div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Delicious Food, Delivered With Care
            </h2>

            <p className="text-gray-500 leading-8 mb-6">
              Our mission is to make food ordering easier,
              faster, and more enjoyable for everyone. From
              freshly prepared meals to quick doorstep delivery,
              FoodieHub focuses on quality service and customer
              satisfaction.
            </p>

            <p className="text-gray-500 leading-8 mb-8">
              Whether you are craving burgers, pizzas, desserts,
              or healthy meals, FoodieHub offers a wide variety
              of options to satisfy every appetite.
            </p>

            <Button
              onClick={() => navigate("/menu")}
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