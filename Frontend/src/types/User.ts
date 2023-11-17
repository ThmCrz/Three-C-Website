import { shippingAddress } from "./Cart"

export type CurrentCart = {
    itemId: string
    quantity: number
}

export type UserInfo = {
    _id: string
    name: string
    email: string
    token: string
    isAdmin: boolean
    shippingAddress: shippingAddress
    currentCart: CurrentCart
}