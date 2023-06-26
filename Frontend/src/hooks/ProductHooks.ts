import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Product } from "../types/Products"
 
export const  useGetProductsQuery = () =>
useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>('api/products')).data, 
})

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      const response = await apiClient.get<Product>(`api/products/${slug}`);
      
      //to get correct path for product image
      const productData = response.data;
      const updatedProduct = {
        ...productData,
        image: `http://localhost:5173/${productData.image}`,
      };

      return updatedProduct;
    },
  });


