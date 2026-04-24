import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

function useUserData() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
          setUser(null);
          return;
        }

        const decoded = jwtDecode(accessToken);

        // Ensure exp exists before checking
        if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          setUser(null);
          return;
        }

        setUser(decoded);
      } catch (error) {
        console.error("Invalid Token:", error);
        setUser(null);
      }
    };

    checkUser();

    // Optional: keep in sync across tabs / updates
    const interval = setInterval(checkUser, 5000);
    return () => clearInterval(interval);
  }, []);

  return user;
}

export default useUserData;