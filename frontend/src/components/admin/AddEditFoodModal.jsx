import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { createProduct, updateProduct } from "../../api/products";

const AddEditFoodModal = ({ isOpen, onClose, onSuccess, food = null }) => {
    const isEditMode = Boolean(food);

    // =========================================
    // FORM STATE
    // =========================================
    const initialState = {
        categoryId: "",
        name: "",
        slug: "",
        description: "",
        cuisine: "",
        calories: "",
        ingredients: "",
        tags: "",
        mealType: "",
        price: "",
        discountPrice: "",
        stockQuantity: "",
        rating: "",
    };

    const [formData, setFormData] = useState(initialState);

    // NEW: State for handling the image file and preview
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(false);

    // =========================================
    // PREFILL EDIT DATA
    // =========================================
    useEffect(() => {
        if (!food) {
            setFormData(initialState);
            setImageFile(null);
            setImagePreview("");
            return;
        }

        setFormData({
            categoryId: food.categoryId || "",
            name: food.name || "",
            slug: food.slug || "",
            description: food.description || "",
            cuisine: food.cuisine || "",
            calories: food.calories || "",
            ingredients: food.ingredients?.join(", ") || "",
            tags: food.tags?.join(", ") || "",
            mealType: food.mealType?.join(", ") || "",
            price: food.price || "",
            discountPrice: food.discountPrice || "",
            stockQuantity: food.stockQuantity || "",
            rating: food.rating || "",
        });

        // Set the existing image as the preview
        setImagePreview(
            food.images
                ? food.image.startsWith("http")
                    ? food.image
                    : `http://localhost:5000${food.image}`
                : ""
        );
        setImageFile(null); // Reset file selection when editing a new item
    }, [food]);

    // =========================================
    // HANDLE INPUT CHANGE
    // =========================================
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => {
            const updatedData = { ...prev, [name]: value };

            // AUTO GENERATE SLUG
            if (name === "name") {
                updatedData.slug = value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]+/g, "");
            }

            return updatedData;
        });
    };

    // =========================================
    // HANDLE FILE UPLOAD
    // =========================================
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a temporary URL to preview the newly selected image
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // =========================================
    // HANDLE SUBMIT
    // =========================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        // VALIDATION
        if (Number(formData.discountPrice) > Number(formData.price)) {
            toast.error("Discount price cannot exceed actual price");
            return;
        }

        try {
            setLoading(true);

            // Create FormData object to handle the file upload
            const submitData = new FormData();

            // Append text fields
            submitData.append("categoryId", Number(formData.categoryId));
            submitData.append("name", formData.name);
            submitData.append("slug", formData.slug);
            submitData.append("description", formData.description);
            submitData.append("cuisine", formData.cuisine);
            submitData.append("calories", Number(formData.calories || 0));
            submitData.append("price", Number(formData.price));
            if (formData.discountPrice) submitData.append("discountPrice", Number(formData.discountPrice));
            submitData.append("stockQuantity", Number(formData.stockQuantity || 0));
            submitData.append("rating", Number(formData.rating || 0));

            // Handle Arrays (Backend expects comma-separated strings if using FormData)
            const formatArrayStr = (str) =>
                str.split(",").map((item) => item.trim()).filter(Boolean).join(",");

            submitData.append("ingredients", formatArrayStr(formData.ingredients));
            submitData.append("tags", formatArrayStr(formData.tags));
            submitData.append("mealType", formatArrayStr(formData.mealType));

            // Append the actual image file if the user selected one
            if (imageFile) {
                submitData.append("image", imageFile);
            }

            // UPDATE
            if (isEditMode) {
                // Note: Make sure updateProduct in api/products handles FormData
                await updateProduct(food.id, submitData);
                toast.success("Product updated successfully");
            }
            // CREATE
            else {
                // Note: Make sure createProduct in api/products handles FormData
                await createProduct(submitData);
                toast.success("Product created successfully");
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Product" : "Add Product"}
            maxWidth="max-w-5xl"
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* CATEGORY ID */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Category ID</label>
                    <input
                        type="number"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* PRODUCT NAME */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* SLUG */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Slug</label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* CUISINE */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Cuisine</label>
                    <input
                        type="text"
                        name="cuisine"
                        value={formData.cuisine}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* NEW: IMAGE FILE UPLOAD */}
                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Product Image</label>

                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden group">

                            {/* If an image preview exists, show it */}
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-50 transition" />
                                    <div className="absolute flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 w-full h-full text-white">
                                        <UploadCloud size={32} className="mb-2" />
                                        <p className="text-sm font-semibold">Click to upload a new image</p>
                                    </div>
                                </>
                            ) : (
                                // Default empty state
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon size={32} className="mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold text-orange-500">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">PNG, JPG, WEBP (MAX. 5MB)</p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={loading}
                            />
                        </label>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Description</label>
                    <textarea
                        rows="4"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* INGREDIENTS */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Ingredients</label>
                    <input
                        type="text"
                        name="ingredients"
                        value={formData.ingredients}
                        onChange={handleChange}
                        placeholder="Cheese, Chicken, Sauce"
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* TAGS */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Tags</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Spicy, Fast Food"
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* MEAL TYPE */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Meal Type</label>
                    <input
                        type="text"
                        name="mealType"
                        value={formData.mealType}
                        onChange={handleChange}
                        placeholder="Lunch, Dinner"
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* CALORIES */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Calories</label>
                    <input
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* PRICE */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* DISCOUNT PRICE */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Discount Price</label>
                    <input
                        type="number"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* STOCK */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Stock Quantity</label>
                    <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* RATING */}
                <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Rating</label>
                    <input
                        type="number"
                        step="0.1"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                </div>

                {/* ACTION BUTTONS */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </Button>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddEditFoodModal;