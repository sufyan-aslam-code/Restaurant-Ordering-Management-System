import Button from "../common/Button";
import Container from "../common/Container";

const HeroSection = () => {
  return (
    <section className="py-20">

      <Container>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

          {/* Left Content */}
          <div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              Delicious Food,
              <span className="text-orange-500">
                {" "}Delivered Fast
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Order your favorite meals from the best restaurants
              near you with fast delivery and amazing taste.
            </p>

            <div className="mt-8 flex items-center gap-4">

              <Button>
                Order Now
              </Button>

              <Button variant="secondary">
                Explore Menu
              </Button>

            </div>

          </div>

          {/* Right Content */}
          <div className="flex justify-center">

            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
              alt="Food"
              className="w-full max-w-lg rounded-3xl shadow-xl object-cover"
            />

          </div>

        </div>

      </Container>

    </section>
  );
};

export default HeroSection;