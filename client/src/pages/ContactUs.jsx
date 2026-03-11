import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function ContactUs() {
  const { api } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    try {
      const { data } = await api.post("/api/contact-us/submit", formData);

      if (data.success) {
        toast.success(data.message);
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center text-sm text-slate-800"
    >
      <p className="text-xs bg-green-200 text-green-600 font-medium px-3 py-1 rounded-full mt-10">
        Contact Us
      </p>

      <h1 className="text-4xl font-bold py-4 text-center">
        Let’s Get In Touch.
      </h1>

      <div className="max-w-96 w-full px-4">
        {/* Name */}
        <label className="font-medium">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          className="w-full mt-2 mb-4 px-4 py-2 border border-slate-300 rounded-full outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Email */}
        <label className="font-medium">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
          className="w-full mt-2 mb-4 px-4 py-2 border border-slate-300 rounded-full outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Message */}
        <label className="font-medium">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          placeholder="Enter your message"
          required
          className="w-full mt-2 mb-4 p-3 border border-slate-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2.5 w-full rounded-full transition disabled:opacity-50 cursor-pointer "
        >
          {loading ? "Sending..." : "Submit Form"}
        </button>
      </div>
    </form>
  );
}
