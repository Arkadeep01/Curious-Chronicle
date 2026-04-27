import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Toast from "../../plugin/toast";
import { useAuthStore } from "../../store/auth";
import { UserRoundPen, LogOut } from "lucide-react";
import { useState } from "react";

function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const [open, setOpen] = useState(false);
  const location = useLocation();

  // ✅ Hide on auth + error pages
  const hideAuthUI =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/create-password" ||
    location.pathname === "/not-found";

  return (
    <header className="border-bottom bg-white">
      <nav className="container d-flex align-items-center justify-content-between py-3">

        {/* LEFT */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%"
              }}
            />
            <span className="fw-bold text-dark fs-5">
              Curious <span style={{ color: "#4f46e5" }}>Chronicle</span>
            </span>
          </Link>

          <Link
            to="/stories"
            className="px-3 py-1 text-decoration-none text-dark"
            style={{
              background: "#f1f5f9",
              borderRadius: "20px",
              fontSize: "14px"
            }}
          >
            Stories
          </Link>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center gap-4">

          {/* ✅ If NOT logged in OR on auth pages */}
          {!isLoggedIn || hideAuthUI ? (
            <>
              {!hideAuthUI && (
                <>
                  <Link to="/login" className="text-dark text-decoration-none">
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    className="text-white text-decoration-none px-3 py-2"
                    style={{
                      background: "#4f46e5",
                      borderRadius: "10px",
                      fontSize: "14px"
                    }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          ) : (
            <div className="profile-dropdown">
              <FaUser
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <UserRoundPen size={16} /> Profile
                  </Link>

                  <button
                    onClick={async () => {
                      await logout();
                      Toast("success", "Logged out successfully");
                      window.location.href = "/login";
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </nav>
    </header>
  );
}

export default Header;