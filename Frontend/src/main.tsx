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
import "./index.css";
import Homepage from "./pages/Homepage.tsx";
import Productpage from "./pages/Productpage.tsx";
import Loginpage from "./pages/Loginpage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StoreProvider } from "./Store.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<Homepage />} />
      <Route path="Login" element={<Loginpage />} />
      <Route path="SignUp" element={<SignUpPage />} />
      <Route path="Product/:slug" element={<Productpage />} />
      {/* <Route path='home' element={<Homepage />} /> */}
      {/* <Route path="dashboard" element={<Dashboard />} /> */}
      {/* ... etc. */}
    </Route>
  )
);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StoreProvider>
    </HelmetProvider>
  </React.StrictMode>
);
