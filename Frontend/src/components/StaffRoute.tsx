import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Store } from "../Store"

export default function StaffRoute() {
    const {
      state: { userInfo },
    } = useContext(Store)
  
    if (userInfo.isAdmin || userInfo.role === "Delivery" ) {
      return <Outlet />
    } else {
      return <Navigate to="/" />
    }
  }