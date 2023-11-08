export type cartItem = {
    image: string | undefined
    slug: string
    quantity: number
    countInStock: number
    price: number
    _id: string
    name: string
}

export type shippingAddress = {
    fullName: string
    address: string
    city: string
    country: string
    postalCode: string
  }

export type Cart = {
    cartItems: cartItem[]
    shippingAddress: shippingAddress
    paymentMethod: string
    itemsPrice: number
    shippingPrice: number
    taxPrice: number
    totalPrice: number
}


