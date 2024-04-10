import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { UserInfo } from "../types/User";
import { cartItem, shippingAddress } from "../types/Cart";

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
        })
      ).data,
  });

export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      phone,
    }: {
      name: string;
      email: string;
      password: string;
      phone: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
          phone,
        })
      ).data,
  });
export const useAccountDetailsMutation = () =>
  useMutation({
    mutationFn: async ({
      _id,
      name,
      email,
      phone,
    }: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/${_id}/editAccount`, {
          _id,
          name,
          email,
          phone,
        })
      ).data,
  });

export const useShippingMutation = () =>
  useMutation({
    mutationFn: async ({
      user,
      shippingAddress,
    }: {
      user: string;
      shippingAddress: shippingAddress;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/${user}/shippingAddress`, {
          shippingAddress,
        })
      ).data,
  });

export const useCartMutation = () =>
  useMutation({
    mutationFn: async ({
      user,
      cartItem,
      quantity,
    }: {
      user: string;
      cartItem: cartItem;
      quantity: number | undefined;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/${user}/Cart`, {
          cartItem,
          quantity,
        })
      ).data,
  });

  export const useEmailConfirmMutation = () =>
  useMutation({
    mutationFn: async ({
      _id,
    }: {
      _id: string;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/${_id}/confirmEmail`, {
        })
      ).data,
  });

  export const useCartDeleteItemMutation = () =>
  useMutation({
    mutationFn: async ({
      user,
      cartItem,
      
    }: {
      user: string;
      cartItem: cartItem;
      
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/${user}/Cart/DeleteItem`, {
          cartItem,
        })
      ).data,
  });

  export const useCartClearMutation = () =>
  useMutation({
    mutationFn: async ({
      user,
    }: {
      user: string;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/${user}/Cart/ClearCart`, {
        })
      ).data,
  });

  export const usePasswordMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/passwordReset`, {
          email,
          password,
        })
      ).data,
  });
  export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      currentPassword,
      newPassword,
    }: {
      email: string;
      currentPassword: string;
      newPassword: string;
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/changePassword`, {
          email,
          currentPassword,
          newPassword,
        })
      ).data,
  });

  export const useCheckEmailMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
    }: {
      email: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/CheckEmail`, {
          email,
        })
      ).data,
  });

  export const useGetEmployeeAccountsQuery = () =>
    useQuery({
      queryKey: ['employeeAccounts'],
      queryFn: async () => {
        const response = await apiClient.get<UserInfo[]>('api/users/EmployeeAccounts');
        return response.data;
      },
      onError: (error) => {
        // Handle error here, for example, logging or showing a notification
        console.error("Error fetching employee accounts:", error);
      }
    });

    export const useNewEmployeeMutation = () =>
      useMutation({
        mutationFn: async ({
          name,
          email,
          password,
          phone,
          role,
        }: {
          name: string;
          email: string;
          password: string;
          phone: string;
          role: string;
        }) =>
          (
            await apiClient.post<UserInfo>(`api/users/NewEmployee`, {
              name,
              email,
              password,
              phone,
              role,
            })
          ).data,
      });

      export const useEmployeeAccountDetailsMutation = () =>
        useMutation({
          mutationFn: async ({
            _id,
            name,
            email,
            phone,
            role,
          }: {
            _id: string;
            name: string;
            email: string;
            phone: string;
            role: string;
          }) =>
            (
              await apiClient.put<UserInfo>(`api/users/${_id}/editEmployeeAccount`, {
                _id,
                name,
                email,
                phone,
                role,
              })
            ).data,
        });