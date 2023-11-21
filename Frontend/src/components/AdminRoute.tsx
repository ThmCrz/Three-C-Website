import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Store } from "../Store"

export default function AdminRoute() {
    const {
      state: { userInfo },
    } = useContext(Store)
  
    if (userInfo.isAdmin) {
      return <Outlet />
    } else {
      return <Navigate to="/" />
    }
  }