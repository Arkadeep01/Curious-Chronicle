import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const accessToken = Cookies.get("access_token");
        const storedToken = localStorage.getItem("auth-storage");
        
        if (accessToken || (storedToken && JSON.parse(storedToken)?.state?.accessToken)) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    if (isAuth === null) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            </div>
        );
    }

    // Only redirect to dashboard if trying to access auth pages (login, register, etc.)
    // Don't redirect for public pages like author profile
    return children;
};

export default PublicRoute;