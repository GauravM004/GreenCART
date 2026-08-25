import jwt from "jsonwebtoken";

// Seller has no DB table (single admin account driven by env vars),
// but lives in the service layer for consistency with the rest of the app.
export const verifySellerCredentials = (email, password) => {
  return (
    email === process.env.SELLER_EMAIL &&
    password === process.env.SELLER_PASSWORD
  );
};

export const signSellerToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
