import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { user, products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((p) => p._id === id);
 console.log(product);
  useEffect(() => {
    if (products.length && product) {
      const related = products.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(related.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  if (!product) return null;

  return (
    <div className="mt-12">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /
        <Link to="/products" className="hover:text-primary">
          {" "}
          Products
        </Link>{" "}
        /
        <Link
          to={`/products/${product.category.toLowerCase()}`}
          className="hover:text-primary"
        >
          {" "}
          {product.category}
        </Link>{" "}
        / <span className="text-primary">{product.name}</span>
      </p>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row gap-14 mt-6 rounded-[28px] border border-gray-300/60 px-6 py-8">
        {/* Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.image.map((img, i) => (
              <div
                key={i}
                onClick={() => setThumbnail(img)}
                className={`
                  w-20 h-20 border rounded-lg overflow-hidden cursor-pointer
                  ${thumbnail === img ? "border-primary" : "border-gray-300"}
                `}
              >
                <img
                  src={img}
                  alt=""
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 w-[320px] h-[320px] flex items-center justify-cente bg-gray-50">
            <img
              src={thumbnail}
              alt={product.name}
              className="max-h-full object-contain"
            />
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  className="w-4"
                  alt=""
                />
              ))}
            <span className="text-sm text-gray-500 ml-2">(4 ratings)</span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-3xl font-semibold text-primary">
              {currency}
              {product.offerPrice}
              <span className="ml-3 text-lg text-gray-400 line-through">
                {currency}
                {product.price}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="font-medium text-gray-800 mb-2">About this product</p>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              {product.description.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Before placing your order, please login first!");
                  return;
                }
                addToCart(product._id);
              }}
              className="
    flex-1 py-3 rounded-lg font-medium
    bg-primary/10 text-primary
    hover:bg-primary/20 transition cursor-pointer
  "
            >
              Add to cart
            </button>

            <button
              onClick={() => {
                if (!user) {
                  toast.error("Before placing your order, please login first!");
                } else {
                  addToCart(product._id);
                  navigate("/cart");
                }
              }}
              className="
                flex-1 py-3 rounded-lg font-medium
                bg-primary text-white
                hover:bg-primary-dull transition cursor-pointer
              "
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold">Related Products</h2>
          <div className="mx-auto mt-2 w-20 h-1 bg-primary rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-4">
          {relatedProducts
            .filter((p) => p.inStock)
            .map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="block mx-auto mt-14 px-10 py-2.5 border rounded-lg text-primary hover:bg-primary/10 transition"
        >
          See more products
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
