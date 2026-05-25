import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  Mail, 
  Phone, 
  User, 
  Shield, 
  Lock, 
  Key, 
  UserCircle, 
  Eye, 
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    loadingProfile,
    updateProfile,
    updatePassword,
  } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState("general");

  // General Profile State
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Security (Password) State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Password Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loadingProfile && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loadingProfile, navigate]);

  useEffect(() => {
    if (!user) return;

    setProfileData({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
    });
    
    if (user.profileImageUrl) {
      const imageUrl = user.profileImageUrl.startsWith("http")
        ? user.profileImageUrl
        : `http://localhost:5000${user.profileImageUrl}`;
      setProfileImagePreview(imageUrl);
    } else {
      setProfileImagePreview("");
    }
    
    setSelectedProfileImage(null);
  }, [user]);

  const previewImageUrl = useMemo(
    () => profileImagePreview?.trim() || "",
    [profileImagePreview]
  );

  // Handlers
  const handleProfileFieldChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordFieldChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file");
      setTimeout(() => setProfileError(""), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image must be smaller than 5MB");
      setTimeout(() => setProfileError(""), 3000);
      return;
    }

    setSelectedProfileImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setProfileImagePreview(e.target?.result);
    reader.readAsDataURL(file);

    setProfileMessage("✓ Image selected! Click 'Save Profile' to save.");
    setTimeout(() => setProfileMessage(""), 2000);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");
    setProfileError("");

    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("phoneNumber", profileData.phoneNumber);
      if (selectedProfileImage) {
        formData.append("profileImage", selectedProfileImage);
      }

      const response = await updateProfile(formData);
      
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

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordMessage("");
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      setSavingPassword(false);
      return;
    }

    try {
      const response = await updatePassword(passwordData);
      
      setPasswordMessage(response.message || "Password updated successfully.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Reset visibility toggles on successful save
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      
      setSavingPassword(false);
    } catch (error) {
      setPasswordError(
        error?.response?.data?.message || "Unable to update password right now."
      );
      setSavingPassword(false);
    }
  };

  if (loadingProfile) {
    return (
      <section className="py-20 min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 min-h-screen bg-[#f8f4ee] dark:bg-slate-950">
      <Container>
        {/* Expanded Max Width and 12-Column Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Avatar & Identity Card (Takes 4 columns on large screens) */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-8 h-fit sticky top-24">
              <div className="flex flex-col items-center text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer relative group"
                >
                  {previewImageUrl ? (
                    <img
                      src={previewImageUrl}
                      alt={profileData.fullName || "Profile"}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-orange-50 dark:ring-orange-500/10 group-hover:opacity-80 transition-all duration-300 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-500/5 text-orange-600 dark:text-orange-500 text-4xl sm:text-5xl font-bold flex items-center justify-center ring-4 ring-white dark:ring-slate-900 group-hover:opacity-80 transition-all duration-300 shadow-lg">
                      {(profileData.fullName || "U")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase() || "")
                        .join("")}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/30 backdrop-blur-[1px] transition-all duration-300">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={28} />
                  </div>
                  
                  {/* Small edit badge */}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white dark:bg-slate-800 p-2 rounded-full shadow-md text-orange-500 border border-gray-100 dark:border-slate-700 pointer-events-none group-hover:scale-110 transition-transform">
                    <Camera size={16} />
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {user?.fullName || "User"}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {user?.email}
                  </p>
                </div>
                
                {/* Visual Divider */}
                <div className="w-12 h-1 bg-orange-100 dark:bg-slate-800 rounded-full mt-6"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Settings (Takes 8 columns on large screens) */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none p-8 sm:p-10">
              
              {/* Tab Navigation */}
              <div className="flex space-x-8 border-b border-gray-100 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`pb-4 text-sm sm:text-base font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "general"
                      ? "text-orange-600 dark:text-orange-500"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <UserCircle size={20} className={activeTab === "general" ? "text-orange-500" : ""} />
                  General Information
                  {activeTab === "general" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 dark:bg-orange-500 rounded-t-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`pb-4 text-sm sm:text-base font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "security"
                      ? "text-orange-600 dark:text-orange-500"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Shield size={20} className={activeTab === "security" ? "text-orange-500" : ""} />
                  Security Settings
                  {activeTab === "security" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 dark:bg-orange-500 rounded-t-full" />
                  )}
                </button>
              </div>

              {/* Tab Content: General Profile */}
              {activeTab === "general" && (
                <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onSubmit={handleProfileSubmit}>
                  
                  {/* Alerts */}
                  {profileMessage && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <p>{profileMessage}</p>
                    </div>
                  )}

                  {profileError && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                      <AlertCircle size={18} className="shrink-0" />
                      <p>{profileError}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 group">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileFieldChange}
                        placeholder="e.g. John Doe"
                        className="w-full pl-11 py-3.5 bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        type="text"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleProfileFieldChange}
                        placeholder="e.g. +1 234 567 8900"
                        className="w-full pl-11 py-3.5 bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full pl-11 py-3.5 bg-gray-100 dark:bg-slate-800 text-gray-500 cursor-not-allowed opacity-70 border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <p className="text-xs text-gray-400 ml-1 mt-1">Email address cannot be changed.</p>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={savingProfile} className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {savingProfile ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        "Save Profile Changes"
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {/* Tab Content: Security */}
              {activeTab === "security" && (
                <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onSubmit={handlePasswordSubmit}>
                  
                  {/* Alerts */}
                  {passwordMessage && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <p>{passwordMessage}</p>
                    </div>
                  )}

                  {passwordError && (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                      <AlertCircle size={18} className="shrink-0" />
                      <p>{passwordError}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 group">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Current Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordFieldChange}
                        placeholder="Enter your current password"
                        className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        tabIndex="-1"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">New Password</label>
                    <div className="relative">
                      <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordFieldChange}
                        placeholder="Create a new password"
                        className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        tabIndex="-1"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordFieldChange}
                        placeholder="Type your new password again"
                        className="w-full pl-11 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        tabIndex="-1"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={savingPassword} className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {savingPassword ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Profile;