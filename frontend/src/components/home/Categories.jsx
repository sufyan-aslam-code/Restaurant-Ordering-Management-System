import {
  Pizza,
  Hamburger,
  GlassWater,
  IceCreamBowl,
  Sandwich,
  Beef,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";

const categories = [
  {
    id: 1,
    title: "Pizza",
    query: "pizza",
    icon: Pizza,
  },

  {
    id: 2,
    title: "Burgers",
    query: "burger",
    icon: Hamburger,
  },

  {
    id: 3,
    title: "Drinks",
    query: "drink|beverage|juice",
    icon: GlassWater,
  },

  {
    id: 4,
    title: "Desserts",
    query: "dessert|sweet|cookie|cake|ice cream",
    icon: IceCreamBowl,
  },

  {
    id: 5,
    title: "Fast Food",
    query: "fast food|burger|pizza|sandwich|fries|chicken",
    icon: Beef,
  },

  {
    id: 6,
    title: "Sandwiches",
    query: "sandwich",
    icon: Sandwich,
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white dark:bg-slate-950">

      <Container>

        <SectionHeading
          title="Popular Categories"
          subtitle="Explore your favorite food categories"
        />

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6
            gap-6
            mt-12
          "
        >

          {categories.map((category) => {

            const Icon = category.icon;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  navigate(
                    `/menu?q=${encodeURIComponent(category.title)}&terms=${encodeURIComponent(category.query)}`
                  )
                }
                className="
                  bg-white
                  dark:bg-slate-900
                  border
                  border-gray-100 dark:border-slate-700
                  rounded-3xl
                  p-6
                  text-center
                  shadow-sm
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition
                  cursor-pointer
                  w-full
                "
              >

                <div
                  className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-orange-100 dark:bg-orange-500/15
                    flex
                    items-center
                    justify-center
                    mb-4
                  "
                >

                  <Icon
                    size={30}
                    className="text-orange-500"
                  />

                </div>

                <h3
                  className="
                    font-semibold
                    text-gray-800
                    dark:text-gray-100
                  "
                >
                  {category.title}
                </h3>

              </button>
            );
          })}

        </div>

      </Container>

    </section>
  );
};

export default Categories;