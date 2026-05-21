import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";

import { Search } from "lucide-react";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import FoodCard from "../../components/food/FoodCard";

const ITEMS_PER_PAGE = 8;

const Menu = () => {

  const [searchParams] = useSearchParams();

  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [presetTerms, setPresetTerms] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  // Fetch Foods
  useEffect(() => {

    const fetchFoods = async () => {

      try {

        setLoading(true);

        const response = await axios.get(
          "https://dummyjson.com/recipes?limit=100"
        );

        const formattedFoods =
          response.data.recipes.map((item) => ({

            id: item.id,

            name: item.name,

            category:
              item.mealType?.[0] || "Food",

            // Dummy Random Price
            price:
              Math.floor(Math.random() * 20) + 10,

            image: item.image,

            cuisine:
              item.cuisine || "",

            tags:
              item.tags || [],

            description:
              item.instructions?.slice(0, 2).join(" "),

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

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const terms = searchParams.get("terms") || "";
    setSelectedCategory("All");
    setSearchTerm(query);
    setPresetTerms(terms);
  }, [searchParams]);

  // Dynamic Categories
  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        foods.map((food) => food.category)
      ),
    ];

    return ["All", ...uniqueCategories];

  }, [foods]);

  // Filtering
  const filteredFoods = foods.filter((food) => {
    const normalizedSearchTerm =
      searchTerm.toLowerCase().trim();

    const normalizedPresetTerms =
      presetTerms.toLowerCase().trim();

    const queryTerms =
      normalizedSearchTerm
        .split("|")
        .map((term) => term.trim())
        .filter(Boolean);

    const presetQueryTerms =
      normalizedPresetTerms
        .split("|")
        .map((term) => term.trim())
        .filter(Boolean);

    const activeQueryTerms =
      [...new Set([
        ...queryTerms,
        ...presetQueryTerms,
      ])];

    const searchableText =
      [
        food.name,
        food.category,
        food.cuisine,
        food.description,
        ...(food.tags || []),
      ]
        .join(" ")
        .toLowerCase();

    const matchesCategory =
      selectedCategory === "All" ||
      food.category === selectedCategory;

    const matchesSearch =
      activeQueryTerms.length === 0 ||
      activeQueryTerms.some((term) =>
        searchableText.includes(term)
      );

    return matchesCategory && matchesSearch;

  });

  // Pagination
  const totalPages = Math.ceil(
    filteredFoods.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedFoods =
    filteredFoods.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

  // Reset Page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">

      <Container>

        {/* Heading */}
        <div className="text-center mb-14">

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Explore Our Menu
          </h1>

          <p className="text-gray-500 text-lg">
            Discover delicious meals crafted for every taste.
          </p>

        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10 relative">

          <Search
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <Input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPresetTerms("");
            }}
            className="pl-12 py-4"
          />

        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">

          {categories.map((category, index) => (

            <Button
              key={index}
              variant={
                selectedCategory === category
                  ? "primary"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`
                px-5
                py-3
                rounded-full
                capitalize

                ${
                  selectedCategory === category
                    ? ""
                    : `
                      bg-white
                      border
                      border-gray-300
                      text-gray-700
                      hover:border-orange-500
                      hover:text-orange-500
                    `
                }
              `}
            >
              {category}
            </Button>

          ))}

        </div>

        {/* Loading */}
        {
          loading && (

            <div className="text-center py-20">

              <h2 className="text-2xl font-semibold text-gray-600">
                Loading delicious foods...
              </h2>

            </div>

          )
        }

        {/* Empty State */}
        {
          !loading &&
          filteredFoods.length === 0 && (

            <div className="text-center py-20">

              <h2 className="text-3xl font-bold mb-4">
                No Food Found
              </h2>

              <p className="text-gray-500">
                Try changing search or category filters.
              </p>

            </div>

          )
        }

        {/* Food Grid */}
        {
          !loading &&
          filteredFoods.length > 0 && (

            <>
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-4
                  gap-8
                "
              >

                {paginatedFoods.map((food) => (

                  <FoodCard
                    key={food.id}
                    food={food}
                  />

                ))}

              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-16">

                {/* Prev */}
                <Button
                  variant=""
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border
                    border-gray-300
                    text-gray-700
                    hover:border-orange-500
                    hover:text-orange-500
                  "
                >
                  <span className="text-xl font-semibold">‹</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2 flex-wrap justify-center">

                  {
                    [...Array(totalPages)].map((_, index) => (

                      <Button
                        key={index}
                        variant={
                          currentPage === index + 1
                            ? "primary"
                            : ""
                        }
                        onClick={() =>
                          setCurrentPage(index + 1)
                        }
                        className={`
                          w-11
                          h-11
                          rounded-full

                          ${
                            currentPage === index + 1
                              ? ""
                              : `
                                bg-white
                                border
                                border-gray-300
                                text-gray-700
                                hover:border-orange-500
                                hover:text-orange-500
                              `
                          }
                        `}
                      >
                        {index + 1}
                      </Button>

                    ))
                  }

                </div>

                {/* Next */}
                <Button
                  variant=""
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-white
                    border
                    border-gray-300
                    text-gray-700
                    hover:border-orange-500
                    hover:text-orange-500
                  "
                >
                  <span className="text-xl font-semibold">›</span>
                </Button>

              </div>
            </>
          )
        }

      </Container>

    </section>
  );
};

export default Menu;