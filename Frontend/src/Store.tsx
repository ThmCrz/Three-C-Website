import React from "react";
import { Cart, CartItem } from "./types/Cart";

type AppState = {
  mode: string;
  cart: Cart;
};

const initialState: AppState = {
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
  | { type: "ADD_ITEM_TO_CART"; payload: CartItem };

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
