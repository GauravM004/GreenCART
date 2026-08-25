import { apiSlice } from '../../../src/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => ({
        url: '/api/user/is-auth',
        method: 'GET'
      }),
      providesTags: ['User'],
    }),

    loginUser: builder.mutation({
      query: ({ state, name, email, password }) => ({
        url: `/api/user/${state}`,
        method: 'POST',
        data: { name, email, password },
      }),
      invalidatesTags: ['User'],
    }),

    registerUser: builder.mutation({
      query: ({ name, email, password }) => ({
        url: '/api/user/register',
        method: 'POST',
        data: { name, email, password },
      }),
      invalidatesTags: ['User'],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: '/api/user/logout',
        method: 'GET'
      }),
      invalidatesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: '/api/user/update-profile',
        method: 'PUT',
        data: formData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useUpdateProfileMutation,
  useLogoutSellerMutation
} = authApi;