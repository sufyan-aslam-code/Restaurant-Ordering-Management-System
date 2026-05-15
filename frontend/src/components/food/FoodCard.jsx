import Button from "../common/Button";

const FoodCard = ({ food }) => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        overflow-hidden
        shadow-md
        hover:shadow-xl
        transition
      "
    >

      <img
        src={food.image}
        alt={food.name}
        className="
          w-full
          h-52
          object-cover
        "
      />

      <div className="p-5">

        <div className="flex items-center justify-between mb-3">

          <h2 className="text-xl font-semibold text-gray-800">
            {food.name}
          </h2>

          <span className="text-orange-500 font-bold">
            {food.price}
          </span>

        </div>

        <p className="text-gray-500 text-sm mb-4">
          {food.category}
        </p>

        <Button className="w-full">
          Add To Cart
        </Button>

      </div>

    </div>
  );
};

export default FoodCard;