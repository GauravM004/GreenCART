import { useAppSelector } from "../app/hooks";
import { selectCartCount, selectCartAmount, selectCartItems } from "../features/cart/cartSlice";
import { useGetProductsQuery } from "../features/products/productApi";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const FloatingCart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currency = import.meta.env.VITE_CURRENCY;
  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.success ? productsData.products : [];
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const cartAmount = useAppSelector(selectCartAmount);

  const itemCount = cartCount;

  if (itemCount === 0) return null;
  if (location.pathname === "/cart") return null;
  if (location.pathname === "/add-address") return null;
  if (location.pathname === "/seller") return null;
  if (location.pathname === "/seller/Dashboard") return null;
  if (location.pathname === "/seller/orders") return null;
  if (location.pathname === "/seller/product-list") return null;

  const firstCartProduct = products.find((p) => cartItems[p._id]);

  return (
    <div
      onClick={() => navigate("/cart")}
      style={{ animation: "cartSlideUp 0.25s ease-out" }}
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        inline-flex items-center
        gap-3
        bg-primary
        rounded-full
        px-6 py-2
        shadow-lg
        cursor-pointer
        z-50
        transition-transform duration-200
        hover:scale-[1.02]
      "
    >
      <div className="-ml-4 w-7 h-7 bg-white rounded-full flex items-center justify-center">
        <img
          src={firstCartProduct?.image?.[0]}
          alt=""
          className="w-4.5 h-4.5 object-contain"
        />
      </div>

      <div className="text-white leading-tight whitespace-nowrap">
        <p className="font-semibold text-[13px]">View cart</p>
        <p className="text-[11px] opacity-90">
          {itemCount} item{itemCount > 1 ? "s" : ""} • {currency}
          {cartAmount}
        </p>
      </div>

      <span className="text-white text-sm font-semibold ml-1">→</span>
    </div>
  );
};

export default FloatingCart;