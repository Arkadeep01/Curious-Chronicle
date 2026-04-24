import { Link } from "react-router-dom";
import { FaHome, FaPlusCircle, FaSearch, FaUser } from "react-icons/fa";

function Header() {
  return (
    <header className="border-bottom bg-white mb-4">
      <nav className="container d-flex align-items-center justify-content-between py-3">

        <Link to="/" className="h4 mb-0 text-dark text-decoration-none">
          Curious Chronicle
        </Link>

        <div className="d-flex gap-4 align-items-center">

          <Link to="/" className="text-dark d-flex align-items-center gap-2 text-decoration-none">
            <FaHome /> Home
          </Link>

          <Link to="/AddPost/" className="text-dark d-flex align-items-center gap-2 text-decoration-none">
            <FaPlusCircle /> Add Post
          </Link>

          <Link to="/search/" className="text-dark d-flex align-items-center gap-2 text-decoration-none">
            <FaSearch /> Search
          </Link>

          <Link to="/Profile/" className="text-dark d-flex align-items-center gap-2 text-decoration-none">
            <FaUser /> Profile
          </Link>

        </div>
      </nav>
    </header>
  );
}

export default Header;