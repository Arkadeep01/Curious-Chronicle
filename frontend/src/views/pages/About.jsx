import React from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";

function About() {
    return (
        <>
            <Header />

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto">
                            <h2>Our Story</h2>
                            <p className="lead">
                                Curious Chronicle was founded with a simple yet powerful idea — to create a space where curiosity meets clarity. In an age overwhelmed by noise, we strive to deliver meaningful, well-researched, and thought-provoking content that informs, inspires, and empowers readers worldwide.
                            </p>
                            <p>
                                What began as a passion project has evolved into a growing platform dedicated to storytelling across technology, culture, business, and everyday life. We believe that knowledge should be accessible, engaging, and impactful. Every article published on Curious Chronicle is crafted with precision, authenticity, and a commitment to quality.
                                <br /><br />
                                Our mission is not just to inform, but to spark curiosity — encouraging readers to question, explore, and think deeper. Whether it's breaking down complex tech concepts, sharing insights on modern trends, or highlighting human stories, we aim to deliver content that truly matters.
                            </p>

                            <h3 className="mt-4">What We Cover</h3>
                            <ul>
                                <li>In-depth articles on emerging technologies, AI, and software development.</li>
                                <li>Insights into business trends, startups, and digital innovation.</li>
                                <li>Thoughtful perspectives on culture, lifestyle, and modern society.</li>
                                <li>
                                    Practical guides and resources to help you grow —{" "}
                                    <a href="#">
                                        <u>learn more with our curated content.</u>
                                    </a>
                                </li>
                            </ul>

                            <h3 className="mb-3 mt-5">Our Team</h3>
                            <div className="row g-4">
                                <div className="col-sm-6 col-lg-3">
                                    <div className="text-center">
                                        <div className="avatar avatar-xxl mb-2">
                                            <img
                                                className="avatar-img rounded-circle"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=1000"
                                                alt="avatar"
                                            />
                                        </div>
                                        <h5>Louis Ferguson</h5>
                                        <p className="m-0">Founder & Editor-in-Chief</p>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-lg-3">
                                    <div className="text-center">
                                        <div className="avatar avatar-xxl mb-2">
                                            <img
                                                className="avatar-img rounded-circle"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVSPtLWfht2p015onFngljcoIuA9xc8h3RLA"
                                                alt="avatar"
                                            />
                                        </div>
                                        <h5>Frances Guerrero</h5>
                                        <p className="m-0">Managing Editor</p>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-lg-3">
                                    <div className="text-center">
                                        <div className="avatar avatar-xxl mb-2">
                                            <img
                                                className="avatar-img rounded-circle"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                src="https://www.byrdie.com/thmb/aZWxblVz7BMxeObHtJEKX_ddV3c=/1500x0/"
                                                alt="avatar"
                                            />
                                        </div>
                                        <h5>Larry Lawson</h5>
                                        <p className="m-0">Creative Director</p>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-lg-3">
                                    <div className="text-center">
                                        <div className="avatar avatar-xxl mb-2">
                                            <img
                                                className="avatar-img rounded-circle"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                                src="https://static.vecteezy.com/system/resources/previews/036/442/773/non_2x/"
                                                alt="avatar"
                                            />
                                        </div>
                                        <h5>Louis Crawford</h5>
                                        <p className="m-0">Senior Content Strategist</p>
                                    </div>
                                </div>
                            </div>

                            {/* Services */}
                            <h3 className="mb-3 mt-5">What We Do</h3>
                            <div className="row">
                                <div className="col-md-6 col-lg-4 mb-4">
                                    <img
                                        className="rounded"
                                        style={{ width: "100%", height: "170px", objectFit: "cover" }}
                                        src="https://www.aspistrategist.org.au/wp-content/uploads/2023/11/GettyImages-467714941-1024x764.jpg"
                                        alt="Card"
                                    />
                                    <h4 className="mt-3">Insightful Journalism</h4>
                                    <p>
                                        Delivering accurate, well-researched, and timely articles that cut through the noise and provide real value.
                                    </p>
                                </div>

                                <div className="col-md-6 col-lg-4 mb-4">
                                    <img
                                        className="rounded"
                                        style={{ width: "100%", height: "170px", objectFit: "cover" }}
                                        src="https://www.varletmachines.com/sites/default/files/styles/large/public/2022-04/Commercial.png"
                                        alt="Card"
                                    />
                                    <h4 className="mt-3">Digital Content Strategy</h4>
                                    <p>
                                        Crafting content that resonates with modern audiences, combining storytelling with data-driven insights.
                                    </p>
                                </div>

                                <div className="col-md-6 col-lg-4 mb-4">
                                    <img
                                        className="rounded"
                                        style={{ width: "100%", height: "170px", objectFit: "cover" }}
                                        src="https://www.columbiasouthern.edu/media/azmjow33/fire-ems-cj-public-service.jpg"
                                        alt="Card"
                                    />
                                    <h4 className="mt-3">Community Engagement</h4>
                                    <p>
                                        Building a community of curious minds through meaningful discussions, feedback, and shared knowledge.
                                    </p>
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

export default About;
