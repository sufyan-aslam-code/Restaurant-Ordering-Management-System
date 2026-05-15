import { useState } from "react";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import FoodCard from "../../components/food/FoodCard";

const categories = [
  "All",
  "Pizza",
  "Burger",
  "Pasta",
  "Dessert",
  "Drinks",
];

const foods = [
  {
    id: 1,
    name: "Cheese Burger",
    category: "Burger",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },

  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: "$18",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },

  {
    id: 3,
    name: "Creamy Pasta",
    category: "Pasta",
    price: "$15",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9",
  },

  {
    id: 4,
    name: "Chocolate Dessert",
    category: "Dessert",
    price: "$10",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
  },

  {
    id: 5,
    name: "Cold Coffee",
    category: "Drinks",
    price: "$8",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
  },
];

const Menu = () => {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const matchesSearch =
      food.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <Container>

        {/* Heading */}
        <div className="text-center mb-12">

          <h1 className="text-4xl font-bold text-gray-800">
            Our Menu
          </h1>

          <p className="text-gray-500 mt-3">
            Explore our delicious food collection
          </p>

        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">

          <Input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">

          {categories.map((category, index) => (
            <Button
              key={index}
              variant={
                selectedCategory === category
                  ? "primary"
                  : "secondary"
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </Button>
          ))}

        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {filteredFoods.map((food) => (
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

export default Menu;