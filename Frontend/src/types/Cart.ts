export type CartItem = {
    image: string | undefined
    slug: string
    quantity: number
    countInStock: number
    price: number
    _id: string
    name: string
}

export type ShippingAddress = {
    fullname: string
    address: string
    city: string
    country: string
    postalCode: string

}

export type Cart = {
    cartItems: CartItem[]
    shippingaddress: ShippingAddress
    paymentmethod: string
    itemsPrice: number
    ShippingPrice: number
    taxPrice: number
    totalPrice: number
}


