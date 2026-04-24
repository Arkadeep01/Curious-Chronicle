import { useEffect } from "react";
import Header from "../partials/header";
import Footer from "../partials/footer";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../../utils/auth";
import Toast from "../../plugin/toast";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout();

                Toast("success", "Logged out successfully");

                // optional delay for UX
                setTimeout(() => {
                    navigate("/login/");
                }, 1000);

            } catch (err) {
                console.error(err);
                Toast("error", "Logout failed");
            }
        };

        performLogout();
    }, [navigate]);

    return (
        <>
            <Header />

            <section
                className="container d-flex flex-column justify-content-center vh-100"
                style={{ marginTop: "80px" }}
            >
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-8">

                        <div className="card shadow-lg border-0 text-center">
                            <div className="card-body p-5">

                                <h2 className="fw-bold mb-2">
                                    You’ve been logged out
                                </h2>

                                <p className="text-muted mb-4">
                                    Thanks for visiting — see you again soon.
                                </p>

                                <div className="d-flex gap-2">
                                    <Link
                                        to="/login/"
                                        className="btn btn-primary w-100"
                                    >
                                        Login
                                        <i className="fas fa-sign-in-alt ms-2"></i>
                                    </Link>

                                    <Link
                                        to="/register/"
                                        className="btn btn-outline-primary w-100"
                                    >
                                        Register
                                        <i className="fas fa-user-plus ms-2"></i>
                                    </Link>
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

export default Logout;
