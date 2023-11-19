import { ApiError } from "./ApiError"
import { cartItem } from "./Cart"
import { Product } from "./Products"

export const getError = (error: ApiError) => {
    return error.response && error.response.data.message
      ? error.response.data.message
      : error.message
  }

  export const convertProductToCartItem = (product: Product) : cartItem => {
    const cartItem : cartItem = {
      _id : product._id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      quantity: 1,
    }
    return cartItem
    }