import React from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

function Contact() {
    return (
        <>
            <Header />

            {/* Hero */}
            <section className="mt-5 text-center">
                <div className="container">
                    <h1 className="fw-bold">Contact Curious Chronicle</h1>
                    <p className="text-muted">
                        Have a question, collaboration idea, or feedback? We’d love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="pt-4">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto">

                            {/* Map */}
                            <iframe
                                className="w-100 rounded"
                                src="https://www.google.com/maps?q=Kolkata&output=embed"
                                height={400}
                                style={{ border: 0 }}
                                loading="lazy"
                            />

                            {/* Info Cards */}
                            <div className="row mt-5 text-center">

                                <div className="col-md-4 mb-4">
                                    <FaMapMarkerAlt size={30} className="mb-2 text-primary" />
                                    <h5>Our Office</h5>
                                    <p className="text-muted">
                                        Kolkata, West Bengal<br />
                                        India
                                    </p>
                                </div>

                                <div className="col-md-4 mb-4">
                                    <FaEnvelope size={30} className="mb-2 text-primary" />
                                    <h5>Email</h5>
                                    <p className="text-muted">
                                        contact@curiouschronicle.com
                                    </p>
                                </div>

                                <div className="col-md-4 mb-4">
                                    <FaPhone size={30} className="mb-2 text-primary" />
                                    <h5>Call Us</h5>
                                    <p className="text-muted">
                                        +91 90000 00000
                                    </p>
                                </div>

                            </div>

                            <div className="text-center mb-5">
                                <FaClock size={25} className="mb-2 text-primary" />
                                <p className="text-muted">
                                    Support Hours: Monday – Saturday, 9:30 AM – 6:00 PM
                                </p>
                            </div>

                            <hr className="my-5" />

                            {/* Contact Form */}
                            <div className="row mb-5">
                                <div className="col-12">
                                    <h2 className="fw-bold">Send us a message</h2>
                                    <p className="text-muted">
                                        Fill out the form and our team will get back to you within 24 hours.
                                    </p>

                                    <form className="contact-form">

                                        <div className="row">

                                            <div className="col-md-6 mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Your Name"
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Your Email"
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-12 mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Subject"
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-12 mb-3">
                                                <textarea
                                                    className="form-control"
                                                    rows={5}
                                                    placeholder="Your Message"
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-12">
                                                <button className="btn btn-primary w-100">
                                                    Send Message
                                                </button>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Contact;
