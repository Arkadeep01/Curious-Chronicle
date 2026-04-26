import React from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Contact() {
  return (
    <>
      <Header />

      {/* HERO */}
      <section
        style={{
          background: "#f8f9fa",
          padding: "60px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h1 className="fw-bold logo">Get in Touch</h1>
          <p className="text-muted">
            Have a question, idea, or feedback? Let’s talk.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">

            {/* LEFT SIDE (INFO) */}
            <div className="col-md-5">

              <h4 className="mb-4">Contact Information</h4>

              <div className="mb-4 contact-card">
                <FaMapMarkerAlt className="icon" />
                <div>
                  <h6>Location</h6>
                  <p>Kolkata, India</p>
                </div>
              </div>

              <div className="mb-4 contact-card">
                <FaEnvelope className="icon" />
                <div>
                  <h6>Email</h6>
                  <p>contact@curiouschronicle.com</p>
                </div>
              </div>

              <div className="mb-4 contact-card">
                <FaPhone className="icon" />
                <div>
                  <h6>Phone</h6>
                  <p>+91 90000 00000</p>
                </div>
              </div>

              {/* MAP */}
              <a href="https://www.google.com/maps/place/Supreme+Knowledge+Foundation" target="_blank">
                <iframe
                    className="w-100 rounded"
                    src="https://www.google.com/maps?q=Supreme+Knowledge+Foundation+Group+of+Institutions&output=embed"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
              </a>

            </div>

            {/* RIGHT SIDE (FORM) */}
            <div className="col-md-7">

              <h4 className="mb-4">Send a Message</h4>

              <form className="modern-form">

                <div className="row">

                  <div className="col-md-6 mb-3">
                    <input type="text" placeholder="Your Name" required />
                  </div>

                  <div className="col-md-6 mb-3">
                    <input type="email" placeholder="Your Email" required />
                  </div>

                  <div className="col-12 mb-3">
                    <input type="text" placeholder="Subject" required />
                  </div>

                  <div className="col-12 mb-3">
                    <textarea rows="5" placeholder="Your Message" required />
                  </div>

                  <div className="col-12">
                    <button className="modern-btn w-100">
                      Send Message →
                    </button>
                  </div>

                </div>

              </form>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;