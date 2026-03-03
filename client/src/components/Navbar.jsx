import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";


const LoginModal = ({ showModal, setShowModal, axios, navigate }) => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/user/auth/google";
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row transform transition-all">
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Welcome Back</h3>
            <p className="text-md text-white/90 leading-relaxed">
              Securely sign in to access your dashboard and manage everything with ease.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">One-click authentication</span>
            </div>
            <div className="flex items-center gap-3 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Bank-level security</span>
            </div>
            <div className="flex items-center gap-3 group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">No passwords to remember</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-600 transition hover:bg-gray-100 rounded-lg p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Sign In</h2>
            <p className="text-gray-600 text-lg">
              Use your Google account to get started instantly
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-8 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/10 transition-all"></div>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#FFFFFF"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FFFFFF"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#FFFFFF"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </div>
          </button>

          <div className="flex items-center justify-center gap-4 mb-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Secure
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Private
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Instant
            </div>
          </div>

          <p className="text-center text-xs text-gray-600">
            By signing in, you agree to our{" "}
            <button className="text-green-600 hover:text-green-700 font-semibold hover:underline transition">
              Terms
            </button>
            {" "}and{" "}
            <button className="text-green-600 hover:text-green-700 font-semibold hover:underline transition">
              Privacy Policy
            </button>
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    user,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
    setCartItems,
    setUser,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      // toast.success(`${user.name || "User"} logged in successfully`);
    }
  }, [user]);

  return (
    <>
      <LoginModal showModal={showModal} setShowModal={setShowModal} axios={axios} navigate={navigate} />

      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img className="h-9" src={assets.logo} alt="logo" />
        </NavLink>

        <div className="hidden sm:flex items-center gap-8">
          {/* <NavLink to="/practice" className="hover:text-green-600 transition font-medium">
            Practice
          </NavLink> */}
          <NavLink to="/" className="hover:text-green-600 transition font-medium">
            Home
          </NavLink>
          <NavLink to="/products" className="hover:text-green-600 transition font-medium">
            All Product
          </NavLink>
          <NavLink to="/Contact-us" className="hover:text-green-600 transition font-medium">
            Contact
          </NavLink>

          <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full hover:border-green-400 transition">
            <input
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          <div
            onClick={() => {
              if (getCartCount() === 0) {
                toast.error(
                  "Cart is Empty please add items to move to Cart Section"
                );
              } else {
                navigate("/cart");
              }
            }}
            className="relative cursor-pointer hover:opacity-70 transition"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-green-600 w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {!user ? (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="relative group">
              <img src={assets.profile_icon} className="w-10 cursor-pointer" alt="" />
              <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-lg text-sm z-40">
                <li
                  onClick={() => navigate("my-profile")}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer transition font-medium"
                >
                  My Profile
                </li>
                <li
                  onClick={() => navigate("my-orders")}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer transition font-medium"
                >
                  My Orders
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2 hover:bg-red-50 cursor-pointer transition font-medium text-red-600"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 sm:hidden">
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-6 opacity-80"
            />
            <button className="absolute -top-2 -right-3 text-xs text-white bg-green-600 w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="hover:bg-gray-100 p-2 rounded-lg transition"
          >
            <img src={assets.menu_icon} alt="menu" />
          </button>
        </div>

        {open && (
          <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-3 px-5 text-sm md:hidden z-10 border-b border-gray-200">
            <NavLink to="/" onClick={() => setOpen(false)} className="w-full py-2 hover:text-green-600 transition font-medium">
              Home
            </NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)} className="w-full py-2 hover:text-green-600 transition font-medium">
              All Product
            </NavLink>
            <NavLink to="/Contact-us" onClick={() => setOpen(false)} className="w-full py-2 hover:text-green-600 transition font-medium">
              Contact
            </NavLink>

            {!user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  setShowModal(true);
                }}
                className="w-full px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold mt-4"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="w-full px-6 py-2 bg-red-600 text-white rounded-lg font-semibold mt-4"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;