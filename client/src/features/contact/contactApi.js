import { apiSlice } from '../../../src/api/apiSlice';

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactSubmissions: builder.query({
      query: () => ({ 
      url: '/api/contact-us/',
      method: 'GET'
     }),
      providesTags: ['Contact'],
    }),

    submitContactForm: builder.mutation({
      query: (formData) => ({
        url: '/api/contact-us/submit',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: ['Contact'],
    }),

    deleteContactSubmission: builder.mutation({
      query: (id) => ({
        url: `/api/contact-us/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useSubmitContactFormMutation,
  useGetContactSubmissionsQuery,
  useDeleteContactSubmissionMutation,
} = contactApi;