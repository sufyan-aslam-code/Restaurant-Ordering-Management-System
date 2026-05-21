import { useEffect, useState } from "react";

import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import FoodCard from "../food/FoodCard";

const FeaturedFoods = () => {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchFoods = async () => {

      try {

        const response = await fetch(
          "https://dummyjson.com/recipes?limit=8"
        );

        const data = await response.json();

        const formattedFoods =
          data.recipes.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.image,
            category: item.cuisine,
            description:
              item.instructions?.slice(0, 2).join(" "),
            price:
              Math.floor(Math.random() * 2000) + 500,
          }));

        setFoods(formattedFoods);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchFoods();

  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-900">

      <Container>

        <SectionHeading
          title="Featured Foods"
          subtitle="Most popular dishes loved by customers"
        />

        {/* Loading */}
        {loading ? (

          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Loading foods...
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-8
              mt-12
            "
          >

            {foods.map((food) => (

              <FoodCard
                key={food.id}
                food={food}
              />

            ))}

          </div>

        )}

      </Container>

    </section>
  );
};

export default FeaturedFoods;