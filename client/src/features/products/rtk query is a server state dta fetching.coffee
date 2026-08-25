rtk query is a server state dta fetching method in frontend applications:
1] we define a api folder and inside that api folder we create a basequery instance the same way we did for axios  bycreating an axios instance, 
attach the token for protected route for API calls.
2] Inside the features folder we have two types of functions for api creation ie query for GET requests and Mutations for POST/PUT/PATCH/DELETE operations.
3] Inside the features folder we make all the HTTP Functions for that particular resource, forexample

export const prouctApi = apiSlice.injectEndpoints({
  i) getProducts: builder.query({
    query: () => ({
      url: '/products',
      method: 'GET',
    }),
    providesTags: ['products'],
  })
 
  ii) createProduct: builder.mutation({
    query: ({productData}) => ({
        url: '/products',
        method: 'POST',
        data: productData,
    }),
    invalidatesTags: ['products'];
  })
})

  export const { useGetProductsQuery, useCreateProductMutation } = productApi;

  4] Using Query functions in component/pages 
  eg: 
  import { useGetProductsQuery } from '../features/product/productApi';
  
  const { data: productsData, isLoading } = useGetProductsQuery();

  
  5] Using Mutation functions in component/pages
  eg: 
   import { useCreateProductMutation } from '../features/product/productApi';

   const [createProduct] = useCreateProductMutation();
   -> make a usestate to hold the product data and call the creteProduct inside a function and pass the state data to it and handle the response accordingly.