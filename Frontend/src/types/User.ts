import { cartItem, shippingAddress } from "./Cart"



export type CurrentCart = {
    currentCartItems: cartItem[]
}

export type UserDetails = {
    _id: string
    name: string
    email: string
    phone: string
}

export type UserInfo = {
    _id: string
    name: string
    email: string
    phone: string
    token: string
    isAdmin: boolean
    shippingAddress: shippingAddress
    currentCart: CurrentCart
}