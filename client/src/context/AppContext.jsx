import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);


  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(!!data.success);
    } catch {
      setIsSeller(false);
    }
  };

 
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      }
    } catch {
      setUser(null);
    }
  };

 
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

 
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    setIsCartOpen(true); 
    toast.success("Added to cart");
  };

  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    setCartItems(cartData);
    toast.success("Removed from cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

 
  const getCartCount = () => {
    let count = 0;
    for (const item in cartItems) {
      count += cartItems[item];
    }
    return count;
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        total += product.offerPrice * cartItems[itemId];
      }
    }
    return Math.round(total * 100) / 100;
  };


  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

 
  useEffect(() => {
    const syncCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      syncCart();
    }
  }, [cartItems]);

  
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    fetchProducts,
    searchQuery,
    setSearchQuery,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    getCartCount,
    getCartAmount,
    isCartOpen,
    setIsCartOpen,
    currency,
    axios,
    setCartItems,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
