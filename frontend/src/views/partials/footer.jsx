import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaGithub,
  FaInstagram,
  FaRss,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";

const columns = [
  {
    title: "Read",
    links: ["Featured", "Latest", "Editor's picks", "Long reads"],
  },
  {
    title: "Topics",
    links: ["Design", "Engineering", "Culture", "Productivity"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const socials = [
    { icon: FaTwitter, label: "Twitter" },
    { icon: FaInstagram, label: "Instagram" },
    { icon: FaGithub, label: "GitHub" },
    { icon: FaRss, label: "RSS" },
  ];

  return (
    <footer className="border-t bg-light">
      <div className="container py-5">

        {/* Newsletter */}
        <div className="row mb-5 pb-4 border-bottom">
          <div className="col-md-6">
            <h2 className="fw-bold">
              Quiet writing,<br />delivered weekly.
            </h2>
            <p className="text-muted">
              One thoughtful essay every Sunday. No spam, no noise.
            </p>
          </div>

          <div className="col-md-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
            >
              <label className="small text-uppercase text-muted">
                Subscribe
              </label>

              <div className="d-flex align-items-center border rounded p-2 mt-2">
                <FaEnvelope className="me-2 text-muted" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="form-control border-0"
                />

                <button className="btn btn-primary ms-2">
                  Join <FaArrowRight />
                </button>
              </div>

              {submitted && (
                <p className="text-success small mt-2">
                  Thanks — check your inbox.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Columns */}
        <div className="row mb-5">
          <div className="col-md-3">
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <div className="bg-primary text-white rounded-circle px-3 py-2 fw-bold me-2">
                C
              </div>
              <h5 className="mb-0">Curious Chronicle</h5>
            </Link>

            <p className="mt-3 text-muted small">
              A magazine for writers and thinkers.
            </p>

            <p className="small text-muted">
              hello@curiouschronicle.com<br />
              Agartala, Tripura
            </p>
          </div>

          {columns.map((col) => (
            <div className="col-md-3" key={col.title}>
              <h6 className="text-uppercase small fw-bold">
                {col.title}
              </h6>

              <ul className="list-unstyled mt-3">
                {col.links.map((l) => (
                  <li key={l} className="mb-2">
                    <Link to="/" className="text-muted text-decoration-none">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-3">

          <p className="small text-muted mb-2 mb-md-0">
            © {new Date().getFullYear()} Curious Chronicle
          </p>

          <div className="d-flex gap-2">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a key={social.label} href="#" className="btn btn-light btn-sm">
                  <Icon />
                </a>
              );
            })}
          </div>

          <div className="small text-muted mt-2 mt-md-0">
            <Link to="/" className="me-3 text-decoration-none text-muted">
              Privacy
            </Link>
            <Link to="/" className="me-3 text-decoration-none text-muted">
              Terms
            </Link>
            <Link to="/" className="text-decoration-none text-muted">
              Cookies
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;