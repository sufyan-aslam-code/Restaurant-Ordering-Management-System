import { useEffect, useState } from "react";

import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import FoodCard from "../food/FoodCard";

import useApi from "../../hooks/useApi";

import {
  getAllProducts,
} from "../../api/products";

const FeaturedFoods = () => {

  const [foods, setFoods] = useState([]);

  const {
    data,
    loading,
    error,
  } = useApi(() =>
    getAllProducts({
      limit: 8,
    })
  );

  useEffect(() => {

    if (!data?.products) return;

    const formattedFoods =
      data.products.map((item) => ({

        id: item.id,

        name: item.name,

        image: item.image,

        categoryName:
          item.categoryName || "Food",

        description:
          item.description || "",

        price:
          Number(item.price),

        discountPrice:
          Number(item.discountPrice),

        rating:
          item.rating,

        slug:
          item.slug,

        stockQuantity:
          item.stockQuantity,

      }));

    setFoods(formattedFoods);

  }, [data]);

  return (

    <section className="py-20 bg-gray-50 dark:bg-slate-900">

      <Container>

        <SectionHeading
          title="Featured Foods"
          subtitle="Most popular dishes loved by customers"
        />

        {/* LOADING */}
        {loading ? (

          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Loading foods...
          </div>

        ) : error ? (

          <div className="text-center text-red-500 mt-10">
            Failed to load foods
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
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