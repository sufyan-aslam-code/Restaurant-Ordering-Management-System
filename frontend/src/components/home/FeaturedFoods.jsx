import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import FoodCard from "../food/FoodCard";

const foods = [
  {
    id: 1,
    name: "Cheese Burger",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },

  {
    id: 2,
    name: "Pepperoni Pizza",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },

  {
    id: 3,
    name: "Chicken Pasta",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
  },

  {
    id: 4,
    name: "Cold Coffee",
    price: 8,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
  },
];

const FeaturedFoods = () => {
  return (
    <section className="py-16">

      <Container>

        <SectionHeading
          title="Featured Foods"
          subtitle="Most popular dishes loved by customers"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
            />
          ))}

        </div>

      </Container>

    </section>
  );
};

export default FeaturedFoods;