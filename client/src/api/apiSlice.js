import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Endpoints authenticated purely via httpOnly cookie (seller session).
// The OAuth Bearer token (localStorage, user-side only) must never be
// attached to these — matched by RTK Query's injected endpoint name,
// not by parsing the URL.
const SELLER_ONLY_ENDPOINTS = [
  'getSellerAuth',
  'logoutSeller',
  'getDashboardData',
  'getSellerOrders',
  'updateSellerOrderStatus',
];

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include', // send cookies for both user + seller sessions
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem('token');
      if (token && !SELLER_ONLY_ENDPOINTS.includes(endpoint)) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Seller', 'Products', 'Address', 'Cart', 'Orders', 'Contact'],
  endpoints: () => ({}),
});