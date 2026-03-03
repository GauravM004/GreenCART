import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Package, TrendingUp, Search, Filter, Calendar, Tag } from "lucide-react";

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="md:p-10 p-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Product Inventory
              </h2>
              <p className="text-sm text-gray-600">Manage your product stock and availability</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">In Stock</p>
                <p className="text-3xl font-bold text-green-600">{inStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Out of Stock</p>
                <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Product</th>
                  <th className="px-6 py-4 text-left font-semibold">Category</th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold hidden md:table-cell">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Stock Toggle</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-green-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-gray-200">
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate mb-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            #{product._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                        <Tag className="w-3.5 h-3.5" />
                        {product.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-base">
                        {currency}{product.offerPrice}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                          ${
                            product.inStock
                              ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                              : "bg-red-100 text-red-700 ring-1 ring-red-200"
                          }
                        `}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(product.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={() =>
                            toggleStock(product._id, !product.inStock)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all duration-300 shadow-inner group-hover:shadow-lg"></div>
                        <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-7 shadow-md"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No products match your search' : 'No products found'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-3 text-green-600 hover:text-green-700 font-semibold text-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {filteredProducts.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredProducts.length} of {totalProducts} products
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;