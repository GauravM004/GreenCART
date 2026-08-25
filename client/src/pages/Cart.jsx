import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectCartCount, selectCartAmount, removeFromCart, updateCartItem, setCartItems, selectCartItems } from "../features/cart/cartSlice";
import { selectAuthUser } from "../features/auth/authSlice";
import { useGetProductsQuery } from "../features/products/productApi";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import SuccessPage from "../components/SuccessPage";
import { useGetAddressesQuery } from "../features/address/addressApi";
import { usePlaceCodOrderMutation, usePlaceStripeOrderMutation } from "../features/orders/orderApi";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const { data: productsData } = useGetProductsQuery();
  const products = productsData?.success ? productsData.products : [];
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const cartAmount = useAppSelector(selectCartAmount);
  const user = useAppSelector(selectAuthUser);

  const MAX_SHIPPING_FEE = 80;

  const shippingFee = Math.min((cartAmount * 25) / 100, MAX_SHIPPING_FEE);

  const tax = (cartAmount * 2) / 100;
  const totalAmount = cartAmount + shippingFee + tax;
  const [cartArray, setCartArray] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { data: addressData } = useGetAddressesQuery();
  const [placeCodOrder] = usePlaceCodOrderMutation();
  const [placeStripeOrder] = usePlaceStripeOrderMutation();
  const addresses = addressData?.success ? addressData.addresses : [];

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);
      if (!product) continue;
      tempArray.push({ ...product, quantity: cartItems[key] });
    }
    setCartArray(tempArray);
  };

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      // Place Order with COD
      if (paymentOption === "COD") {
        const result = await placeCodOrder({
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (result.data?.success) {
          setOrderPlaced(true);
          toast.success(result.data.message);
          dispatch(setCartItems({}));
        } else {
          toast.error(result.data?.message || "Unable to place order");
        }
      } else {
        const result = await placeStripeOrder({
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (result.data?.success) {
          setOrderPlaced(true);
          window.location.replace(result.data.url);
        } else {
          toast.error(result.data?.message || "Unable to place order");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const emptycart = () => {
    if (cartArray.length === 0) {
      toast.error("Your cart is already empty");
      return;
    }
    dispatch(setCartItems({}));
    setCartArray([]);
    toast.success("Cart Cleared Successfully");
    navigate("/products");
  };

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (!user) {
      toast.error("You are unauthenticated. Please login to view your cart");
      navigate("/");
    }
  }, [user]);

  if (orderPlaced) {
    return <SuccessPage selectedAddress={selectedAddress} navigate={navigate} />;
  }

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row mt-16">
      <div className="flex-1 max-w-4xl">
        <div className="flex items-center gap-20 mb-3">
          <h1 className="text-3xl font-medium">
            Shopping Cart{" "}
            <span className="text-sm text-primary">{cartCount} Items</span>
          </h1>

          <button
            className="text-sm text-primary cursor-pointer"
            onClick={emptycart}
          >
            🗑️ Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/products/${product.category.toLowerCase()}/${product._id}`
                  );
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      onChange={(e) =>
                        dispatch(updateCartItem({ itemId: product._id, quantity: Number(e.target.value) }))
                      }
                      value={cartItems[product._id]}
                      className="outline-none"
                    >
                      {Array(
                        cartItems[product._id] > 9 ? cartItems[product._id] : 9
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => dispatch(removeFromCart(product._id))}
              className="cursor-pointer mx-auto"
            >
              <img
                src={assets.remove_icon}
                alt="remove"
                className="inline-block w-6 h-6"
              />
            </button>
          </div>
        ))}

        <button
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
        >
          <img
            className="group-hover:-translate-x-1 transition"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No address found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {addresses.map((address) => (
                  <p
                    key={address._id}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country}
                  </p>
                ))}
                <p
                  onClick={() => {
                    navigate("/add-address");
                  }}
                  className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>
              {currency}
              {cartAmount}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">
              {currency}
              {shippingFee}
            </span>{" "}
          </p>
          <p className="flex justify-between">
            <span>Tax </span>
            <span>
              {currency}
              {tax}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              {currency}
              {totalAmount}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  ) : null;
};

export default Cart;