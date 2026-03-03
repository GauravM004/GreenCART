import React, { useState } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const { axios } = useAppContext();

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();

      const productData = {
        name,
        description: description.split("\n"),
        category,
        price,
        offerPrice,
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("/api/product/add", formData);

      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50">
      <div className="max-w-4xl mx-auto md:p-10 p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Add New Product
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and publish a new product to your store
          </p>
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-8"
        >
          {/* IMAGE UPLOAD */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Product Images
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`image${index}`}
                    className="relative cursor-pointer group"
                  >
                    <input
                      hidden
                      type="file"
                      id={`image${index}`}
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                    />

                    <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group-hover:border-primary transition">
                      <img
                        src={
                          files[index]
                            ? URL.createObjectURL(files[index])
                            : assets.upload_area
                        }
                        alt="upload"
                        className="object-contain w-16 opacity-70 group-hover:opacity-100 transition"
                      />
                    </div>
                  </label>
                ))}
            </div>
          </div>

          {/* BASIC INFO */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Product Name
            </h2>

            <div className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:outline-none"
                placeholder="Product name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Product Description
              </h2>
              <textarea
                rows={4}
                placeholder="Product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((item, index) => (
                  <option key={index} value={item.path}>
                    {item.path}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRICING */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Pricing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Original price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />

              <input
                type="number"
                placeholder="Offer price"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-10 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dull transition shadow-md cursor-pointer"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
