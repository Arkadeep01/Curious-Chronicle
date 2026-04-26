import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

function Header() {
  return (
    <header className="border-bottom bg-white">
      <nav className="container d-flex align-items-center justify-content-between py-3">

        {/* LEFT SIDE */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">

            <img
              src="/logo.png"
              alt="Curious Chronicle Logo"
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50%"
              }}
            />

            <span className="fw-bold text-dark fs-5 logo">
              Curious <span style={{ color: "#4f46e5" }}>Chronicle</span>
            </span>
          </Link>

          {/* Stories pill */}
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

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-4">

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
            Get started
          </Link>

          {/* Profile Icon Only */}
          <Link to="/profile" className="text-dark">
            <FaUser size={18} />
          </Link>

        </div>
      </nav>
    </header>
  );
}

export default Header;