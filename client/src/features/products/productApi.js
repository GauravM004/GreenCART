import { apiSlice } from '../../../src/api/apiSlice';

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: '/api/product/list?page=1&limit=1000',
        method: 'GET'
      }),
      providesTags: ['Products'],
    }),

    addProduct: builder.mutation({
      query: (formData) => ({
        url: '/api/product/add',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProductStock: builder.mutation({
      query: ({ id, inStock }) => ({
        url: '/api/product/stock',
        method: 'POST',
        body: { id, inStock },
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation, useUpdateProductStockMutation } = productApi;
