import { apiSlice } from '../../api/apiSlice';

export const sellerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerAuth: builder.query({
      query: () => ({
        url: '/api/seller/is-auth',
        method: 'GET'
      }),
      providesTags: ['Seller'],
    }),

    logoutSeller: builder.mutation({
      query: () => ({
        url: '/api/seller/logout',
        method: 'GET'
      }),
      invalidatesTags: ['Seller'],
    }),

    getDashboardData: builder.query({
      query: () => ({
        url: '/api/admin/dashboard',
        method: 'GET'
      }),
      providesTags: ['Orders', 'Products'],
    }),
  }),
});

export const {
  useGetSellerAuthQuery,
  useLogoutSellerMutation,
  useGetDashboardDataQuery,
} = sellerApi;