import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, Star } from "lucide-react";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/recipes/${id}`);
        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <section className="py-20 min-h-screen bg-gray-50">
        <Container>
          <p className="text-center text-gray-500 text-lg">Loading product details...</p>
        </Container>
      </section>
    );
  }

  if (!food || !food.id) {
    return (
      <section className="py-20 min-h-screen bg-gray-50">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Button onClick={() => navigate("/menu")} className="px-6 py-3 rounded-xl">
              Back To Menu
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const description =
    food.instructions && food.instructions.length > 0
      ? food.instructions.slice(0, 2).join(" ")
      : "Freshly prepared with premium ingredients and rich flavors.";

  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Container>
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div>
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-[420px] object-cover rounded-3xl"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold mb-3">
              {food.mealType?.[0] || food.cuisine || "Food"}
            </p>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{food.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-1 bg-orange-50 px-3 py-2 rounded-full text-sm font-semibold text-orange-600">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                {food.rating || 4.8}
              </span>

              <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-sm text-gray-700">
                <Clock3 size={16} className="text-orange-500" />
                {food.cookTimeMinutes || 25} min
              </span>
            </div>

            <p className="text-gray-600 leading-8 mb-8">{description}</p>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Ingredients</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {(food.ingredients || []).slice(0, 10).map((ingredient, index) => (
                <li key={index} className="text-gray-700 flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() =>
                addToCart({
                  id: food.id,
                  name: food.name,
                  image: food.image,
                  category: food.mealType?.[0] || food.cuisine || "Food",
                  price: Math.floor(Math.random() * 20) + 10,
                })
              }
              className="px-8 py-4 rounded-2xl text-lg shadow-lg"
            >
              Add To Cart
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductDetails;
