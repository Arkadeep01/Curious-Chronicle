import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import axios from "axios";

function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/feedback/", {
        email,
        message,
      });

      alert("Feedback submitted!");
      setEmail("");
      setMessage("");

    } catch (err) {
      console.log(err);
      alert("Error submitting feedback");
    }
  };

  return (
    <footer style={{ background: "#1f1f1f", color: "#ddd" }}>

      <header className="custom-header">

      {/* Top white strip */}
      <div className="header-top"></div>

        {/* Dark navbar */}
        <div className="header-main">

          {/* Triangle notch */}
          <div className="header-notch">
            <img src="/logo.png" alt="logo" />
          </div>

        </div>

      </header>
      <div className="container py-5">

        {/* TOP GRID */}
        <div className="row mb-5">

          {/* COLUMN 1 */}
          <div className="col-md-3">
            <h6 className="text-uppercase text-light mb-3">Explore</h6>

            <p className="mb-1 fw-bold">Trending</p>
            <Link to="/stories" className="text-decoration-none">
              <p className="text-muted small mb-1">Top Stories</p>
            </Link>
            <p className="text-muted small">Most Read</p>

            <p className="mt-5 mb-1 fw-bold">Categories</p>
            <p className="text-muted mb-1 small">Tech</p>
            <p className="text-muted mb-1 small">Design</p>
            <p className="text-muted small">Culture</p>
          </div>

          {/* COLUMN 2 */}
          <div className="col-md-3">
            <h6 className="text-uppercase text-light mb-3">Experiences</h6>

            <Link to="/add-post" className="text-decoration-none">
              <p className="text-muted small">Writing</p> 
            </Link>
            <p className="text-muted small">Storytelling</p>
            <p className="text-muted small">Deep Reads</p>
          </div>

          {/* COLUMN 3 */}
          <div className="col-md-3">
            <h6 className="text-uppercase text-light mb-3">About Us</h6>

            <Link to="/About#team-section" className="text-decoration-none">
              <p className="text-muted small">Our Team</p>
            </Link>
            <Link to="/About" className="text-decoration-none">
              <p className="text-muted small">About Us</p>
            </Link>
            <Link to="/Press" className="text-decoration-none">
              <p className="text-muted small">Press</p>
            </Link>
            <Link to="/Contact" className="text-decoration-none">
              <p className="text-muted small">Contact</p>
            </Link>
            

            <h6 className="text-uppercase text-light mt-4">Collections</h6>
            <p className="text-muted small">Featured</p>
            <p className="text-muted small">Editor's Pick</p>
          </div>

          {/* COLUMN 4 */}
          <div className="col-md-3">

            <h6 className="text-uppercase text-light mb-3">Follow Us</h6>

            <div className="d-flex gap-3 mb-4">
              <FaFacebookF />
              <FaTwitter />
              <FaYoutube />
              <FaInstagram />
            </div>

            <h6 className="text-uppercase text-light mb-2 mt-4 py-2">
              Feedback
            </h6>

            <form onSubmit={handleFeedbackSubmit} className="mt-3">
              <div className="mb-3">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-3">
                <textarea
                  required
                  placeholder="Share your thoughts..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-control custom-input"
                  rows="3"
                />
              </div>

              <button className="custom-btn w-100">
                Send Feedback →
              </button>
            </form>

          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-top border-secondary pt-4 text-center">

          <p className="small text-muted mb-2">
            WE RECOMMEND
          </p>

          <p className="small">
            Tech • Design • Culture • Productivity • Writing
          </p>

        </div>

        {/* BOTTOM */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary">

          <p className="small text-muted mb-0">
            © {new Date().getFullYear()} Curious Chronicle
          </p>

          <div className="small">
            <Link to="/" className="text-muted me-3 text-decoration-none">
              Privacy Policy
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;