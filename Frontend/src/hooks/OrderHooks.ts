import { useMutation, useQuery } from "@tanstack/react-query"
import { cartItem, shippingAddress } from "../types/Cart"
import apiClient from "../apiClient"
import { Order } from "../types/Order"

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () =>
      (await apiClient.get<Order> (`api/orders/${id}`)).data,
  })

  export const  useGetOrdersQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Order[]>('api/orders/admin')).data,
  })

  export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ['paypal-clientId'],
    queryFn: async () =>
      (await apiClient.get < { clientId: string } > (`/api/keys/paypal`)).data,
  })

  export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () =>
      (await apiClient.get < [Order] > (`/api/orders/mine`)).data,
  })

export const usePayOrderMutation = () =>
   useMutation({
     mutationFn: async (details: { orderId: string }) =>
       (
         await apiClient.put<{ message: string; order: Order }>(
           `api/orders/${details.orderId}/pay`,
           details
         )
       ).data,
   })

export const useOrderStatusMutation = () =>
   useMutation({
     mutationFn: async ( Id: string ) =>
       (
         await apiClient.put<{ message: string; order: Order }>(
           `api/orders/${Id}/status`,
         )
       ).data,
   })
export const useOrderDeliveredMutation = () =>
   useMutation({
     mutationFn: async ( Id: string ) =>
       (
         await apiClient.put<{ message: string; order: Order }>(
           `api/orders/${Id}/completed`,
         )
       ).data,
   })

export const useCreateOrderMutation = () =>
useMutation({
  mutationFn: async (order: {
    orderItems: cartItem[]
    shippingAddress: shippingAddress
    paymentMethod: string
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
    phone: string
  }) =>
    (
      await apiClient.post<{ message: string; order: Order }>(
        `api/orders`,
        order
      )
    ).data,
})


