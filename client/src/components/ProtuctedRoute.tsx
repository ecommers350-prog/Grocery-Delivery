import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "./Loading";

const ProtuctedRoute = () => {
  const {user, loading} = useAuth();

  if (loading) return <Loading />
  if (!user) return <Navigate to='/login' replace />
  return (
    <Outlet />
  )
}

export default ProtuctedRoute