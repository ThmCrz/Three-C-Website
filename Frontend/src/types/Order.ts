import { cartItem, shippingAddress } from "./Cart";
import { UserInfo } from "./User"

export type Order = {
    _id: string
    orderItems: cartItem[]
    shippingAddress: shippingAddress
    paymentMethod: string
    user: UserInfo
    createdAt: string
    isPaid: boolean
    paidAt: string
    isDelivered: boolean
    deliveredAt: string
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
}