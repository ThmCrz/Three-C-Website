/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { Cart, cartItem, shippingAddress } from "./types/Cart";
import { UserDetails, UserInfo } from "./types/User";

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
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress")!)
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod")!
      : "Gcash",
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  },
};
type Action =
  | { type: "SWITCH_MODE" }
  | { type: "ADD_ITEM_TO_CART"; payload: cartItem }
  | { type: "CART_REMOVE_ITEM"; payload: cartItem }
  | { type: "CART_CLEAR";}
  | { type: "USER_SIGNIN"; payload: UserInfo }
  | { type: "SAVE_USER_DETAILS"; payload: UserDetails }
  | { type: "USER_SIGNOUT" }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: shippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string }
  | { type: "SAVE_USER_DETAILS_EMAIL_CONFIRM"; payload: {isEmailConfirmed: boolean;} }  
  ;

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SWITCH_MODE":
      return { ...state, mode: state.mode === "dark" ? "light" : "dark" };

    case "ADD_ITEM_TO_CART": {
      const newItem = action.payload;
      const existingItem = state.cart.cartItems.find(
        (item: cartItem) => item._id === newItem._id
      );
      const cartItems = existingItem
        ? state.cart.cartItems.map((item: cartItem) =>
            item._id === existingItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item: cartItem) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload, cart: { ...state.cart, cartItems: [] } };

      case "SAVE_USER_DETAILS": {

        const updatedUserInfo = {
          ...state.userInfo,
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
        };
        return { ...state, userInfo: updatedUserInfo };
      }

      case "SAVE_USER_DETAILS_EMAIL_CONFIRM": {
  const updatedUserInfo = {
    ...state.userInfo,
    isEmailConfirmed: true,
  };
  return { ...state, userInfo: updatedUserInfo };
}
      

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
          shippingAddress: {
            fullName: "",
            address: "",
            city: "",
            country: "",
            postalCode: "",
          },
          paymentMethod: "",
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
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
