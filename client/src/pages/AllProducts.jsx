import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
const ITEMS_PER_PAGE = 10;

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const query =
      typeof searchQuery === "string" ? searchQuery.toLowerCase() : "";

    const filtered = products.filter(
      (product) => product.inStock && product.name.toLowerCase().includes(query)
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="mt-16 flex flex-col">
      <div className="mb-6 text-left">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <p className="mt-2 text-sm text-gray-500">
          {filteredProducts.length} products available
        </p>
        <div className="mt-2 w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-3 md:gap-x-6">
        {currentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default AllProducts;
