/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { Cart, CartItem, ShippingAddress } from "./types/Cart";
import { UserInfo } from "./types/UserInfo";

type AppState = {
  mode: string;
  cart: Cart;
  userInfo: UserInfo;
};

const initialState: AppState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")!)
    : null,

  mode: localStorage.getItem("mode")
    ? localStorage.getItem("mode")!
    : window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",

  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems")!)
      : [],
    shippingaddress: localStorage.getItem("shippingaddress")
      ? JSON.parse(localStorage.getItem("shippingaddress")!)
      : {},
    paymentmethod: localStorage.getItem("paymentmethod")
      ? localStorage.getItem("paymentmethod")!
      : "Gcash",
    itemsPrice: 0,
    ShippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};
type Action =
  | { type: "SWITCH_MODE" }
  | { type: "ADD_ITEM_TO_CART"; payload: CartItem }
  | { type: "CART_REMOVE_ITEM"; payload: CartItem }
  | { type: "USER_SIGNIN"; payload: UserInfo }
  | { type: "USER_SIGNOUT" }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SWITCH_MODE":
      return { ...state, mode: state.mode === "dark" ? "light" : "dark" };

    case "ADD_ITEM_TO_CART": {
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item: CartItem) => item._id === newItem._id
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map((item: CartItem) =>
            item._id === existingItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item: CartItem) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    case "USER_SIGNOUT":
      return {
        ...state,
        mode:
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
        cart: {
          cartItems: [],
          shippingaddress: {
            fullName: "",
            address: "",
            city: "",
            country: "",
            postalCode: "",
          },
          paymentmethod: "",
          itemsPrice: 0,
          ShippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingaddress: action.payload,
        },
      };

    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentmethod: action.payload },
      };

    default:
      return state;
  }
}

const defaultDispatch: React.Dispatch<Action> = () => initialState;

const Store = React.createContext({
  state: initialState,
  dispatch: defaultDispatch,
});
function StoreProvider(props: React.PropsWithChildren<object>) {
  const [state, dispatch] = React.useReducer<React.Reducer<AppState, Action>>(
    reducer,
    initialState
  );
  return <Store.Provider value={{ state, dispatch }} {...props} />;
}

export { Store, StoreProvider };
