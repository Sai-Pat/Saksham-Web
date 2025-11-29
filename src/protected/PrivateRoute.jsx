import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute({ requiredRole }) {
    const { session, role, loading } = useAuth()
    console.log("PrivateRoute: rendering with - session:", session, "role:", role, "loading:", loading);

    if (loading) {
        console.log("PrivateRoute: still loading...");
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    if (!session) {
        console.log("PrivateRoute: no session, redirecting to /");
        return <Navigate to="/" />;
    }

    if (requiredRole && role !== requiredRole) {
        console.log(`PrivateRoute: Unauthorized access. Required role: ${requiredRole}, actual role: ${role}`);
        // You could redirect to an unauthorized page or display a message
        return <Navigate to="/unauthorized" replace />;
    }

    console.log("PrivateRoute: Authorized. Rendering Outlet.");
    return <Outlet />
}
