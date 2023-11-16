import { useMutation } from "@tanstack/react-query"
import apiClient from "../apiClient"
import { UserInfo } from "../types/User"
import { shippingAddress } from "../types/Cart"


export const useSigninMutation = () =>
useMutation({
  mutationFn: async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) =>
    (
      await apiClient.post<UserInfo>(`api/users/signin`, {
        email,
        password,
      })
    ).data,
})

export const useSignupMutation = () =>
useMutation({
 mutationFn: async ({
   name,
   email,
   password,
 }: {
   name: string
   email: string
   password: string
 }) =>
   (
     await apiClient.post<UserInfo>(`api/users/signup`, {
       name,
       email,
       password,
     })
   ).data,
})

export const useShippingMutation = () =>
    useMutation({
      mutationFn: async ({user, shippingAddress,}:{ user: string, shippingAddress: shippingAddress,}) =>(
        await apiClient.put<UserInfo>(`api/users/${user}/shippingAddress`, { shippingAddress })
      ).data
      })