import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

// Define the 'PrivateRoute' component as a functional component that takes 'children' as a prop.
const PrivateRoute = ({ children }) => {

    // ACCESS AUTH STATE FROM STORE
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn());         // Get authentication status (boolean)
    const loading = useAuthStore((state) => state.loading);                 // Get loading state (important for preventing UI flicker)

    // If authentication state is still being determined (e.g., persisted state loading),
    // prevent rendering or redirecting prematurely.
    if (loading) {
        return <div>Loading...</div>;
    }

    // If user is authenticated → render protected content
    // If not → redirect to login page
    return isLoggedIn ? (
        <>{children}</>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoute;