import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectSearchQuery } from "../features/ui/uiSlice";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useGetProductsQuery } from "../features/products/productApi";

const ITEMS_PER_PAGE = 10;

const AllProducts = () => {
  const searchQuery = useAppSelector(selectSearchQuery);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: productsData, isLoading } = useGetProductsQuery();

  const allProducts = productsData?.success ? productsData.products : [];

  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Calculate filtered products with search and in-stock filter
  const filteredProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by in-stock
    products = products.filter(product => product.inStock);

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (product) => product.name.toLowerCase().includes(query)
      );
    }

    return products;
  }, [allProducts, searchQuery]);

  // Calculate pagination based on filtered products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Update URL when page changes
  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    // Scroll to top
    window.scrollTo(0, 0);
  };

  if (searchQuery && currentPage !== 1) {
    setSearchParams({ page: 1 });
  }
  return (
    <div className="mt-16 flex flex-col">
      <div className="mb-6 text-left">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <p className="mt-2 text-sm text-gray-500">
          {filteredProducts.length} products found
        </p>
        <div className="mt-2 w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
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
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProducts;