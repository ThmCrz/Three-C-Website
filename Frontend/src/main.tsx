import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import Homepage from "./pages/Homepage.tsx";
import Productpage from "./pages/Productpage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StoreProvider } from "./Store.tsx";
import CartPage from "./pages/Cart.tsx";
import SigninPage from "./pages/SignInPage.tsx";
import ShippingAddressPage from "./pages/ShippingAddressPage.tsx";
import PaymentMethodPage from "./pages/PaymentMethodPage.tsx";
import ProtectedRoute from "./components/protectedRoute.tsx";
import PlaceOrderPage from "./pages/PlaceOrderPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import DashboardPage from "./pages/DashboardPage.tsx";
import EditShippingAddressPage from "./pages/EditShippingAddressPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import OrderManagementPage from "./pages/OrderManagementPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<Homepage />} />
      <Route path="/SignIn" element={<SigninPage />} />
      <Route path="/Product/:slug" element={<Productpage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/Cart" element={<CartPage />} />
      <Route path="" element={<ProtectedRoute />}>
         <Route path="/shipping" element={<ShippingAddressPage />} />
         <Route path="/editShipping" element={<EditShippingAddressPage />} />
         <Route path="/payment" element={<PaymentMethodPage />} />
         <Route path="/placeorder" element={<PlaceOrderPage />} />
         <Route path="/order/:id" element={<OrderPage />} />
         <Route path="/dashboard" element={<DashboardPage />} />
         <Route path="" element={<AdminRoute />}>
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/OrderManagementPage/:id" element={<OrderManagementPage />} />
         </Route>
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{ 'clientId': 'ARW-66Agk4xSL4xDNiMcsE5MV2Lgk6fNPZp7QZ17fvYPi9cta0XDY1Z5UTL2--gPu69rd1FWqLqs_xYh' }}
      deferLoading={true}>
    <HelmetProvider>
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StoreProvider>
    </HelmetProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);
