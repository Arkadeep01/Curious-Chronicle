import { useEffect, React} from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../partials/header";
import Footer from "../partials/footer";

function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.substring(1));

      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0,0);
    }
  }, [location]);

  return (
    <>
      <Header />

      {/* HERO */}
      <section
        style={{
          backgroundImage: "url('About/banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <h1 className="fw-bold">About Us</h1>
          <p className="text-muted">Home › About Us</p>
        </div>
      </section>



      {/* WHO WE ARE */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            {/* IMAGE */}
            <div className="col-md-6 mb-4">
              <img src="About/about.png" className="img-fluid rounded" alt="about" style={{width: "100%", height: "700px", objectfit: "cover"}}/>
            </div>

            {/* TEXT */}
            <div className="col-md-6">
              <h6 className="text-uppercase text-bold text-muted">
                Who we are
              </h6>
              <h2 className="fw-bold">
                Curiosity is about passion, not just content
              </h2>

              <p className="text-muted">
                Curious Chronicle was founded with a simple yet powerful idea —
                to create a space where curiosity meets clarity. In an age
                overwhelmed by noise, we strive to deliver meaningful,
                well-researched, and thought-provoking content that informs,
                inspires, and empowers readers worldwide.
              </p>

              <p className="text-muted">
                Curious Chronicle is built for thinkers, creators, and
                explorers. We bring meaningful stories that go beyond
                surface-level content.
              </p>

              <h6 className="fw-bold mt-3">Personalized Content</h6>
              <p className="text-muted">
                Tailored articles that match your interests and learning style.
              </p>

              <h6 className="fw-bold mt-3">Trend Insights</h6>
              <p className="text-muted">
                Stay ahead with curated insights on modern technology and
                culture.
              </p>

              <h6 className="fw-bold mt-3">What We Cover</h6>
              <ul>
                <li className="text-muted">
                  In-depth articles on emerging technologies, AI, and software
                  development.
                </li>
                <li className="text-muted">
                  Insights into business trends, startups, and digital
                  innovation.
                </li>
                <li className="text-muted">
                  Thoughtful perspectives on culture, lifestyle, and modern
                  society.
                </li>
                <li className="text-muted">
                  Practical guides and curated resources to help you grow —{" "}
                  <Link
                    to="/stories"
                    className="text-decoration-none fw-semibold"
                  >
                    explore our latest stories →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* STATS */}
      <section className="py-4 border-top border-bottom text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <h3 className="stat-number-about">1.4K+</h3>
              <p className="text-muted">Articles Published</p>
            </div>

            <div className="col-md-3">
              <h3 className="stat-number-about">720+</h3>
              <p className="text-muted">Projects</p>
            </div>

            <div className="col-md-3">
              <h3 className="stat-number-about">899+</h3>
              <p className="text-muted">Happy Readers</p>
            </div>

            <div className="col-md-3">
              <h3 className="stat-number-about">15+</h3>
              <p className="text-muted">Years Experience</p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA SECTION */}
      <section
        style={{
          backgroundImage: "url(About/group.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 0",
          color: "white",
        }}
      >
        <div className="container text-center">
          <h2>
            Do meaningful work with our <br />
            powerful content platform
          </h2>
          <p className="mt-3">
            Join a community of curious minds and explore knowledge like never
            before.
          </p>

          <button className="btn btn-light mt-3">Discover More</button>
        </div>
      </section>



      {/* SERVICES */}
      <section className="py-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4 about-card">
              <div className="p-4 shadow-sm">
                <h5 className="text-dark">Personal Content</h5>
                <p className="text-muted">
                  Articles crafted for individual learning journeys.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4 about-card">
              <div className="p-4 shadow-sm">
                <h5 className="text-dark">Mass Knowledge</h5>
                <p className="text-muted">
                  Scalable content for large audiences.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4 about-card">
              <div className="p-4 shadow-sm">
                <h5 className="text-dark">Event Insights</h5>
                <p className="text-muted">
                  Real-time updates and curated event content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* TEAM */}
      <section id="team-section" className="py-5 bg-light">
        <div className="container text-center">
          <h3 className="mb-4">We serve uniqueness because you are unique</h3>

          <div className="row">
            <div className="col-md-3 text-center team-card">
              <img src="About/vexel.jpeg" alt="VEXEL" className="team-img mb-3"/>
              <h6 className="fw-bold mb-1">VEXEL</h6>
              <p className="text-muted small">Founder</p>
            </div>

            <div className="col-md-3 text-center team-card">
            <img src="About/Mellisa.jpg" alt="Melisa" className="team-img mb-3"/>
              <h6 className="fw-bold mb-1">MELLISA</h6>
              <p className="text-muted small">Designer</p>
            </div>

            <div className="col-md-3 text-center team-card">
              <img src="About/Angela.jpg" alt="Melisa" className="team-img mb-3"/>
              <h6 className="fw-bold mb-1">ANGELA</h6>
              <p className="text-muted small">Developer</p>
            </div>

            <div className="col-md-3 text-center team-card">
              <img src="About/Josh.jpg" alt="Melisa" className="team-img mb-3"/>
              <h6 className="fw-bold mb-1">JOSH</h6>
              <p className="text-muted small">Manager</p>
            </div>

            <h3 className="mb-3 mt-5">What We Offer</h3>
            <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
                <img className="offer-img" src="/About/content.png" alt="content"/>
                <h4 className="mt-3">Quality Content</h4>
                <p className="text-muted">
                We publish well-researched articles that simplify complex ideas and deliver meaningful insights.
                </p>
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
                <img className="offer-img" src="/About/explore.png" alt="explore"/>
                <h4 className="mt-3">Curated Stories</h4>
                <p className="text-muted">
                Discover trending stories across technology, culture, and innovation — all in one place.
                </p>
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
                <img className="offer-img" src="/About/community.png" alt="community"/>
                <h4 className="mt-3">Community Driven</h4>
                <p className="text-muted">
                Engage with ideas, share perspectives, and grow with a community of curious minds.
                </p>
            </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
