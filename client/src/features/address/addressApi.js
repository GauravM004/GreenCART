import { apiSlice } from '../../../src/api/apiSlice';

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => ({ 
      url: '/api/addresses', 
      method: 'GET' 
    }),
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation({
      query: ({ address }) => ({
        url: '/api/addresses',
        method: 'POST',
        data: { address },
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const { useGetAddressesQuery, useAddAddressMutation } = addressApi;
