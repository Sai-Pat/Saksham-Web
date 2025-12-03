import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
    const { user, loading } = useAuth()
    console.log("PrivateRoute: rendering with - user:", user, "loading:", loading);

    if (loading) {
        console.log("PrivateRoute: still loading...");
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (!user) {
        console.log("PrivateRoute: no user, redirecting to /");
        return <Navigate to="/" />;
    }

    console.log("PrivateRoute: Authorized. Rendering Outlet.");
    return <Outlet />
}
