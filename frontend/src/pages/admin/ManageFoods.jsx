import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Package,
} from "lucide-react";

import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import ConfirmModal from "../../components/common/ConfirmModal";

import {
  getAllProducts,
  deleteProduct,
} from "../../api/products";

import Button from "../../components/common/Button";

import AddEditFoodModal from "../../components/admin/AddEditFoodModal";

const ManageFoods = () => {

  // =========================================
  // STATES
  // =========================================

  const [searchTerm, setSearchTerm] =
    useState("");

  const [foods, setFoods] =
    useState([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedFood, setSelectedFood] =
    useState(null);

  const [deleteModal, setDeleteModal] =
    useState({
      open: false,
      food: null,
    });

  const [deleteLoading, setDeleteLoading] =
    useState(false);


  // =========================================
  // FETCH PRODUCTS
  // =========================================

  const {
    data,
    loading,
    error,
  } = useApi(() =>
    getAllProducts({
      limit: 100,
    })
  );


  // =========================================
  // SET PRODUCTS
  // =========================================

  useEffect(() => {

    if (!data?.products) return;

    setFoods(data.products);

  }, [data]);


  // =========================================
  // REFRESH PRODUCTS
  // =========================================

  const refreshFoods = async () => {

    try {

      const response =
        await getAllProducts({
          limit: 100,
        });

      setFoods(
        response.data.products
      );

    } catch (error) {

      toast.error(
        "Failed to refresh products"
      );

    }

  };


  // =========================================
  // SEARCH FILTER
  // =========================================

  const filteredFoods = useMemo(() => {

    return foods.filter((food) => {

      const searchableText = `
        ${food.name}
        ${food.description}
        ${food.categoryName}
        ${food.cuisine}
      `
        .toLowerCase();

      return searchableText.includes(
        searchTerm.toLowerCase()
      );

    });

  }, [foods, searchTerm]);


  // =========================================
  // OPEN ADD MODAL
  // =========================================

  const openAddModal = () => {

    setSelectedFood(null);

    setIsModalOpen(true);

  };


  // =========================================
  // OPEN EDIT MODAL
  // =========================================

  const openEditModal = (food) => {

    setSelectedFood(food);

    setIsModalOpen(true);

  };


  // =========================================
  // DELETE FOOD
  // =========================================

  const handleDelete = async () => {

    if (!deleteModal.food) return;

    try {

      setDeleteLoading(true);

      await deleteProduct(
        deleteModal.food.id
      );

      setFoods((prev) =>
        prev.filter(
          (food) =>
            food.id !==
            deleteModal.food.id
        )
      );

      toast.success(
        `${deleteModal.food.name} deleted successfully`
      );

      setDeleteModal({
        open: false,
        food: null,
      });

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to delete product"
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  return (

    <div className="max-w-7xl mx-auto">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
            "
          >
            Manage Foods
          </h1>

          <p
            className="
              text-gray-500
              mt-1
            "
          >
            Manage all restaurant menu items.
          </p>

        </div>


        {/* ADD BUTTON */}
        <Button
          onClick={openAddModal}
          className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-2xl
            shadow-md
          "
        >

          <Plus size={18} />

          Add New Food

        </Button>

      </div>


      {/* ========================================= */}
      {/* TOOLBAR */}
      {/* ========================================= */}

      <div
        className="
          bg-white
          border
          border-gray-100
          rounded-t-3xl
          p-5
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        "
      >

        {/* SEARCH */}
        <div
          className="
            relative
            w-full
            max-w-md
          "
        >

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="
              w-full
              pl-11
              pr-4
              py-3
              rounded-2xl
              border
              border-gray-200
              bg-gray-50
              focus:outline-none
              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-100
              transition
            "
          />

        </div>


        {/* TOTAL */}
        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-gray-500
            whitespace-nowrap
          "
        >

          <Package
            size={16}
            className="text-orange-500"
          />

          <span>Total Foods:</span>

          <span
            className="
              font-bold
              text-gray-900
            "
          >
            {filteredFoods.length}
          </span>

        </div>

      </div>


      {/* ========================================= */}
      {/* PRODUCTS */}
      {/* ========================================= */}

      <div
        className="
          bg-white
          border
          border-t-0
          border-gray-100
          rounded-b-3xl
          shadow-sm
          p-6
        "
      >

        {loading ? (

          <div
            className="
              p-14
              text-center
            "
          >

            <div
              className="
                w-10
                h-10
                border-4
                border-orange-500
                border-t-transparent
                rounded-full
                animate-spin
                mx-auto
                mb-4
              "
            />

            <p className="text-gray-500">
              Loading foods...
            </p>

          </div>

        ) : error ? (

          <div
            className="
              p-14
              text-center
              text-red-500
            "
          >
            Failed to load foods
          </div>

        ) : filteredFoods.length > 0 ? (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >

            {filteredFoods.map((food) => {

              const isInStock =
                Number(
                  food.stockQuantity
                ) > 0;

              return (

                <div
                  key={food.id}
                  className="
                    bg-white
                    border
                    border-gray-100
                    rounded-3xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-xl
                    transition-all
                    duration-300
                  "
                >

                  {/* IMAGE */}
                  <div className="relative">

                    <img
                      src={
                        food.image?.startsWith("http")
                          ? food.image
                          : `http://localhost:5000${food.image}`
                      }
                      alt={food.name}
                      className="
    w-full
    h-56
    object-cover
  "
                    />

                    {/* RATING */}
                    <div
                      className="
                        absolute
                        top-4
                        left-4
                        bg-white
                        px-3
                        py-1.5
                        rounded-full
                        flex
                        items-center
                        gap-1
                        shadow-md
                      "
                    >

                      <Star
                        size={15}
                        className="
                          fill-yellow-400
                          text-yellow-400
                        "
                      />

                      <span
                        className="
                          text-sm
                          font-semibold
                        "
                      >
                        {Number(
                          food.rating || 0
                        ).toFixed(1)}
                      </span>

                    </div>

                  </div>


                  {/* CONTENT */}
                  <div className="p-5">

                    {/* CATEGORY */}
                    <div className="mb-3">

                      <span
                        className="
                          inline-flex
                          items-center
                          px-3
                          py-1
                          rounded-full
                          bg-orange-100
                          text-orange-600
                          text-xs
                          font-semibold
                        "
                      >

                        {
                          food.categoryName ||
                          "Food"
                        }

                      </span>

                    </div>


                    {/* NAME */}
                    <h2
                      className="
                        text-xl
                        font-bold
                        text-gray-900
                        line-clamp-1
                      "
                    >
                      {food.name}
                    </h2>


                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-2
                        line-clamp-2
                        min-h-[42px]
                      "
                    >
                      {
                        food.description
                      }
                    </p>


                    {/* PRICE */}
                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-2xl
                            font-extrabold
                            text-orange-500
                          "
                        >

                          Rs. {
                            Number(
                              food.discountPrice ||
                              food.price ||
                              0
                            ).toLocaleString()
                          }

                        </p>


                        {food.discountPrice && (

                          <p
                            className="
                              text-sm
                              text-gray-400
                              line-through
                            "
                          >

                            Rs. {
                              Number(
                                food.price
                              ).toLocaleString()
                            }

                          </p>

                        )}

                      </div>


                      {/* STOCK */}
                      <span
                        className={`
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-semibold

                          ${isInStock
                            ? `
                                bg-green-100
                                text-green-700
                              `
                            : `
                                bg-red-100
                                text-red-700
                              `
                          }
                        `}
                      >

                        {
                          isInStock
                            ? `${food.stockQuantity} In Stock`
                            : "Out of Stock"
                        }

                      </span>

                    </div>


                    {/* ACTIONS */}
                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        gap-3
                      "
                    >

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          openEditModal(food)
                        }
                        className="
                          flex-1
                          h-12
                          rounded-2xl
                          bg-blue-50
                          text-blue-600
                          hover:bg-blue-100
                          transition
                          flex
                          items-center
                          justify-center
                          gap-2
                          font-semibold
                        "
                      >

                        <Edit size={18} />

                        Edit

                      </button>


                      {/* DELETE */}
                      <button
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            food,
                          })
                        }
                        className="
                          flex-1
                          h-12
                          rounded-2xl
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          transition
                          flex
                          items-center
                          justify-center
                          gap-2
                          font-semibold
                        "
                      >

                        <Trash2 size={18} />

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        ) : (

          <div
            className="
              py-20
              text-center
              text-gray-500
            "
          >

            No foods found.

          </div>

        )}

      </div>


      {/* ========================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ========================================= */}

      <AddEditFoodModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onSuccess={refreshFoods}
        food={selectedFood}
      />
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Food"
        message={`Are you sure you want to delete "${deleteModal.food?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onCancel={() =>
          setDeleteModal({
            open: false,
            food: null,
          })
        }
        onConfirm={handleDelete}
      />

    </div>

  );

};

export default ManageFoods;