import * as cartService from "../services/cartService.js";

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    // userId comes from the authenticated session (authUser middleware),
    // never from the request body - trusting a client-supplied userId
    // would let one logged-in user overwrite another user's cart.
    const userId = req.userId;
    const { cartItems } = req.body;

    const items = await cartService.syncCart(userId, cartItems);
    res.json({ success: true, message: "Cart Updated", cartItems: items });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
