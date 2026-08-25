import { apiSlice } from '../../../src/api/apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerOrders: builder.query({
      query: () => ({
        url: '/api/order/seller',
        method: 'GET'
      }),
      providesTags: ['Orders'],
    }),

    getUserOrders: builder.query({
      query: () => ({
        url: '/api/order/user',
        method: 'GET'
      }),
      providesTags: ['Orders'],
    }),

    placeCodOrder: builder.mutation({
      query: ({ items, address }) => ({
        url: '/api/order/cod',
        method: 'POST',
        data: { items, address },
      }),
      invalidatesTags: ['Orders'],
    }),

    placeStripeOrder: builder.mutation({
      query: ({ items, address }) => ({
        url: '/api/order/stripe',
        method: 'POST',
        data: { items, address },
      }),
      invalidatesTags: ['Orders'],
    }),

    updateSellerOrderStatus: builder.mutation({
      query: ({ orderId, payload }) => ({
        url: `/api/order/${orderId}/status`,
        method: 'PUT',
        data: payload,
      }),
      invalidatesTags: ['Orders'],
    }),

    submitOrderRating: builder.mutation({
      query: ({ orderId, rating, review }) => ({
        url: `/api/order/${orderId}/rating`,
        method: 'POST',
        data: { rating, review },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetSellerOrdersQuery,
  useGetUserOrdersQuery,
  usePlaceCodOrderMutation,
  usePlaceStripeOrderMutation,
  useUpdateSellerOrderStatusMutation,
  useSubmitOrderRatingMutation,
} = orderApi;
