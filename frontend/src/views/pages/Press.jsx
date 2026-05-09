import React from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { useLocation } from "react-router-dom";

function Press() {
  const location = useLocation();

  if (location.pathname !== "/press") {
    window.scrollTo(0, 0);
  }
  return (
    <>
      <Header />

      {/* HERO */}
      <section style={{ background: "#f8f9fa", padding: "60px 0", textAlign: "center" }}>
        <div className="container">
          <h1 className="fw-bold">Press & Community</h1>
          <p className="text-muted">
            What people are saying about Curious Chronicle.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-5">
        <div className="container col-lg-8">

          {/* ABOUT */}
          <h3 className="mb-3">About Curious Chronicle</h3>
          <p className="text-muted">
            Curious Chronicle is a modern content platform focused on delivering
            meaningful, well-researched, and engaging stories across technology,
            culture, and innovation.
          </p>

          {/* MEDIA / CHANNEL REVIEWS */}
          <h3 className="mt-5 mb-3">In the Media</h3>

          <div className="press-card mb-3">
            <h6>📰 Tech Blogger Daily</h6>
            <p className="text-muted small">
              “Curious Chronicle delivers a refreshing take on modern blogging with clarity and depth.”
            </p>
          </div>

          <div className="press-card mb-3">
            <h6>📢 DevTalks Community</h6>
            <p className="text-muted small">
              “A must-visit platform for developers and tech enthusiasts looking for quality insights.”
            </p>
          </div>

          <div className="press-card mb-3">
            <h6>🌐 Startup Weekly</h6>
            <p className="text-muted small">
              “One of the most promising content platforms focusing on meaningful storytelling.”
            </p>
          </div>

          {/* USER REVIEWS */}
          <h3 className="mt-5 mb-3">What Our Readers Say</h3>

          <div className="press-card mb-3">
            <p className="text-muted small">
              “I love how articles are simple yet deep. It actually helps me learn faster.”
            </p>
            <h6 className="mb-0">— Ankit Sharma</h6>
          </div>

          <div className="press-card mb-3">
            <p className="text-muted small">
              “The clean UI and curated content make it addictive to read every day.”
            </p>
            <h6 className="mb-0">— Priya Verma</h6>
          </div>

          <div className="press-card mb-3">
            <p className="text-muted small">
              “Finally a platform that values quality over clickbait.”
            </p>
            <h6 className="mb-0">— Rahul Das</h6>
          </div>

          {/* UPDATES */}
          <h3 className="mt-5 mb-3">Latest Updates</h3>

          <div className="press-card mb-3">
            <h6>🚀 Platform Launch</h6>
            <p className="text-muted small">
              Curious Chronicle launched with a focus on curated and meaningful content.
            </p>
          </div>

          <div className="press-card mb-3">
            <h6>✨ New Features</h6>
            <p className="text-muted small">
              Added trending stories, bookmarks, and personalized feeds.
            </p>
          </div>

          {/* CONTACT */}
          <h3 className="mt-5 mb-3">Media Contact</h3>

          <p className="text-muted">
            For collaborations, press coverage, or interviews:
          </p>

          <p className="fw-semibold">
            contact@curiouschronicle.com
          </p>

        </div>
      </section>

      <Footer />
    </>
  );
}

export default Press;