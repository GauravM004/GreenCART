import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import OAuthSuccess from "./pages/OAuthSuccess";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { setUser, setIsSeller, selectIsSeller } from "./features/auth/authSlice";
import { setCartItems, selectCartItems } from "./features/cart/cartSlice";
import { selectShowUserLogin } from "./features/ui/uiSlice";
import { useGetCurrentUserQuery } from "./features/auth/authApi";
import { useGetSellerAuthQuery } from "./features/seller/sellerApi";
import { useGetProductsQuery } from "./features/products/productApi";
import { useUpdateCartMutation } from "./features/cart/cartApi";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import ProductCategory from "./pages/ProductCategory";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import Loading from "./components/Loading";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/seller/Dashboard";
import MyProfile from "./components/MyProfile";
import ContactUsSeller from "./pages/seller/ContactUs";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const dispatch = useAppDispatch();
  const showUserLogin = useAppSelector(selectShowUserLogin);
  const isSeller = useAppSelector(selectIsSeller);
  const cartItems = useAppSelector(selectCartItems);
  const user = useAppSelector((state) => state.auth.user);

  const { data: userData, isLoading: isUserLoading, refetch: refetchUser } =
    useGetCurrentUserQuery(undefined, { skip: false });
  const { data: sellerData } = useGetSellerAuthQuery(undefined, { skip: false });
  // Prefetches and warms the RTK Query cache for products so pages like
  // AllProducts/Cart/ProductDetails get an instant cache hit instead of
  // each triggering their own network request on first render.
  useGetProductsQuery(undefined, { skip: false });
  const [updateCart] = useUpdateCartMutation();

  useEffect(() => {
    if (userData?.success && userData.user) {
      dispatch(setUser(userData.user));
      dispatch(setCartItems(userData.user.cartItems || {}));
    } else if (!isUserLoading && userData && !userData.success) {
      dispatch(setUser(null));
    }
  }, [userData, isUserLoading, dispatch]);

  useEffect(() => {
    dispatch(setIsSeller(!!sellerData?.success));
  }, [sellerData, dispatch]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token" && event.newValue) {
        refetchUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refetchUser]);

  useEffect(() => {
    if (user && user.cartItems) {
      dispatch(setCartItems(user.cartItems));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user && Object.keys(cartItems).length >= 0) {
      updateCart(cartItems);
    }
  }, [cartItems, user, updateCart]);

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isSellerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div
        className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/loader" element={<Loading />} />
          <Route path="Contact-us" element={<ContactUs />} />
          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={isSeller ? <AddProduct /> : null} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="contact-us" element={<ContactUsSeller />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;