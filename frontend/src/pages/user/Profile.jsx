import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Camera,
  Mail,
  Phone,
  User,
  Package,
  Truck,
} from "lucide-react";

import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../api/orders";

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toFixed(2)}`;

const statusLabelMap = {
  placed: "Placed",
  preparing: "Preparing",
  on_the_way: "On The Way",
  delivered: "Delivered",
};

const Profile = () => {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    loadingProfile,
    updateProfile,
  } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
  });

  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loadingProfile && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loadingProfile, navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileData({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
    });
    
    // Load image from user profile (from database)
    if (user.profileImageUrl) {
      // Build full URL - profileImageUrl is stored as /uploads/filename
      const imageUrl = user.profileImageUrl.startsWith("http")
        ? user.profileImageUrl
        : `http://localhost:5000${user.profileImageUrl}`;
      setProfileImagePreview(imageUrl);
    } else {
      setProfileImagePreview("");
    }
    
    // Clear selected image
    setSelectedProfileImage(null);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const response = await getMyOrders();
        setOrders(response.data.orders || []);
      } catch (error) {
        setOrdersError(
          error?.response?.data?.message || "Unable to load your orders."
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  const previewImageUrl = useMemo(
    () => profileImagePreview?.trim() || "",
    [profileImagePreview]
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setProfileData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file");
      setTimeout(() => setProfileError(""), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image must be smaller than 5MB");
      setTimeout(() => setProfileError(""), 3000);
      return;
    }

    // Store the file for later submission
    setSelectedProfileImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);

    setProfileMessage("✓ Image selected! Click 'Save Profile' to save.");
    setTimeout(() => setProfileMessage(""), 2000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSavingProfile(true);
    setProfileMessage("");
    setProfileError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("phoneNumber", profileData.phoneNumber);
      if (selectedProfileImage) {
        formData.append("profileImage", selectedProfileImage);
      }

      // Call updateProfile with FormData
      const response = await updateProfile(formData);
      
      // Clear selected image after successful save
      setSelectedProfileImage(null);
      localStorage.removeItem("profileImagePreview");
      
      setProfileMessage(response.message || "Profile saved.");
    } catch (error) {
      setProfileError(
        error?.response?.data?.message || "Unable to save profile right now."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (loadingProfile) {
    return (
      <section className="py-20 min-h-screen bg-gray-50">
        <Container>
          <p className="text-center text-gray-500">Loading profile...</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 h-fit">
            <div className="flex flex-col items-center text-center">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Clickable profile image */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer relative group"
              >
                {previewImageUrl ? (
                  <img
                    src={previewImageUrl}
                    alt={profileData.fullName || "Profile"}
                    className="w-28 h-28 rounded-full object-cover border-4 border-orange-100 group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-orange-100 text-orange-600 text-3xl font-bold flex items-center justify-center border-4 border-orange-100 group-hover:opacity-75 transition-opacity">
                    {(profileData.fullName || "U")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() || "")
                      .join("")}
                  </div>
                )}
                {/* Hover overlay hint */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
              </div>

              <h1 className="mt-5 text-2xl font-bold text-gray-900">
                {user?.fullName || "User"}
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Profile Settings
              </h2>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {profileMessage ? (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {profileMessage}
                  </div>
                ) : null}

                {profileError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {profileError}
                  </div>
                ) : null}

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <Input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleFieldChange}
                    placeholder="Full name"
                    className="pl-11 py-3"
                  />
                </div>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <Input
                    type="text"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleFieldChange}
                    placeholder="Phone number"
                    className="pl-11 py-3"
                  />
                </div>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="pl-11 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-3 rounded-xl"
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </div>

            <div id="orders" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                My Orders
              </h2>

              {ordersLoading ? (
                <p className="text-gray-500">Loading your orders...</p>
              ) : null}

              {ordersError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {ordersError}
                </div>
              ) : null}

              {!ordersLoading && !ordersError && orders.length === 0 ? (
                <p className="text-gray-500">No orders yet. Place your first order from the menu.</p>
              ) : null}

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-gray-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm text-gray-500">Tracking ID</p>
                      <p className="font-semibold text-gray-900">{order.trackingId}</p>

                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Package size={15} />
                          {statusLabelMap[order.status] || order.status}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Truck size={15} />
                          {order.estimatedDeliveryMinutes} mins
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-bold text-orange-500">
                        {formatCurrency(order.totalAmount)}
                      </p>

                      <Link
                        to={`/track-order?tracking=${encodeURIComponent(order.trackingId)}`}
                        className="inline-block mt-2 text-sm font-semibold text-orange-500 hover:text-orange-600"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Profile;
