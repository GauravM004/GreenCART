import prisma from "../configs/db.js";

export const addAddress = (userId, address) => {
  return prisma.address.create({
    data: {
      ...address,
      zipcode: Number(address.zipcode),
      userId,
    },
  });
};

export const getAddressesForUser = (userId) => {
  return prisma.address.findMany({ where: { userId } });
};
