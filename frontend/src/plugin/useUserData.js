import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { setUser as restoreUserSession } from "../utils/auth";
import { useAuthStore } from "../store/auth";

function useUserData() {
  const [user, setUser] = useState(null);
  const storeUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
          await restoreUserSession();
          setUser(useAuthStore.getState().user);
          return;
        }

        const decoded = jwtDecode(accessToken);

        // Ensure exp exists before checking
        if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
          await restoreUserSession();
          setUser(useAuthStore.getState().user);
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

  return storeUser || user;
}

export default useUserData;
