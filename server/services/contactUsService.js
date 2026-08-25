import prisma from "../configs/db.js";

export const submitContactForm = (name, email, message) => {
  return prisma.contactUs.create({ data: { name, email, message } });
};

export const getAllContactForms = () => {
  return prisma.contactUs.findMany({ orderBy: { createdAt: "desc" } });
};

export const deleteContactForm = (id) => {
  return prisma.contactUs.delete({ where: { id } });
};
