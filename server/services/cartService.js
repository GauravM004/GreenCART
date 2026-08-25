import prisma from "../configs/db.js";

// Mongoose used to store cart as a JSON blob on User.cartItems.
// Postgres schema replaces that with a CartItem join table
// (see prisma/schema.prisma), so "updating the cart" now means
// reconciling rows instead of overwriting a field.
//
// `cartItems` is expected in the same shape the old frontend already
// sends: an object keyed by productId -> quantity, e.g. { "<productId>": 2 }.
export const syncCart = async (userId, cartItems = {}) => {
  const entries = Object.entries(cartItems).filter(([, qty]) => qty > 0);

  return prisma.$transaction(async (tx) => {
    // Replace the user's cart wholesale: clear existing rows, then
    // recreate from the payload. Simplest way to guarantee the cart
    // matches exactly what the client sent (including removals).
    await tx.cartItem.deleteMany({ where: { userId } });

    if (entries.length > 0) {
      await tx.cartItem.createMany({
        data: entries.map(([productId, quantity]) => ({
          userId,
          productId,
          quantity,
        })),
      });
    }

    return tx.cartItem.findMany({ where: { userId }, include: { product: true } });
  });
};

export const clearCart = (userId) => {
  return prisma.cartItem.deleteMany({ where: { userId } });
};

export const getCart = (userId) => {
  return prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
};
