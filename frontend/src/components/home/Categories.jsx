import {
  Pizza,
  Hamburger,
  GlassWater,
  IceCreamBowl,
  Sandwich,
  Beef,
} from "lucide-react";

import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";

const categories = [
  {
    id: 1,
    title: "Pizza",
    icon: Pizza,
  },

  {
    id: 2,
    title: "Burgers",
    icon: Hamburger,
  },

  {
    id: 3,
    title: "Drinks",
    icon: GlassWater,
  },

  {
    id: 4,
    title: "Desserts",
    icon: IceCreamBowl,
  },

  {
    id: 5,
    title: "Fast Food",
    icon: Beef,
  },

  {
    id: 6,
    title: "Sandwiches",
    icon: Sandwich,
  },
];

const Categories = () => {

  return (
    <section className="py-20 bg-white">

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
              <div
                key={category.id}
                className="
                  bg-white
                  border
                  border-gray-100
                  rounded-3xl
                  p-6
                  text-center
                  shadow-sm
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition
                  cursor-pointer
                "
              >

                <div
                  className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-orange-100
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
                  "
                >
                  {category.title}
                </h3>

              </div>
            );
          })}

        </div>

      </Container>

    </section>
  );
};

export default Categories;