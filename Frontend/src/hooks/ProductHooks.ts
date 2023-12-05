import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Product } from "../types/Products"
import { Order } from "../types/Order";
import { cartItem } from "../types/Cart";

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

  export const useGetMultipleProductDetailsByIdQuery = (currentCartItemIds: string[]) =>
    useQuery({
      queryKey: ["products", currentCartItemIds],
      queryFn: async () => {
        const updatedProducts: Product[] = [];

        const apiCalls = currentCartItemIds.map((_id) =>
          apiClient.get<Product>(`api/products/${_id}`)
        );
        const responses = await Promise.all(apiCalls);

        for (const response of responses) {
          const productData = response.data;
          const updatedProduct = {
            ...productData,
            image: `http://localhost:5173/${productData.image}`,
          };

          updatedProducts.push(updatedProduct);
        }

        return updatedProducts;
      },
    });

    export const useProductEditMutation = () =>
    useMutation({
      mutationFn: async ({
        _id,
        name,
        slug,
        // image,
        category,
        brand,
        price,
        countInStock,
        description,

      }: {
        _id: string;
        name: string;
        slug: string;
        // image: string;
        category: string;
        brand: string;
        price: number;
        countInStock: number;
        description: string;
      }) =>
        (
          await apiClient.put<Product>(`api/products/${_id}/update`, {
            name,
            slug,
            // image,
            category,
            brand,
            price,
            countInStock,
            description,
          })
        ).data,
    });

    export const useCreateProductMutation = () =>
      useMutation({
        mutationFn: async ({
          name,
          image,
          category,
          brand,
          price,
          countInStock,
          description,
        }: {
          name: string;
          image: string;
          category: string;
          brand: string;
          price: number;
          countInStock: number;
          description: string;
        }) =>
          (
            await apiClient.post<Product>("api/products/newProduct", {
              name,
              image,
              category,
              brand,
              price,
              countInStock,
              description,
            })
          ).data,
      });

    export const useDeleteProductMutation = () =>
      useMutation({
        mutationFn: async ({
          id
        }: {
          id: string;
        }) =>
          (
            await apiClient.put<Product>(`api/products/deleteProduct/${id}`, {
              id
            })
          ).data,
      });

      export const useDeductQuantityFromOrderMutation = () =>
  useMutation({
    mutationFn: async ({ 
      orderItems
     }: { 
      orderItems: cartItem[] 
    }) => {
      return (
        await apiClient.put<{ message: string; order: Order }>(
          `api/products/DeductQuantityFromOrder`,
          { orderItems }
        )
      ).data;
    },
  });
      export const useReAddQuantityFromOrderMutation = () =>
  useMutation({
    mutationFn: async ({ 
      orderItems
     }: { 
      orderItems: cartItem[] 
    }) => {
      return (
        await apiClient.put<{ message: string; order: Order }>(
          `api/products/AddQuantityFromCancelledOrder`,
          { orderItems }
        )
      ).data;
    },
  });
      