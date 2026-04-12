import { createContext, useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

export const useStore = () => useContext(StoreContext);

const StoreContextProvider = ({ children }) => {
  const url = import.meta.env.VITE_API_URL || "https://online-food-delivary-backend2.onrender.com";
  const GUEST_CART_KEY = "guest_cart_items";

  const hasValidToken = (value) => Boolean(value && value !== "undefined" && value !== "null");

  const parseGuestCart = () => {
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  };

  const saveGuestCart = (cart) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart || {}));
  };

  const [token, setToken] = useState("");
  const [food_list, setFoodlist] = useState([]); // always array
  const [cartItems, setCartItems] = useState(parseGuestCart); // always object
  const [loading, setLoading] = useState(true);

  // ================= FETCH FOOD LIST =================
  const fetchFoodlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodlist(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching food list:", error);
      setFoodlist([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD CART DATA =================
  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: authToken } }
      );

      // NEVER allow null or undefined
      setCartItems(response.data?.cartData || {});
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems({});
    }
  };

  const mergeGuestCartToServer = async (authToken, guestCart) => {
    const entries = Object.entries(guestCart || {}).filter(([, qty]) => Number(qty) > 0);

    for (const [itemId, qty] of entries) {
      for (let i = 0; i < Number(qty); i += 1) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token: authToken } }
        );
      }
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodlist();

      const savedToken = localStorage.getItem("token");
      if (hasValidToken(savedToken)) {
        setToken(savedToken);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (hasValidToken(token)) {
      const syncCart = async () => {
        const guestCart = parseGuestCart();

        if (Object.keys(guestCart).length > 0) {
          try {
            await mergeGuestCartToServer(token, guestCart);
            localStorage.removeItem(GUEST_CART_KEY);
          } catch (error) {
            console.error("Error merging guest cart:", error);
          }
        }

        await loadCartData(token);
      };

      syncCart();
      return;
    }
    setCartItems(parseGuestCart());
  }, [token]);

  useEffect(() => {
    if (!hasValidToken(token)) {
      saveGuestCart(cartItems);
    }
  }, [cartItems, token]);

  // ================= ADD TO CART =================
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = async (itemId, completely = false) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (completely || updated[itemId] <= 1) {
        delete updated[itemId];
      } else {
        updated[itemId] -= 1;
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // ================= TOTAL CART AMOUNT =================
  const getTotalCartAmount = () => {
    if (!cartItems || !Array.isArray(food_list)) return 0;

    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const item = food_list.find((item) => item._id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  // ================= TOTAL CART ITEMS =================
  const getTotalCartItems = () => {
    if (!cartItems) return 0;
    return Object.values(cartItems).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  // ================= CONTEXT VALUE =================
  const contextValue = useMemo(
    () => ({
      food_list,
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      getTotalCartAmount,
      getTotalCartItems,
      url,
      token,
      setToken,
    }),
    [food_list, cartItems, loading, token]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
