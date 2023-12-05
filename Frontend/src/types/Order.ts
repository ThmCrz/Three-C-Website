import { cartItem, shippingAddress } from "./Cart";

export type Order = {
    _id: string
    orderItems: cartItem[]
    shippingAddress: shippingAddress
    paymentMethod: string
    user: string
    createdAt: string
    isPaid: boolean
    paidAt: string
    isDelivered: boolean
    deliveredAt: string
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
    status: number
}