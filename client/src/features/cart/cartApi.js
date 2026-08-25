import { apiSlice } from '../../../src/api/apiSlice';

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateCart: builder.mutation({
      query: (cartItems) => ({
        url: '/api/cart/update',
        method: 'POST',
        data: { cartItems },
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const { useUpdateCartMutation } = cartApi;
