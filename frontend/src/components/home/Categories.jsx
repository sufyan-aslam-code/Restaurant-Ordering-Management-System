import {
  Pizza,
  GlassWater,
  Beef,
  UtensilsCrossed,
  Leaf,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";

// Updated to match your exact database cuisines and tags!
const categories = [
  {
    id: 1,
    title: "Desi Food",
    query: "pakistani|indian|desi|karahi|kebab|keema|masala",
    icon: UtensilsCrossed,
  },
  {
    id: 2,
    title: "Asian Cuisine",
    query: "asian|thai|korean|vietnamese|chinese|stir-fry",
    icon: Globe,
  },
  {
    id: 3,
    title: "Italian & Pizza",
    query: "italian|pizza|pasta|scampi|margherita",
    icon: Pizza,
  },
  {
    id: 4,
    title: "Mexican & Grill",
    query: "mexican|brazilian|enchilada|salsa|corn",
    icon: Beef,
  },
  {
    id: 5,
    title: "Healthy & Vegan",
    query: "vegetarian|vegan|salad|chickpea|healthy",
    icon: Leaf,
  },
  {
    id: 6,
    title: "Drinks",
    query: "cocktail|drink|beverage|mojito|lassi|caipirinha",
    icon: GlassWater,
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
                    `/menu?q=${encodeURIComponent(
                      category.title
                    )}&terms=${encodeURIComponent(category.query)}`
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
                  <Icon size={30} className="text-orange-500" />
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