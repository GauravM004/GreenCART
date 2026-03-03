import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();
  const shuffled = [...products]
    .filter((p) => p.inStock)
    

  const bestSellers = Object.values(
    shuffled.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = product;
      }
      return acc;
    }, {})
  ).slice(0, 5);

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {bestSellers
          .map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default BestSeller;
