import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';

const MainWrapper = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted ? children : null;
};

export default MainWrapper;