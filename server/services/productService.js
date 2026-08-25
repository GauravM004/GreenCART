import prisma from "../configs/db.js";

export const createProduct = (productData, imagesUrl) => {
  const { name, description, price, offerPrice, category, inStock } = productData;
  return prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      offerPrice: Number(offerPrice),
      category,
      inStock: inStock ?? true,
      image: imagesUrl,
    },
  });
};

export const listProducts = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [totalProducts, products] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getProductById = (id) => {
  return prisma.product.findUnique({ where: { id } });
};

export const setProductStock = (id, inStock) => {
  return prisma.product.update({ where: { id }, data: { inStock } });
};
