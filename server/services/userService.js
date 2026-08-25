import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../configs/db.js";

// Fields safe to send back to the client (never the password hash)
const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  provider: true,
  phone: true,
  firstName: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,
};

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = (id) => {
  return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
};

export const findUserByGoogleId = (googleId) => {
  return prisma.user.findUnique({ where: { googleId } });
};

export const createUserWithGoogle = ({ googleId, name, email }) => {
  return prisma.user.create({
    data: { googleId, name, email, provider: "google" },
  });
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = signUserToken(user.id);
  return { user, token };
};

export const updateUserProfile = async (userId, { firstName, lastName, phone }) => {
  return prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName, phone },
    select: publicUserSelect,
  });
};

export const signUserToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
