import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import useApi from "../../hooks/useApi";
import { getAllProducts } from "../../api/products";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import FoodCard from "../../components/food/FoodCard";

const ITEMS_PER_PAGE = 8;

// 1. Professional Keyword/Tag Based Categories
const MENU_CATEGORIES = [
  { title: "All", query: "" },
  { title: "Desi Food", query: "pakistani|indian|desi|karahi|kebab|keema|masala|biryani" },
  { title: "Asian Cuisine", query: "asian|thai|korean|vietnamese|chinese|stir-fry|japanese" },
  { title: "Italian & Pizza", query: "italian|pizza|pasta|scampi|margherita" },
  { title: "Mexican & Grill", query: "mexican|brazilian|enchilada|salsa|corn|beef" },
  { title: "Healthy & Vegan", query: "vegetarian|vegan|salad|chickpea|healthy" },
  { title: "Drinks", query: "cocktail|drink|beverage|mojito|lassi|caipirinha|smoothie" },
];

const Menu = () => {
  const [searchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);

  const { data, loading, error } = useApi(() =>
    getAllProducts({
      limit: 100,
    })
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [presetTerms, setPresetTerms] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // =========================================
  // SEARCH PARAMS (Routing from Home Page)
  // =========================================
  useEffect(() => {
    const query = searchParams.get("q") || "";
    const terms = searchParams.get("terms") || "";

    const matchedCategory = MENU_CATEGORIES.find((c) => c.title === query);

    if (matchedCategory) {
      setSelectedCategory(matchedCategory.title);
      setPresetTerms(matchedCategory.query);
      setSearchTerm(""); 
    } else if (query) {
      // Manual text search from header/home
      setSelectedCategory("All");
      setPresetTerms("");
      setSearchTerm(query);
    }
  }, [searchParams]);

  // =========================================
  // FORMAT PRODUCTS
  // =========================================
  useEffect(() => {
    if (!data?.products) return;

    const formattedFoods = data.products.map((item) => ({
      ...item,
      id: item.id,
      name: item.name,
      category: item.categoryName || "Food",
      price: Number(item.price),
      discountPrice: item.discountPrice ? Number(item.discountPrice) : null,
      image: item.image,
      cuisine: item.cuisine || "",
      tags: item.tags || [],
      description: item.description || "",
      slug: item.slug,
    }));

    setFoods(formattedFoods);
  }, [data]);

  // =========================================
  // SMART WORD-MATCHING FILTER LOGIC
  // =========================================
  const filteredFoods = foods.filter((food) => {
    // Combine all searchable text into one giant string
    const searchableText = [
      food.name,
      food.category,
      food.cuisine,
      food.description,
      ...(food.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    // 1. Check Category Button Preset Terms (Word Boundary Match)
    let matchesCategory = true;
    if (presetTerms) {
      const presetWords = presetTerms.split("|").map(t => t.trim()).filter(Boolean);
      const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      matchesCategory = presetWords.some((term) => {
        try {
          // \b ensures exact word match. "lassi" will NOT match "classic"
          const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
          return regex.test(searchableText);
        } catch (e) {
          return searchableText.includes(term);
        }
      });
    }

    // 2. Check Search Input Box (Standard Substring Match)
    let matchesSearch = true;
    if (searchTerm.trim()) {
      matchesSearch = searchableText.includes(searchTerm.toLowerCase().trim());
    }

    // Must match both if both are active (e.g. "Asian Cuisine" button + "Beef" typed in box)
    return matchesCategory && matchesSearch;
  });

  // =========================================
  // PAGINATION
  // =========================================
  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFoods = filteredFoods.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // =========================================
  // RESET PAGE ON FILTER CHANGE
  // =========================================
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <section className="py-20 bg-gray-50 min-h-screen dark:bg-slate-950">
      <Container>
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our Menu
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Discover delicious meals crafted for every taste.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-4 dark:bg-slate-900 dark:text-white dark:border-slate-800"
          />
        </div>

        {/* CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {MENU_CATEGORIES.map((category, index) => (
            <Button
              key={index}
              variant={selectedCategory === category.title ? "primary" : ""}
              onClick={() => {
                // If clicking the currently active category, toggle it off to "All"
                if (selectedCategory === category.title) {
                  setSelectedCategory("All");
                  setPresetTerms("");
                } else {
                  setSelectedCategory(category.title);
                  setPresetTerms(category.query);
                }
              }}
              className={`
                px-5 py-3 rounded-full capitalize transition-all
                ${
                  selectedCategory === category.title
                    ? "shadow-md shadow-orange-500/20"
                    : "bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500"
                }
              `}
            >
              {category.title}
            </Button>
          ))}
        </div>

        {/* LOADING & ERROR */}
        {loading && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
              Loading delicious foods...
            </h2>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredFoods.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">No Food Found</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try changing search or category filters.
            </p>
          </div>
        )}

        {/* FOOD GRID */}
        {!loading && !error && filteredFoods.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {paginatedFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <Button
                variant=""
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50"
              >
                <span className="text-xl font-semibold">‹</span>
              </Button>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "primary" : ""}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-11 h-11 rounded-full ${
                      currentPage === index + 1
                        ? ""
                        : "bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500"
                    }`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant=""
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50"
              >
                <span className="text-xl font-semibold">›</span>
              </Button>
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default Menu;