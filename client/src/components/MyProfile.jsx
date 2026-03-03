import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

const MyProfile = () => {
  const { user, axios } = useAppContext();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  console.log(user);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name || "",
        lastName: user.lastName || "",
        phone: user.phone || "9328567210",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put("/api/user/update-profile", formData);
      if (data.success) {
        toast.success("Profile updated successfully");
        setEditMode(false);
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
    setEditMode(false);
  };

  if (!user) return null;

  const initials = `${user.name?.[0] || ""}${
    user.name?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-8 pb-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">
          Manage your account and personal details
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT PANEL */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit hover:shadow-md transition-shadow duration-300">
              {/* Header accent */}
              <div className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>

              <div className="px-6 pb-6 text-center">
                {/* Avatar */}
                <div className="flex justify-center -mt-10 mb-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-sm">
                    {initials}
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  {user.name} {user.lastName}
                </h2>
                <p className="text-sm text-slate-500 break-all mt-1">
                  {user.email}
                </p>

                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-6 w-full px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition duration-200 cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}

                {/* Quick Info */}
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 text-left">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                      Account Type
                    </p>
                    <p className="text-slate-900 font-medium text-sm mt-1">
                      Customer
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                      Member Since
                    </p>
                    <p className="text-slate-900 font-medium text-sm mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="px-6 sm:px-8 py-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Personal Details
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  {editMode
                    ? "Update your information below"
                    : "View your account information"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder-slate-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!editMode}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder-slate-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Enter your phone number"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm placeholder-slate-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-slate-200">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition duration-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
