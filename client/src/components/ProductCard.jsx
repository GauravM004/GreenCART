import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { ShoppingCart, Heart, Zap } from "lucide-react";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } =
    useAppContext();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) return null;

  const discountPercent = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100
  );

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="group h-full bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg border border-slate-100 hover:border-emerald-200"
    >
      <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <img
          src={product.image[0]}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {discountPercent}% OFF
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-green-500 text-green-500" : "text-slate-400"
            }`}
          />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-3 flex flex-col h-full">
        <div className="inline-flex items-center gap-1 mb-2 w-fit">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">
            {product.category}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-3 h-3"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt=""
                />
              ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">(4)</span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-emerald-600">
              {currency}
              {product.offerPrice}
            </span>

            <span className="text-sm text-slate-400 line-through font-medium">
              {currency}
              {product.price}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {!cartItems[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                className="px-3 py-1.5 text-primary border border-primary/40 bg-primary/10 text-xs font-medium rounded-lg hover:bg-primary/20 transition cursor-pointer whitespace-nowrap"
              >
                ADD
              </button>
            ) : (
              <div className="flex items-center bg-primary/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="px-2 py-1 cursor-pointer"
                >
                  −
                </button>
                <span className="px-2 text-sm">{cartItems[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="px-2 py-1 cursor-pointer"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
